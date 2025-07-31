import { AfterViewInit, Component, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
//import { ICheckerReport, CutterInterface, CutIndexEnum, cutNamesAndIndex } from 'src/app/models';
//import { GrandTotals } from '../grand-totals';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule, DatePipe, formatDate, formatNumber } from '@angular/common';
import { Subject } from 'rxjs';

//import { IFieldName, IFilterStandard } from '../report.models';
//import { ReportService } from '../report.service';

import { MatCard, MatCardModule } from '@angular/material/card';
import { MatSortCacheDirective } from '../../mat-sort-cache.directive';

export interface IExportCriteria {
  reportName: string;
  header: string;
  fileName: string;
  //displayedColumns: string[];
}

export interface IFieldName {
  column: string;
  rowField?: string;
  footerfield?: string;
  name: string;
  format?: string;
}

@Component({
  selector: 'app-standard-report',
  standalone: true,
  imports: [MatTableModule, MatSortModule, DatePipe, MatSortCacheDirective, MatPaginatorModule], //MatPaginator
  templateUrl: './standard-report.component.html',
  styleUrls: ['./standard-report.component.scss', '../../../styles/table.scss'],
})
export class StandardReportComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() grandTotals: any;
  //@ts-ignore
  @Input() dataSource: MatTableDataSource<any>;
  @Input() displayedColumns: string[] = [];

  @Input() exportSignal: Subject<IExportCriteria> = new Subject<IExportCriteria>();
  @Input() sortBy: string = 'gate';
  @Input() sortDirection: 'asc' | 'desc' = 'desc';
  @Input() paginator: MatPaginator | null = null;
  //@ts-ignore
  @ViewChild(MatSort) sort: MatSort;

  //if no rowField, then use column name
  //if no footerField, then use column name

  fieldNames: IFieldName[] = [
    { column: 'serverName', name: 'Server' },
    { column: 'station_name', name: 'Station' },

    { column: 'in_lbs', name: 'In(lbs)', format: '1.0-2' },
    { column: 'out_lbs', name: 'Out(lbs)', format: '1.0-2' },
    { column: 'yield_percent', name: 'Yield', format: '1.0-2' },
    { column: 'qc_fail_count', name: 'QC Fail', format: '1.0-2' },
    { column: 'qc_pass_count', name: 'QC Pass', format: '1.0-2' },
    { column: 'qc_score', name: 'QC Score', format: '1.0-2' },

    { column: 'work_seconds', name: 'Work Seconds', format: '1.0-0' },
    { column: 'ppmh', name: 'PPMH', format: '1.0-2' },
    { column: 'hours', name: 'Hours', format: '1.0-2' },
    { column: 'total', name: 'Total', format: '1.0-0' },
    { column: 'count', name: 'Count', format: '1.0-0' },
    { column: 'mean', name: 'Mean', format: '1.0-2' },
    { column: 'over', name: 'Over', format: '1.0-0' },
    { column: 'under', name: 'Under', format: '1.0-0' },
    { column: 'cpm', name: 'CPM', format: '1.0-2' },

    { column: 'updated', name: 'Updated', format: 'Date:M/d/yy h:mm:ss a' },
    { column: 'high_limit', name: 'High Limit', format: '1.0-2' },
    { column: 'low_limit', name: 'Low Limit', format: '1.0-2' },
    { column: 'status', name: 'Status' },
    { column: 'timestamp', name: 'Timestamp', format: 'Date:M/d/yy h:mm:ss a' },

    { column: 'gross_lb', name: 'Gross', format: '1.0-0' },
    { column: 'tare_lb', name: 'Tare', format: '1.0-0' },
    { column: 'serial', name: 'Serial', format: '1.0-0' },

    { column: 'machine_state', name: 'State', format: '1.0-0' },
    { column: 'reason_code', name: 'Reason Code', format: '1.0-0' },
    { column: 'resolution', name: 'Resolution', format: '1.0-0' },
    { column: 'units', name: 'Units' },
    { column: 'stable', name: 'Stable', format: '1.0-0' },
    { column: 'scale', name: 'Scale', format: '1.0-0' },
    { column: 'cleared', name: 'Cleared', format: 'Date:M/d/yy h:mm:ss a' },

    { column: 'gate', name: 'Gate' },
    { column: 'high_g', name: 'High(g)', format: '1.0-0' },
    { column: 'low_g', name: 'Low(g)', format: '1.0-0' },
    { column: 'net_lb', name: 'Net(lb)', format: '1.0-2' },
    { column: 'net_g', name: 'Net(g)', format: '1.0-0' },

    // Yield/Poultry specific fields
    { column: 'birds', name: 'Birds', format: '1.0-0' },
    { column: 'fronts', name: 'Fronts', format: '1.0-0' },
    { column: 'fillets', name: 'Fillets', format: '1.0-0' },
    { column: 'filletYield', name: 'Fillet Yield %', format: '1.0-1' },
    { column: 'tenders', name: 'Tenders', format: '1.0-0' },
    { column: 'tenderYield', name: 'Tender Yield %', format: '1.0-1' },
    { column: 'skins', name: 'Skin', format: '1.0-0' },
    { column: 'skinYield', name: 'Skin Yield %', format: '1.0-1' },
    { column: 'wings', name: 'Wings', format: '1.0-0' },
    { column: 'wingsYield', name: 'Wings Yield %', format: '1.0-1' },
    { column: 'shells', name: 'Shells', format: '1.0-0' },
    { column: 'shellsYield', name: 'Shells Yield %', format: '1.0-1' },
    { column: 'condemned', name: 'Condemned', format: '1.0-0' },
    { column: 'condemnedYield', name: 'Condemned Yield %', format: '1.0-1' },
    { column: 'serverGroup', name: 'Server Group' },
  ];

  constructor() {}

  ngOnInit(): void {
    this.exportSignal.subscribe((e) => {
      this.onExport(e);
    });
  }

  ngOnDestroy(): void {
    this.exportSignal && this.exportSignal.unsubscribe();
  }

  getHeaderName(column: string): string {
    return this.fieldNames.find((f) => f.column === column)?.name ?? '';
  }

  ngAfterViewInit(): void {
    //if (this.dataSource) {
    //this.dataSource.filterPredicate = this.standardfilterPredicate();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.dataSource.sortingDataAccessor = (item: any, property): any => {
      // if (property.includes('net_lb')) {
      //   //const prop = property.substring(6);
      //   //console.log("item['checks']" + prop);
      //   return item['net_g'];
      //   //return (0, eval)(`item['checks']${prop}`);
      //   //return eval("item['checks']" + prop);
      // } else {
      return item[property];
      // }
    };
    //}
  }

  onExport(exportCriteria: IExportCriteria) {
    //  console.log('exporting: ', this.dataSource.data);
    let colHeaders = [''];
    this.displayedColumns.forEach((e) => {
      colHeaders.push(this.fieldNames.find((f) => f.column === e)?.name ?? '');
    });

    let rows = new Array();
    rows.push(exportCriteria.header);
    rows.push('');
    rows.push(colHeaders);
    let cutterData = this.dataSource.sortData(this.dataSource.filteredData, this.sort);

    // const checkIndexes = ['', '1', '2'];

    cutterData.forEach((e) => {
      //data row
      let cols = new Array();
      cols.push(''); //info column

      this.displayedColumns.forEach((dc: string) => {
        const f = this.fieldNames.find((f) => f.column === dc);
        if (f) {
          const value = this.getNestedValue(e, f.rowField ?? f.column);
          if (value && f.format) {
            if (f.format.includes('Date:')) {
              const format = f.format.slice(f.format.indexOf(':') + 1);
              const formattedValue = formatDate((value as number) * 1000, format, 'en-US').replace(/,/g, '');
              cols.push(formattedValue);
            } else {
              const formattedValue = formatNumber(parseFloat(value.toString()), 'en-US', f.format).replace(/,/g, '');
              cols.push(formattedValue);
            }
          } else {
            cols.push(value);
            if (!value) {
              //  console.log('missing value: ' + dc);
            }
          }
        } else {
          console.log('missing field: ' + dc);
        }
      });

      rows.push(cols.join(','));
    });

    //footer row
    if (this.grandTotals) {
      let cols = new Array();
      cols.push(''); //info column

      this.displayedColumns.forEach((dc) => {
        const f = this.fieldNames.find((f) => f.column === dc);
        if (f) {
          const value = this.getNestedValue(this.grandTotals.summary, f.footerfield ?? f.column);
          if (value && f.format) {
            if (f.format.includes('Date:')) {
              const format = f.format.slice(f.format.indexOf(':') + 1);
              const formattedValue = formatDate((value as number) * 1000, format, 'en-US').replace(/,/g, '');
              cols.push(formattedValue);
            } else {
              const formattedValue = formatNumber(parseFloat(value.toString()), 'en-US', f.format).replace(/,/g, '');
              cols.push(formattedValue);
            }
          } else {
            cols.push(value);
            if (!value) {
              //  console.log('missing GT value: ' + dc);
            }
          }
        } else {
          // console.log('missing GT field: ' + dc);
        }
      });

      rows.push(cols.join(','));
    }

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

  getNestedValue(obj: any, prop: any): string | number {
    const p = prop.split('.');
    if (p.length === 1) {
      return obj[prop] ?? '';
    } else if (p.length === 2) {
      const [prop2, index, prop3, prop4] = prop.split(/[\[\].]/).filter(Boolean);
      if (index) {
        if (prop4) return obj[prop2]?.[index]?.[prop3]?.[prop4] ?? '';
        return obj[prop2]?.[index]?.[prop3] ?? '';
      }
      return obj[prop2]?.[prop3] ?? '';
    } else {
      return 'ERROR!';
    }
  }
}
