import { Component, effect, inject, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { debounceTime, fromEvent, Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { Chart, ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';

import { IRate, IRateRaw } from '../datasource/caseweigher.model';
import { IExportCriteria } from '../../standard-report/standard-report.component';
import { CaseweigherService } from '../datasource/caseweigher.service';
import { HomeService } from '../../../home.service';
import { TimeFrame } from '../../report.models';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-rate',
  imports: [],
  templateUrl: './caseweigher-rate.component.html',
  styleUrl: './caseweigher-rate.component.scss',
})
export class CaseweigherRateComponent implements OnInit, OnDestroy {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  chart: Chart | null = null;
  homeService = inject(HomeService);
  caseweigherService = inject(CaseweigherService);
  httpClient = inject(HttpClient);

  resizeObservable$: Observable<Event> = new Observable<Event>();
  resizeSubscription$: Subscription = new Subscription();
  response: IRate[] = [];
  exportSubscription = new Subscription();
  httpResponseSubscription = new Subscription();
  rowData: any[] = [];
  showMissingData = true;
  //chartLoaded = false;

  setDarkMode = effect(() => {
    this.homeService.isDarkMode();
    this.drawChart(this.response);
  });

  formGroupValueChangedSubscription = new Subscription();

  ngOnInit(): void {
    this.caseweigherService.frmGroup.get('report')?.setValue('Rate');
    this.caseweigherService.disableRefresh.set(true);
    this.caseweigherService.disableExport.set(true);
    this.caseweigherService.allowAllServersSelection.set(false);

    // Initialize Chart.js instead of Google Charts
    this.initializeChart();
    // this.chartLoaded = true;
    this.caseweigherService.disableRefresh.set(false);
    this.caseweigherService.disableExport.set(false);
    this.loadData();

    this.exportSubscription = this.caseweigherService.exportReportEvent$.subscribe((criteria: IExportCriteria) => {
      this.onExport(criteria);
    });

    this.formGroupValueChangedSubscription = this.caseweigherService.frmGroup.get('serverIndex').valueChanges.subscribe((frm: any) => {
      this.drawChart(this.response);
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    this.resizeSubscription$ && this.resizeSubscription$.unsubscribe();
    this.exportSubscription && this.exportSubscription.unsubscribe();
    this.httpResponseSubscription && this.httpResponseSubscription.unsubscribe();
    this.formGroupValueChangedSubscription && this.formGroupValueChangedSubscription.unsubscribe();
  }

  async populateData(selectedServerIndex: number = this.caseweigherService.frmGroup.get('serverIndex')?.value) {
    this.response = this.caseweigherService.rateResponse.filter((e) => e.serverIndex === selectedServerIndex);
    this.drawChart(this.response);
  }

  async loadData() {
    //initialize the chart
    this.populateData();

    this.httpResponseSubscription = this.caseweigherService.httpResponseEvent$.subscribe((event: string) => {
      if (event === 'rate-refresh') {
        this.populateData();
      }
    });

    this.onResize();
  }

  initializeChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Count',
            data: [],
            borderColor: this.getThemeColor('--mat-sys-primary'),
            backgroundColor: this.getThemeColor('--mat-sys-surface-container'),
            borderWidth: 1,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0,
          },
        ],
      },
      options: this.getChartOptions(),
    });
  }

  getChartOptions(): ChartConfiguration['options'] {
    const primaryColor = this.getThemeColor('--mat-sys-primary');
    const textColor = this.getThemeColor('--mat-sys-on-surface');
    const backgroundColor = this.getThemeColor('--mat-sys-surface-container');
    const gridlineColor = this.getThemeColor('--mat-sys-outline-variant');

    return {
      responsive: true,
      maintainAspectRatio: false,
      backgroundColor: backgroundColor,
      plugins: {
        title: {
          display: true,
          text: this.getChartTitle(),
          color: textColor,
          font: {
            family: 'Roboto',
            size: 18,
          },
        },
        legend: {
          position: 'bottom',
          labels: {
            color: textColor,
            font: {
              family: 'Roboto',
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColor,
            font: {
              family: 'Roboto',
            },
          },
          grid: {
            color: gridlineColor,
          },
        },
        y: {
          ticks: {
            color: textColor,
            font: {
              family: 'Roboto',
            },
          },
          grid: {
            color: gridlineColor,
          },
        },
      },
    };
  }

  drawChart(chartEvent: IRate[]) {
    if (!this.chart) return;

    const hasData = chartEvent && chartEvent.length > 0;
    const rates: IRateRaw[] = hasData ? chartEvent.slice(-1440) : [];
    const NoDataMsg = hasData ? '' : '-- No Data';

    let missingData = this.missingData(this.caseweigherService.startUnix - 60, rates[0]?.timestamp ?? this.caseweigherService.stopUnix);

    rates.splice(0, 0, ...missingData);
    for (let i = 1; i < rates.length; i++) {
      if (rates[i].timestamp - rates[i - 1].timestamp > 60) {
        missingData = this.missingData(rates[i - 1].timestamp, rates[i].timestamp);
        rates.splice(i, 0, ...missingData);
      }
    }
    if (rates.length > 0) {
      missingData = this.missingData(rates[rates.length - 1].timestamp, this.caseweigherService.stopUnix);
      rates.push(...missingData);
    }

    // Convert data for Chart.js format
    const labels = rates.map((event) => formatDate(event.timestamp * 1000, 'M/dd/yyyy h:mm a', 'en-US'));
    const data = rates.map((event) => event.count);
    this.rowData = rates.map((event) => [formatDate(event.timestamp * 1000, 'M/dd/yyyy h:mm a', 'en-US'), event.count]);

    // Update chart data
    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = data;
    this.chart.data.datasets[0].borderColor = this.getThemeColor('--mat-sys-primary');

    //@ts-ignore
    this.chart.options = this.getChartOptions();

    this.chart.update();

    // Generate chart image for export (Chart.js method)
    setTimeout(() => {
      this.caseweigherService.chartImg = this.chart?.toBase64Image() || '';
    }, 100);
  }

  getChartTitle(): string {
    const serverIndex = this.caseweigherService.frmGroup.get('serverIndex')?.value;
    const serverName = this.caseweigherService.servers.find((s) => s.index === serverIndex)?.server ?? 'Invalid Server!';

    let date = TimeFrame.Live.toString();
    const frm = this.caseweigherService.frmGroup.value;

    if (frm.timeframe === TimeFrame.Archive || frm.timeframe === TimeFrame.DateShift) {
      date = formatDate(frm.date, 'M/dd/yyyy', 'en-US');
      date = `Date: ${date} ${this.homeService.serverMap.appConfig.shifts[frm.shift - 1].name}`;
    }

    if (frm.timeframe === TimeFrame.Custom) {
      const startDT = new Date(formatDate(frm.date, 'M/dd/yyyy ', 'en-US') + frm.fromTime);
      const stopDT = new Date(formatDate(frm.toDate, 'M/dd/yyyy ', 'en-US') + frm.toTime);
      date = `${formatDate(startDT, 'M/dd/yyyy h:mm a', 'en-US')} - ${formatDate(stopDT, 'M/dd/yyyy h:mm a', 'en-US')}`;
    }

    return `Rate chart -- ${serverName} -- ${date}`;
  }

  // ...existing code for missingData, median, onResize, onExport, parseLightDarkColor, getThemeColor methods...

  missingData(lastTimestamp: number, currentTimestamp: number) {
    const frm = this.caseweigherService.frmGroup.value;
    if (!frm.showMissingData) return [];
    const diff = (currentTimestamp - lastTimestamp) / 60 - 1;
    const missingData: IRateRaw[] = [];

    for (let i: number = 1; i <= diff; i++) {
      missingData.push({ timestamp: lastTimestamp + i * 60, count: 0 });
    }
    return missingData;
  }

  median(arr: number[]) {
    const mid = Math.floor(arr.length / 2);
    const sortedArr = arr.sort((a, b) => a - b);

    if (arr.length % 2 === 0) {
      return (sortedArr[mid - 1] + sortedArr[mid]) / 2;
    } else {
      return sortedArr[mid];
    }
  }

  onResize() {
    // Clean up old listener if exists
    if (this.resizeSubscription$) {
      this.resizeSubscription$.unsubscribe();
    }

    // Debounce resize events
    this.resizeObservable$ = fromEvent(window, 'resize').pipe(
      debounceTime(250) // Only redraw after 250ms of no resize events
    );

    this.resizeSubscription$ = this.resizeObservable$.subscribe(() => {
      this.drawChart(this.response);
    });
  }
  onExport(exportCriteria: IExportCriteria) {
    // let colHeaders = [',Count,Timestamp'];

    let rows = new Array();
    rows.push(exportCriteria.header);
    rows.push('');
    // rows.push(colHeaders);

    this.rowData.forEach((e) => {
      let cols = new Array();
      cols.push('');
      // cols.push(e.line);
      //cols.push('serverName');
      cols.push(e[0]);
      cols.push(e[1]);

      rows.push(cols.join(','));
    });

    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', exportCriteria.fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Parses a light-dark color value string and returns both color values
   *
   * @param colorString String in format 'light-dark(#lightColor, #darkColor)'
   * @returns Object with light and dark color values or null if invalid format
   */
  parseLightDarkColor(colorString: string): { light: string; dark: string } | null {
    // Check if the string matches expected format
    const regex = /light-dark\(([^,]+),\s*([^)]+)\)/;
    const match = colorString.match(regex);

    if (!match || match.length !== 3) {
      console.error('Invalid color format. Expected: light-dark(#lightColor, #darkColor)');
      return null;
    }

    // Extract the color values
    const lightColor = match[1].trim();
    const darkColor = match[2].trim();

    return {
      light: lightColor,
      dark: darkColor,
    };
  }

  // In your caseweigher-rate.component.ts
  getThemeColor(colorVariable: string): string {
    const cssVar = getComputedStyle(document.documentElement).getPropertyValue(colorVariable) || '';

    // Check if this is a light-dark format
    if (cssVar.startsWith('light-dark(')) {
      const colors = this.parseLightDarkColor(cssVar);
      if (colors) {
        // Return the appropriate color based on current theme
        const isDarkMode = document.body.classList.contains('dark-mode');
        return isDarkMode ? colors.dark : colors.light;
      }
    }

    // Return the value as-is if it's not light-dark format
    return cssVar;
  }
}
