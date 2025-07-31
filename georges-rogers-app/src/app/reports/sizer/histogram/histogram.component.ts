import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild, ElementRef, effect } from '@angular/core';

import { IWeightDistribution } from './interface';
import { fromEvent, Observable, Subscription } from 'rxjs';

import { formatDate, formatNumber } from '@angular/common';
import { SizerService } from '../datasource/sizer.service';
import { IDetail } from '../datasource/sizer.model';
import { IExportCriteria } from '../../standard-report/standard-report.component';
import { TimeFrame } from '../../report.models';
import { Chart, ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-histogram',
  standalone: true,
  imports: [],
  templateUrl: './histogram.component.html',
  styleUrl: './histogram.component.scss',
})
export class HistogramComponent implements OnInit, OnDestroy {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  chart: Chart | null = null;
  sizerService = inject(SizerService);
  httpClient = inject(HttpClient);
  resizeObservable$: Observable<Event> | null = null;
  resizeSubscription$: Subscription | null = null;
  response: IDetail[] = [];
  exportSubscription = new Subscription();
  httpResponseSubscription = new Subscription();
  routeEventSubscription = new Subscription();

  rowData: any[] = [];
  grandTotals: any;
  displayedColumns = ['Weight(g)', 'Count'];
  chartLoaded = false;

  setDarkMode = effect(() => {
    this.sizerService.homeService.isDarkMode();
    this.drawChart(this.response);
  });

  ngOnInit(): void {
    this.sizerService.dataSourceDetails.data = [];
    this.initializeChart();
    this.chartLoaded = true;
    this.loadData();

    this.exportSubscription = this.sizerService.exportReportEvent$.subscribe((criteria: IExportCriteria) => {
      this.onExport(criteria);
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    this.resizeSubscription$ && this.resizeSubscription$.unsubscribe();
    this.exportSubscription && this.exportSubscription.unsubscribe();
    this.httpResponseSubscription && this.httpResponseSubscription.unsubscribe();
    this.routeEventSubscription && this.routeEventSubscription.unsubscribe();
  }

  getChartTitle(): string {
    const serverIndex = this.sizerService.frmGroup.get('serverIndex')?.value;
    const serverName = this.sizerService.servers.find((s) => s.index === serverIndex)?.server ?? 'Invalid Server!';

    let date = TimeFrame.Live.toString();
    const frm = this.sizerService.frmGroup.value;

    if (frm.timeframe === TimeFrame.Archive || frm.timeframe === TimeFrame.DateShift) {
      date = formatDate(frm.date, 'M/dd/yyyy', 'en-US');
      date = `Date: ${date} ${this.sizerService.homeService.serverMap.appConfig.shifts[frm.shift - 1].name}`;
    }

    if (frm.timeframe === TimeFrame.Custom) {
      const startDT = new Date(formatDate(frm.date, 'M/dd/yyyy ', 'en-US') + frm.fromTime);
      const stopDT = new Date(formatDate(frm.toDate, 'M/dd/yyyy ', 'en-US') + frm.toTime);
      date = `${formatDate(startDT, 'M/dd/yyyy h:mm a', 'en-US')} - ${formatDate(stopDT, 'M/dd/yyyy h:mm a', 'en-US')}`;
    }

    return `Histogram chart -- ${serverName} -- ${date}`;
  }

  initializeChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Count',
            data: [],
            backgroundColor: this.getThemeColor('--mat-sys-primary'),
            borderColor: this.getThemeColor('--mat-sys-primary'),
            borderWidth: 1,
            barThickness: 1,
            maxBarThickness: 2,
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
        tooltip: {
          callbacks: {
            title: function (context) {
              return `Weight: ${context[0].label}g`;
            },
            label: function (context) {
              return `Count: ${context.parsed.y}`;
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Grams',
            color: textColor,
            font: {
              family: 'Roboto',
            },
          },
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
          title: {
            display: true,
            text: 'Count',
            color: textColor,
            font: {
              family: 'Roboto',
            },
          },
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
      elements: {
        bar: {
          borderSkipped: false,
        },
      },
    };
  }

  async populateData(selectedServerIndex: number = this.sizerService.frmGroup.get('serverIndex')?.value) {
    this.response = this.sizerService.dataSourceDetails.data.filter((e) => e.serverIndex === selectedServerIndex);
    if (this.sizerService.frmGroup.valid) this.drawChart(this.response);
  }

  async loadData() {
    this.populateData();
    this.httpResponseSubscription = this.sizerService.httpResponseEvent$.subscribe((event: string) => {
      if (event === 'sizer-chart-refresh') {
        this.populateData();
      }
    });

    this.onResize();
  }

  drawChartWithTiming(trays: IDetail[]) {
    const startTime = performance.now();
    this.drawChart(trays);
    const endTime = performance.now();
    console.log(`drawChart execution time: ${endTime - startTime} milliseconds`);
  }

  drawChart(trays: IDetail[]) {
    if (!this.chart) return;

    const bucketSize = 1;
    const frm = this.sizerService.frmGroup.value;

    const hasData = trays && trays.length > 0;
    const NoDataMsg = hasData ? '' : '-- No Data';
    const weights = hasData ? trays.slice(-75000) : [];

    let { min, max } = weights.reduce(
      (acc, wt) => {
        return {
          min: Math.min(acc.min, wt.net_g),
          max: Math.max(acc.max, wt.net_g),
        };
      },
      { min: 0, max: 0 }
    );

    min = frm.min ? frm.min : min;
    max = frm.max ? frm.max : max;

    const bucketCount = Math.floor((max - min) / bucketSize);
    const weightDistribution: IWeightDistribution[] = [];

    let bucket = min;
    for (let i = 0; i <= bucketCount; i++) {
      weightDistribution.push({ key: bucket, value: 0 });
      bucket += bucketSize;
    }

    weights.forEach((p: IDetail) => {
      if (p.net_g < min || p.net_g > max) return;
      const bucket = Math.floor((p.net_g - min) / bucketSize);
      weightDistribution[bucket].value++;
    });

    const serverIndex = this.sizerService.frmGroup.get('serverIndex')?.value;
    const serverName = this.sizerService.servers.find((s) => s.index === serverIndex)?.server ?? 'Invalid Server!';

    let date = TimeFrame.Live.toString();
    if (frm.timeframe === TimeFrame.Archive || frm.timeframe === TimeFrame.DateShift) {
      date = formatDate(frm.date, 'M/d/yyyy', 'en-US');
      date = `Date: ${date} ${this.sizerService.homeService.serverMap.appConfig.shifts[frm.shift - 1].name}`;
    }

    if (frm.timeframe === TimeFrame.Custom) {
      const startDT = new Date(formatDate(frm.date, 'M/dd/yyyy ', 'en-US') + frm.fromTime);
      const stopDT = new Date(formatDate(frm.toDate, 'M/dd/yyyy ', 'en-US') + frm.toTime);
      date = `${formatDate(startDT, 'M/dd/yyyy h:mm a', 'en-US')} - ${formatDate(stopDT, 'M/dd/yyyy h:mm a', 'en-US')}`;
    }

    // Calculate median for annotation
    const medianWeight = this.median(weights.map((e) => e.net_g));

    // Prepare data for Chart.js
    const labels = weightDistribution.map((e) => e.key.toString());
    const data = weightDistribution.map((e) => e.value);
    const backgroundColors = weightDistribution.map((e) => (e.key === medianWeight ? '#ff6384' : this.getThemeColor('--mat-sys-primary')));

    // Update chart data
    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = data;
    this.chart.data.datasets[0].backgroundColor = backgroundColors;
    this.chart.data.datasets[0].borderColor = backgroundColors;

    //@ts-ignore
    this.chart.options = this.getChartOptions();

    this.chart.update();

    // Prepare row data for export
    this.rowData = weightDistribution.map((e) => [
      e.key.toString(),
      e.value,
      true, // isInRange
      e.key === medianWeight ? 'Median' : null,
      e.key === medianWeight ? `Median: ${medianWeight}` : null,
    ]);

    // Generate chart image for export
    setTimeout(() => {
      this.sizerService.chartImg = this.chart?.toBase64Image() || '';
    }, 100);
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

  // In your sizer-rate.component.ts
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
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((e) => {
      this.drawChart(this.response);
    });
  }

  onExport(exportCriteria: IExportCriteria) {
    let colHeaders = [',Weight,Count'];

    let rows = new Array();
    rows.push(exportCriteria.header);
    rows.push('');
    rows.push(colHeaders);

    this.rowData.forEach((e) => {
      let cols = new Array();
      cols.push('');
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
}
