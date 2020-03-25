import { EventEmitter, Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketsService {

  private socket: any;
  public updateUsersEvent = new EventEmitter();
  public handEvent = new EventEmitter();
  public callTrumpEvent = new EventEmitter();
  public username: string;

  constructor() {
    this.socket = io('http://localhost:3000');

    this.socket.on('updateUsers', data => {
      const users = [];
      for (const u of data.users) {
        if (u !== this.username) {
          users.push(u);
        }
      }
      this.updateUsersEvent.emit(users);
    });

    this.socket.on('hand', data => {
      if (data.username === this.username) {
        this.handEvent.emit(data.hand);
      }
    });

    this.socket.on('callTrump', data => {
      if (data.username === this.username) {
        this.callTrumpEvent.emit();
      }
    });
  }

  public emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }
}
