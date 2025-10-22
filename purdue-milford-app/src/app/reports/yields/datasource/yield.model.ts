export interface IServerNameIndex {
  serverName: string;
  serverIndex: number | null;
}

export interface ISummeryExtended extends IYieldSummary {
  tenderYield: number;
  filletYield: number;
  skinYield: number;
  shellsYield: number;
  wingsYield: number;
  condemnedYield: number;
  bpm: number;
}

export interface IYieldSummary extends IServerNameIndex {
  line: number | null;
  fronts: number;
  tenders: number;
  fillets: number;
  skins: number;
  shells: number;
  wings: number;
  birds: number;
  condemned: number;
}

export interface ISummaryHopper extends IServerNameIndex {
  count: number;
  gate: number | null;
  net_lb: number;
}
