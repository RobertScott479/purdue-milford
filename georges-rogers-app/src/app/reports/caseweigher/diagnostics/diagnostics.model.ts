import { IServerNameIndex } from '../datasource/caseweigher.model';

export interface CommInterface extends IServerNameIndex {
  // serverIndex: number;
  // serverName: string;
  tx: number;
  rx: number;
  out: number;
  in: number;
  crc: number;
  timeout: number;
  reply: number;
}

export interface ScaleInterface extends IServerNameIndex {
  // serverIndex: number;
  // serverName: string;
  // line: string;
  app: string;
  boot: string;
  cleared: number;
  // scale: number;

  health_coin_cell_ok: boolean;
  health_nvram_defaulted: boolean;
  health_nvram_reloaded: boolean;
  health_rtc_running: boolean;
  health_rtc_sane: boolean;
  silicon_serial_number: number;

  build_time: number; //
  firmware: string;
  scale_uptime: number;
}

export interface ServerInterface extends IServerNameIndex {
  // serverIndex: number;
  // serverName: string;
  // line: string;
  dev: string;
  uptime: number;
  poll: number;
  app: string;
  serial_number: string;
  bios_info: string;
  cpu_temp: number;

  db_dupe: number; //
  db_error: number;
  db_fail: number;
  db_insert: number;
}

export interface RegisterInterface extends IServerNameIndex {
  // serverIndex: number;
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

export interface ModbusInterface extends IServerNameIndex {
  //serverIndex: number;
  clients: number;
  connections: number;
  disconnections: number;
  missed_trays: number;
  reads: number;
  scale: number;
  short_reads: number;
  writes: number;
}
