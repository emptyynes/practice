import { ProtocolFSM } from './ProtocolFSM';
import { State, Event } from './types';

let fsm = new ProtocolFSM();

fsm.sendEvent(Event.Connect)