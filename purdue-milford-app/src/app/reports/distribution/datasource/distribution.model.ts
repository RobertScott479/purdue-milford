export interface IServerNameIndex {
  serverName: string;
  serverIndex: number | null;
}
// export interface IComm extends IServerNameIndex {
//   crc: number;
//   delay: number;
//   in: number;
//   latency: number;
//   out: number;
//   reply: number;
//   rescan: number;
//   rx: number;
//   scale: number;
//   timeout: number;
//   tx: number;
// }
// export interface IScale extends IServerNameIndex {
//   app: string;
//   boot: string;
//   build_time: number;
//   cleared: number;
//   cycle: string;
//   firmware: string;
//   health_coin_cell_ok: boolean;
//   health_nvram_defaulted: boolean;
//   health_nvram_reloaded: boolean;
//   health_rtc_running: boolean;
//   health_rtc_sane: boolean;
//   scale: number;
//   scale_uptime: number;
//   silicon_serial_number: string;
// }

// export interface IServer extends IServerNameIndex {
//   app: string;
//   bios_info: string;
//   cpu_temp: number;
//   db_dupe: number;
//   db_error: number;
//   db_fail: number;
//   db_insert: number;
//   dev: string;
//   poll: number;
//   restarts: number;
//   serial_number: string;
//   uptime: number;
// }

export interface IStats {
  error: number;
  scale: number;
  too_close: number;
  //totals: ISummary[];
}

export interface IDataRoot {
  // comm: IComm[];
  // last: ILast[];
  // scale: IScale[];
  // server: IServer[];
  rate: IRate[];
  summary: ISummaryDistribution[];
  details: IDetail[];
  stats: IStats[];
}

export interface ISummaryDistribution extends IServerNameIndex {
  count: number;
  gate: number | null;
  net_lb: number;
}

export interface IRate extends IServerNameIndex {
  timestamp: number;
  count: number;
}

export interface IRateRaw {
  timestamp: number;
  count: number;
}

export interface IDetail extends IServerNameIndex {
  net_lb: number;
  gate: number;
  timestamp: number;
  serial: number;
  scale: number;
  // high_g: number;
  // low_g: number;
}

export interface IDetailRaw {
  count: number;
  net_lb: number;
}
