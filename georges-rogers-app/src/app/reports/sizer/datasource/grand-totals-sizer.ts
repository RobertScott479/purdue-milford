import { IDetail, ISummarySizer } from './sizer.model';

export class GrandTotalSizer {
  summary: ISummarySizer = {
    serverIndex: 0,
    serverName: '',
    count: 0,
    gate: null,
    high_g: 0,
    low_g: 0,
    net_g: 0,
    net_lb: 0,
  };

  public reset() {
    this.summary = {
      serverIndex: null,
      serverName: '',
      count: 0,
      gate: null,
      high_g: 0,
      low_g: 0,
      net_g: 0,
      net_lb: 0,
    };
    this.summary.count = 0;
    this.summary.net_lb = 0;
    this.summary.net_g = 0;
  }

  public updateSummary(summary: ISummarySizer[]) {
    summary.forEach((e) => {
      this.summary.count += e.count;
      //this.stats.gate += e.gate;
      this.summary.high_g = e.high_g > this.summary.high_g ? e.high_g : this.summary.high_g;
      this.summary.low_g += e.low_g < this.summary.low_g ? e.low_g : this.summary.low_g;
      this.summary.net_g += e.net_g;
      this.summary.net_lb += e.net_lb;
    });
  }

  public updateDetails(summary: IDetail[]) {
    summary.forEach((e) => {
      this.summary.count += 1;
      //this.stats.gate += e.gate;

      this.summary.net_g += e.net_g;
      this.summary.net_lb += e.net_g * 0.00220462; // Convert grams to pounds
    });
  }
}
