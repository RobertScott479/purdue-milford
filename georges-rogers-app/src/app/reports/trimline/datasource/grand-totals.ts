import { CutterInterface } from './trimline.model';

export class GrandTotalSummary {
  summary: CutterInterface = this.reset();

  public reset(): CutterInterface {
    this.summary = {
      in_lbs: 0,
      index: 0,
      out_lbs: 0,
      qc_fail_count: 0,
      qc_pass_count: 0,
      station_name: '',
      work_seconds: 0,
      yield_percent: 0,
      qc_score: 0,
      ppmh: 0,
      hours: 0,
    };

    return this.summary;
  }

  public update(summary: CutterInterface[]) {
    this.reset();
    summary.forEach((e) => {
      this.summary.in_lbs += e.in_lbs;
      this.summary.out_lbs += e.out_lbs;
      this.summary.qc_fail_count += e.qc_fail_count;
      this.summary.qc_pass_count += e.qc_pass_count;
      this.summary.work_seconds += e.work_seconds;
      this.summary.hours += e.work_seconds / 3600;
      this.summary.yield_percent = (this.summary.out_lbs / this.summary.in_lbs) * 100;
      const totalQCChecks = this.summary.qc_pass_count + this.summary.qc_fail_count;
      this.summary.qc_score = totalQCChecks ? (this.summary.qc_pass_count / totalQCChecks) * 100 : 0;
      this.summary.ppmh = this.summary.work_seconds ? this.summary.out_lbs / (this.summary.work_seconds / 3600) : 0;
    });
  }
}
