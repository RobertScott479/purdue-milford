import { TimeFrame } from '../reports/report.models';

export interface IDatasources {
  startRefreshTimer(): void;
  stopRefreshTimer(): void;
  //refreshDatasources(delay: number): void;
  updateFilters(serverIndex: number | null | undefined): void;
  // ClearAllDatasources(): void;
  init(timeFrame: TimeFrame | null | undefined): void;
}
