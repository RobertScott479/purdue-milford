export interface ErrorResInterface {
  errorCode: string;
  errorMessage: string;
}

export interface IFrmGroupHistory {
  report: string;
  serverIndex: number;
  timeframe: string;
  date: Date;
  toDate: Date;
  shift: number;
  fromTime: string;
  toTime: string;
}
