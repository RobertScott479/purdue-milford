import { IFloorScale } from './floorscale.model';

export class GrandTotalFloorscale {
  summary: IFloorScale = this.reset();

  public reset(): IFloorScale {
    this.summary = {
      serverIndex: 0,
      serverName: '',
      serverGroup: '',
      net_lb: 0,
      count: 0,
      gate: 0,
    };

    return this.summary;
  }

  public updateSummary(stat: IFloorScale[]) {
    this.reset();
    stat.forEach((e) => {
      this.summary.count += e.count;
      this.summary.net_lb += e.net_lb;
    });
  }

  public updateDetails(stat: IFloorScale[]) {
    this.reset();
    stat.forEach((e) => {
      this.summary.count += 1;
      this.summary.count += e.count;
      this.summary.net_lb += e.net_lb;
    });
  }
}
