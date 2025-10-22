import { CommInterface, ModbusInterface, ScaleInterface, ServerInterface } from '../diagnostics/diagnostics.model';

export interface IServerNameIndex {
  serverName: string;
  serverIndex: number;
}

export interface IDetails extends IServerNameIndex {
  net_lb: number;
  status: string;
  timestamp: any;
  high_limit: number; //
  low_limit: number;
  giveaway?: number;
  shorted?: number;
}

export interface CaseweigherRootInterface {
  stats: CaseweigherStatsInterface[];
  last: IDetails[];
  comm: CommInterface[];
  scale: ScaleInterface[];
  server: ServerInterface[];
  modbus: ModbusInterface[];
}

export interface CaseweigherStatsInterface extends IServerNameIndex {
  // serverIndex: number;
  // serverName: string;
  // line: string;
  // scale: number;
  over: number;
  under: number;
  error: number;
  mean: number;
  close: number;
  net_lb: number;
  status: string;
  code: number;
  updated: number;
  count: number;
  // onlineStatus: string;

  max: number;
  min: number;
  std_dev: number;
  tamper: number;
  runtime: number;
  cpm: number;

  weight: number;
  giveaway: number;
  shorted: number;
  cleared: number;
}

export interface IRate extends IServerNameIndex {
  timestamp: number;
  count: number;
}

export interface IRateRaw {
  timestamp: number;
  count: number;
}
