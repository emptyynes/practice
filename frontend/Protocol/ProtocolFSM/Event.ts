import type { State } from './types';

export class Event {
	state: string;
	data: string;

	constructor(state: State, data: string) {
		this.state = state.name;
		this.data = data;
	}
}