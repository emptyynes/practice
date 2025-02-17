import type { State } from './types';

export class Event {
	stateId: number;
	data: string;

	constructor(stateId: number, data: string) {
		this.stateId = stateId;
		this.data = data;
	}
}