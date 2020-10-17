import { Card } from './hand';
import { ShowScale } from './scale';

export enum ACTIONS {
  ACCEPT_CARD = 'ACCEPT_CARD',
  ANNOUNCE_SCALE = 'ANNOUNCE_SCALE',
  ARRANGE_USERS = 'ARRANGE_USERS',
  CALL_BELA = 'CALL_BELA',
  CALL_SCALE = 'CALL_SCALE',
  CALL_TRUMP = 'CALL_TRUMP',
  GAME_POINTS = 'GAME_POINTS',
  INFO = 'INFO',
  INFO_WAITING = 'INFO_WAITING',
  MATCH_POINTS = 'MATCH_POINTS',
  NO_ROOM = 'NO_ROOM',
  PLAY_CARD = 'PLAY_CARD',
  SET_HAND = 'SET_HAND',
  SET_TRUMP = 'SET_TRUMP',
  SHOW_SCALES = 'SHOW_SCALES',
  UPDATE_USERS = 'UPDATE_USERS'
}

export class ServerMessage {
  action: ACTIONS;
  message: string;
  users: string[];
  username: string;
  hand: Card[];
  scales: ShowScale[];
  gamePoints: number[];
  displayAll: boolean;
  card: string;
  games: number[][];
  total: number[];
  points: number;
  lastCall: boolean;
  trump: string;
}
