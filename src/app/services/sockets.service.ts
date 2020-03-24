import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketsService {
  private socket: any;

  constructor() {
    this.socket = io('http://localhost:3000');

    this.socket.on('', () => { });
  }

  public emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }
}
