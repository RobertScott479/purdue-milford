import { ErrorResInterface } from '../../../models';

export interface CutsResInterface extends ErrorResInterface {
  cuts: ICutInfo[];
}

export interface ICutInfo {
  code: string;
  description: string;
  cutName: string;
  customer: string;
  pattern: string;
  cutRate: number;
  ppmh: number; //ppmh std
  standardPrimaryYield: number;
  aqlScoreStandard: number;
  weightScoreStandard: number;

  sampleSize: number;
  weightMinimum: number;
  weightMaximum: number;

  question1: string;
  question2: string;
  question3: string;
  question4: string;
  question5: string;
  question6: string;
  question7: string;
  question8: string;
  question9: string;
  question10: string;

  wtConfidence: number;
  q1Confidence: number;
  q2Confidence: number;
  q3Confidence: number;
  q4Confidence: number;
  q5Confidence: number;
  q6Confidence: number;
  q7Confidence: number;
  q8Confidence: number;
  q9Confidence: number;
  q10Confidence: number;
  username: string;
  timestamp: number;
}
