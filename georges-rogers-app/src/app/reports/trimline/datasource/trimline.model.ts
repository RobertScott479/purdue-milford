import { ErrorResInterface } from '../../../models';

export interface CommInterface {
  crc: number;
  delay: number;
  in: number;
  latency: number;
  out: number;
  reply: number;
  rx: number;
  timeout: number;
  tx: number;
}

export interface CutterInterface {
  in_lbs: number;
  index: number;
  out_lbs: number;
  qc_fail_count: number;
  qc_pass_count: number;
  station_name: string;
  work_seconds: number;
  yield_percent: number;
  hours: number;
  qc_score: number;
  ppmh: number;
}

export interface ScaleInterface {
  app: string;
  boot: string;
  health_coin_cell_ok: boolean;
  health_nvram_defaulted: boolean;
  health_nvram_reloaded: boolean;
  health_rtc_running: boolean;
  health_rtc_sane: boolean;
  silicon_serial_number: string;
  operating_mode: string;
}

export interface ServerInterface {
  app: string;
  bios_info: string;
  cpu_temp: number;
  dev: string;
  infeed_cleared: number;
  infeed_updated: number;
  outfeed_cleared: number;
  outfeed_updated: number;
  poll: number;
  qc_cleared: number;
  qc_updated: number;
  serial_number: string;
  uptime: number;
}

export interface RootInterface {
  comm: CommInterface;
  cutters: CutterInterface[];
  scale: ScaleInterface;
  server: ServerInterface;
}

export interface RegisterInterface {
  bits: string;
  contents: string;
  description: string;
  index: number;
  offset: string;
  read_write: string;
  registers: string;
  type: string;
  value: string;
}

export interface RegistersInterface {
  registers: RegisterInterface[];
}

export interface StationRootInterface {
  stations: StationInterface[];
}
export interface StationsResInterface extends ErrorResInterface {
  stations: StationInterface[];
}
export interface StationInterface {
  station: string;
  enabled: boolean;
}
