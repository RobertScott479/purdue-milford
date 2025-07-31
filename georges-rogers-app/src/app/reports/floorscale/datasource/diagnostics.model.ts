import { IServerNameIndex } from './floorscale.model';

export interface IComm extends IServerNameIndex {
  crc: number;
  delay: number;
  in: number;
  latency: number;
  out: number;
  reply: number;
  rescan: number;
  rx: number;
  scale: number;
  timeout: number;
  tx: number;
}

export interface IScale extends IServerNameIndex {
  app: string;
  boot: string;
  build_time: number;
  cleared: number;
  cycle: string;
  firmware: string;
  health_coin_cell_ok: boolean;
  health_nvram_defaulted: boolean;
  health_nvram_reloaded: boolean;
  health_rtc_running: boolean;
  health_rtc_sane: boolean;
  scale: number;
  scale_uptime: number;
  silicon_serial_number: string;
}

export interface IServer extends IServerNameIndex {
  app: string;
  bios_info: string;
  cpu_temp: number;
  db_dupe: number;
  db_error: number;
  db_fail: number;
  db_insert: number;
  dev: string;
  poll: number;
  restarts: number;
  serial_number: string;
  uptime: number;
}
