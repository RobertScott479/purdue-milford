import { IDetail, ISummaryDistribution } from './distribution.model';

export class DistributionGrandTotal {
  summary: ISummaryDistribution = this.getInitialSummary();

  private getInitialSummary(): ISummaryDistribution {
    return {
      serverIndex: null,
      serverName: '',
      count: 0,
      gate: null,
      net_lb: 0,
    };
  }

  public reset(): void {
    this.summary = this.getInitialSummary();
  }

  public updateSummary(summaries: ISummaryDistribution[]): void {
    this.reset();

    summaries.forEach((item) => {
      this.summary.count += item.count;
      this.summary.net_lb += item.net_lb;
    });
  }

  public updateDetails(details: IDetail[]): void {
    this.reset();

    this.summary.count = details.length;
    this.summary.net_lb = details.reduce((total, item) => total + item.net_lb, 0);
  }
}
