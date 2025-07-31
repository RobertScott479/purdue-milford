import { ISummeryExtended } from './yield.model';

export class DistributionGrandTotal {
  summary: ISummeryExtended = {
    serverIndex: 0,
    serverName: '',
    birds: 0,
    line: null,
    fronts: 0,
    //frontYield: 0,
    tenders: 0,
    tenderYield: 0,
    fillets: 0,
    filletYield: 0,
    skins: 0,
    skinYield: 0,
    shells: 0,
    shellsYield: 0,
    wings: 0,
    wingsYield: 0,
    condemned: 0,
    condemnedYield: 0,
  };

  public reset() {
    this.summary = {
      serverIndex: 0,
      serverName: '',
      birds: 0,
      line: null,
      fronts: 0,
      //frontYield: 0,
      tenders: 0,
      tenderYield: 0,
      fillets: 0,
      filletYield: 0,
      skins: 0,
      skinYield: 0,
      shells: 0,
      shellsYield: 0,
      wings: 0,
      wingsYield: 0,
      condemned: 0,
      condemnedYield: 0,
    };
  }

  public updateSummary(summary: ISummeryExtended[]) {
    this.reset();
    summary.forEach((e) => {
      this.summary.birds += e.birds;
      this.summary.fronts += e.fronts;
      // this.summary.frontYield += e.frontYield;
      this.summary.tenders += e.tenders;
      this.summary.tenderYield = (this.summary.tenders / this.summary.fronts) * 100;
      this.summary.fillets += e.fillets;
      this.summary.filletYield = (this.summary.fillets / this.summary.fronts) * 100;
      this.summary.skins += e.skins;
      this.summary.skinYield = (this.summary.skins / this.summary.fronts) * 100;
      this.summary.shells += e.shells;
      this.summary.shellsYield = (this.summary.shells / this.summary.fronts) * 100;
      this.summary.wings += e.wings;
      this.summary.wingsYield = (this.summary.wings / this.summary.fronts) * 100;
    });
  }

  // public updateDetails(summary: IDetail[]) {
  //   summary.forEach((e) => {
  //     this.summary.count += 1;
  //     //this.stats.gate += e.gate;

  //     this.summary.net_g += e.net_g;
  //     this.summary.net_lb += e.net_g * 0.00220462; // Convert grams to pounds
  //   });
  // }
}
