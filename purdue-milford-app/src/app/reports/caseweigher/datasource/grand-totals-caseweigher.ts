import { CaseweigherStatsInterface, IDetails } from './caseweigher.model';

export class GrandTotalCaseweigher {
  summary: CaseweigherStatsInterface = this.reset();

  public reset(): CaseweigherStatsInterface {
    this.summary = {
      serverIndex: 0,
      serverName: '',
      over: 0,
      under: 0,
      error: 0,
      mean: 0,
      close: 0,
      net_lb: 0,
      status: '',
      code: 0,
      updated: 0,
      count: 0,
      max: 0,
      min: 0,
      std_dev: 0,
      tamper: 0,
      runtime: 0,
      cpm: 0,
      weight: 0,
      giveaway: 0,
      shorted: 0,
      cleared: 0,
    };

    return this.summary;
  }

  public updateSummary(summary: CaseweigherStatsInterface[]) {
    this.reset();
    summary.forEach((e) => {
      this.summary.count += e.count;
      this.summary.net_lb += e.net_lb;
      this.summary.over += e.over;
      this.summary.under += e.under;
      this.summary.error += e.error;
      this.summary.mean = this.summary.count > 0 ? this.summary.net_lb / this.summary.count : 0;
      this.summary.close += e.close;

      this.summary.status = '';
      this.summary.code = 0;
      this.summary.updated = Math.max(this.summary.updated, e.updated);

      this.summary.max = Math.max(this.summary.max, e.max);
      this.summary.min = Math.min(this.summary.min, e.min);
      this.summary.std_dev = 0;
      this.summary.tamper = 0;
      this.summary.runtime += e.runtime;
      this.summary.cpm = e.runtime > 0 ? (this.summary.net_lb / this.summary.runtime) * 60 : 0;
    });
  }

  public updateDetails(details: IDetails[]) {
    this.reset();
    details.forEach((e) => {
      e.giveaway = e.high_limit > 0 && e.net_lb > e.high_limit ? e.net_lb - e.high_limit : 0;
      e.shorted = e.low_limit > 0 && e.net_lb < e.low_limit ? e.low_limit - e.net_lb : 0;
      this.summary.weight += e.net_lb;
      this.summary.count++;
      this.summary.giveaway += e.giveaway;
      this.summary.shorted += e.shorted;
    });
  }
}
