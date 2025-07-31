export interface IServerNameIndex {
  serverName: string;
  serverIndex: number;
}

// export interface IFloorscale {
//   // comm: IComm[];
//   // scale: IScale[];
//   // server: IServer[];
//   totals: ITotals[];
//   last: ILast[];
// }

export interface IFloorScale extends IServerNameIndex {
  serverGroup: string;
  count: number;
  net_lb: number;
  gate: number;
}

// export interface IQueryResponse {
//   combos: ILast[];
//   db_filename: string;
//   start_timestamp: string;
//   stop_timestamp: string;
//   errorCode: number;
//   errorMessage: string;
//   query_time: number;
//   rows: number;
// }
