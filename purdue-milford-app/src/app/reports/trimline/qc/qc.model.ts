
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