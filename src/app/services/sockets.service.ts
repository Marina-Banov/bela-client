import { EventEmitter, Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketsService {

  private socket: any;
  public event = new EventEmitter();
  public username: string;

  constructor() {
    this.socket = io('http://localhost:3000');

    this.socket.on('hand', (data) => {
      if (data.username === this.username) {
        this.event.emit(data.hand);
      }
    });
  }

  public emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }
}
