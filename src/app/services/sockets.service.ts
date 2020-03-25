import { EventEmitter, Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketsService {

  private socket = io('http://localhost:3000');
  public updateUsersEvent = new EventEmitter();
  public handEvent = new EventEmitter();
  public callTrumpEvent = new EventEmitter();
  public setTrumpEvent = new EventEmitter();
  public username: string;

  constructor() {
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

    this.socket.on('setTrump', data => {
      this.setTrumpEvent.emit(data);
    });
  }

  public emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

}
