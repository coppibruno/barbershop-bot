import {State} from '@prisma/client';

export interface IFlowResult {
  userName?: string;
  response: string;
  options?: string[];
  step: number;
  state?: State;
}
