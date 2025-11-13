import { AfterViewInit, Component, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule, DatePipe, formatDate, formatNumber, DecimalPipe } from '@angular/common';
import { Subject } from 'rxjs';

import { MatSortCacheDirective } from '../../mat-sort-cache.directive';

export interface IExportCriteria {
  reportName: string;
  header: string;
  fileName: string;
}

export interface IFieldName {
  column: string;
  rowField?: string;
  footerfield?: boolean;
  name: string;
  format?: string;
}

@Component({
  selector: 'app-standard-report',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatSortCacheDirective, MatPaginatorModule],
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
    //summary
    { column: 'server', name: 'Server' },
    { column: 'line', name: 'Line' },
    { column: 'station', name: 'Station' },
    { column: 'code', name: 'Code' },
    { column: 'description', name: 'Description' },
    { column: 'cutter', name: 'Cutter' },
    { column: 'cutterName', name: 'Cutter Name' },
    { column: 'checker', name: 'Checker' },
    { column: 'checkerName', name: 'Checker Name' },
    { column: 'aqlScore', name: 'AQL', format: '1.0-2', footerfield: true },
    { column: 'aqlStandard', name: 'AQL Standard', format: '1.0-2', footerfield: true },
    //posAqlScore
    { column: 'posAqlScore', name: 'POS AQL', format: '1.0-2', footerfield: true },
    { column: 'in_lbs', name: 'In Pounds', format: '1.0-0', footerfield: true },
    { column: 'gradeA_lbs', name: 'Pounds_A', format: '1.0-0', footerfield: true },
    { column: 'gradeA_yield', name: 'Yield_A', format: '1.0-2', footerfield: true },
    { column: 'sYieldA', name: 'STD Yield_A', format: '1.0-2', footerfield: true },
    { column: 'posYieldA', name: 'POS Yield_A', format: '1.0-2', footerfield: true },
    { column: 'gradeB_lbs', name: 'Pounds_B', format: '1.0-0', footerfield: true },
    { column: 'gradeB_yield', name: 'Yield_B', format: '1.0-2', footerfield: true },
    { column: 'total_lbs', name: 'Total Pounds', format: '1.0-0', footerfield: true },
    { column: 'overall_yield', name: 'Overall Yield', format: '1.0-2', footerfield: true },
    { column: 'hours', name: 'Hours', format: '1.0-2', footerfield: true },
    { column: 'ppmh', name: 'PPMH', format: '1.0-2', footerfield: true },
    { column: 'sppmh', name: 'STD PPMH', format: '1.0-2', footerfield: true },
    { column: 'posPpmh', name: 'POS PPMH', format: '1.0-2', footerfield: true },

    //summary copy
    { column: 'serverName', name: 'Server' },

    //{ column: 'in_lbs', name: 'In(lbs)', format: '1.0-2' },
    { column: 'out_lbs', name: 'Out(lbs)', format: '1.0-2' },
    { column: 'yield_percent', name: 'Yield', format: '1.0-2' },

    { column: 'work_seconds', name: 'Work Seconds', format: '1.0-0' },
    //{ column: 'ppmh', name: 'PPMH', format: '1.0-2' },
    //{ column: 'hours', name: 'Hours', format: '1.0-2' },
    { column: 'total', name: 'Total', format: '1.0-0' },
    { column: 'count', name: 'Count', format: '1.0-0' },
    { column: 'mean', name: 'Mean', format: '1.0-2' },
    { column: 'over', name: 'Over', format: '1.0-0' },
    { column: 'under', name: 'Under', format: '1.0-0' },
    { column: 'cpm', name: 'CPM', format: '1.0-2' },

    { column: 'qc_fail_count', name: 'QC Fail', format: '1.0-2' },
    { column: 'qc_pass_count', name: 'QC Pass', format: '1.0-2' },
    { column: 'qc_score', name: 'QC Score', format: '1.0-2' },

    //QA

    { column: 'totalChecks', name: 'Total Checks', format: '1.0-0', footerfield: true },
    { column: 'passedChecks', name: 'Passed Checks', format: '1.0-0', footerfield: true },
    { column: 'passPercent', name: 'Pass Percent', format: '1.0-2', footerfield: true },
    { column: 'avgInspectionTime', name: 'Avg Inspection Time', format: '1.0-2', footerfield: true },
    { column: 'weight', name: 'Weight', format: '1.0-2', footerfield: true },
    { column: 'totalDefects', name: 'Total Defects', format: '1.0-0', footerfield: true },
    { column: 'totalSamples', name: 'Total Samples', format: '1.0-0', footerfield: true },
    { column: 'defects1', name: '1', format: '1.0-0', footerfield: true },
    { column: 'defects2', name: '2', format: '1.0-0', footerfield: true },
    { column: 'defects3', name: '3', format: '1.0-0', footerfield: true },
    { column: 'defects4', name: '4', format: '1.0-0', footerfield: true },
    { column: 'defects5', name: '5', format: '1.0-0', footerfield: true },
    { column: 'defects6', name: '6', format: '1.0-0', footerfield: true },
    { column: 'defects7', name: '7', format: '1.0-0', footerfield: true },
    { column: 'defects8', name: '8', format: '1.0-0', footerfield: true },
    { column: 'defects9', name: '9', format: '1.0-0', footerfield: true },
    { column: 'defects10', name: '10', format: '1.0-0', footerfield: true },
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

  getColumnValue(row: any, field: IFieldName): string | number {
    const value = this.getNestedValue(row, field.rowField ?? field.column);
    if (value && field.format) {
      if (field.format.includes('Date:')) {
        const format = field.format.slice(field.format.indexOf(':') + 1);
        return formatDate((value as number) * 1000, format, 'en-US');
      } else {
        return formatNumber(parseFloat(value.toString()), 'en-US', field.format);
      }
    } else {
      return value;
    }
  }

  getFooterValue(field: IFieldName): string | number {
    if (this.grandTotals && field.footerfield) {
      const value = this.getNestedValue(this.grandTotals, field.column);
      if (value && field.format) {
        if (field.format.includes('Date:')) {
          const format = field.format.slice(field.format.indexOf(':') + 1);
          return formatDate((value as number) * 1000, format, 'en-US');
        } else {
          return formatNumber(parseFloat(value.toString()), 'en-US', field.format);
        }
      } else {
        return value;
      }
    }
    return '';
  }
}
