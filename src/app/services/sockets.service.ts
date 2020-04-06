import { EventEmitter, Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketsService {

  private socket = io('http://localhost:3000');
  public assignTeamEvent = new EventEmitter();
  public updateUsersEvent = new EventEmitter();
  public handEvent = new EventEmitter();
  public callTrumpEvent = new EventEmitter();
  public setTrumpEvent = new EventEmitter();
  public callScaleEvent = new EventEmitter();
  public username: string;
  public message: string;

  constructor() {

    this.socket.on('message', data => {
      this.message = data;
    });

    this.socket.on('assignTeam', data => {
      if (data.username === this.username) {
        this.assignTeamEvent.emit(data.team);
      }
    });

    this.socket.on('updateUsers', data => {
      let index = data.users.indexOf(data.users.find(x => x.username === this.username));
      const orderedUsernames = [];
      for (let i = 0; i < 4; i++) {
        orderedUsernames.push(data.users[index].username);
        index = (index + 1) % 4;
      }
      this.updateUsersEvent.emit(orderedUsernames);
    });

    this.socket.on('hand', data => {
      if (data.username === this.username) {
        this.handEvent.emit(data.hand);
      }
    });

    this.socket.on('callTrump', data => {
      if (data.username === this.username) {
        this.callTrumpEvent.emit(data.lastCall);
      }
    });

    this.socket.on('setTrump', data => {
      const trump = { trump: data.trump, username: data.username };
      for (const u of data.users) {
        if (u.username === this.username) {
          this.setTrumpEvent.emit({ trump, hand: u.hand });
        }
      }
    });

    this.socket.on('callScale', data => {
      if (data.username === this.username) {
        this.callScaleEvent.emit();
      }
    });
  }

  public emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

}
