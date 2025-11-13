import { ErrorResInterface } from '../../../models';

export interface IWeightEvent {
  weight: number;
  timestamp: string;
}

export interface ISSEvent {
  event: string;
  data: string;
}

export interface ICheckInfo {
  index: number;
  station: string;
  duration: number;
  weight: number;
  timestamp: number;
  checkStatus: string;
}

export interface ICheckEventInput {
  station: string;
  weight: number;
  timestamp: number;
  bank: number;
  cut: string;
  index: number;
  cutter_number: number;
}

export interface IPieces {
  weight: number;
  timestamp?: number;
}

export interface ICheckEventTeguar {
  checker_cutter_number: number;
  product: string;
  checkEvent: ICheckEventInput;
  defects: number[];
  inspectionTime: number;
  passed: number;
  failed: number;
  canceled: number;
  pieces?: IPieces[];
  finishedPO: string;
  aqlScore: number;
  aqlStandard: number;
}

export interface ICheckEventOutput extends ICheckEventTeguar {
  //extension
  checkerName?: string;
  total?: number;
  weight?: number;
  score?: number;
  passPercent?: number;
}

export interface IDefectInfo {
  index: number;
  sampleSize: number;
  question: string;
  confidence: number;
  occurances: number;
}

export interface ICheckEventInputRes extends ErrorResInterface {
  checkEvent: ICheckEventInput;
}

export interface QaLogModel {
  id?: number;
  checker_cutter_number: number;
  cutter_number: number;
  product: string;
  cut: string;
  station: string;
  weight: number;
  index: number;
  timestamp: number;
  description: string;
  inspectionTime: number;
  // minWeight: number;
  // maxWeight: number;
}
