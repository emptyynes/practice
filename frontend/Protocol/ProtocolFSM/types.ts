import type { Event } from './Event';

export interface State {
	name: string;
  enter?: () => void;
  leave?: () => void;
  handle?: (event: Event) => void;
}

export interface FSM {
  setState: (state: State) => void;
  event: (event: Event) => void;
  emitEvent: (data: string) => void;
}