import { EventEmitter, Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ScalesComponent } from '../scales/scales.component';

@Injectable({
  providedIn: 'root'
})
export class SocketsService {

  private socket = io('http://localhost:3000');
  public assignTeamEvent = new EventEmitter();
  public updateUsersEvent = new EventEmitter();
  public handEvent = new EventEmitter();
  public highlightTurn = new EventEmitter();
  public callTrumpEvent = new EventEmitter();
  public setTrumpEvent = new EventEmitter();
  public callScaleEvent = new EventEmitter();
  scaleRef: MatDialogRef<any>;
  public username: string;
  public message: string;
  public scaleAnnouncements: string[] = [];

  constructor(protected dialog: MatDialog) {

    this.socket.on('message', message => {
      this.message = message;
    });

    this.socket.on('hand', data => {
      if (data.username === this.username) {
        this.handEvent.emit(data.hand);
      }
    });

    this.socket.on('updateUsers', users => {
      let index = users.indexOf(users.find(x => x.username === this.username));
      this.assignTeamEvent.emit(users[index].team);
      const orderedUsernames = [];
      for (let i = 0; i < 4; i++) {
        orderedUsernames.push(users[index].username);
        index = (index + 1) % 4;
      }
      this.updateUsersEvent.emit(orderedUsernames);
    });

    this.socket.on('callTrump', data => {
      if (data.username === this.username) {
        this.callTrumpEvent.emit(data.lastCall);
        this.highlightTurn.emit('');
      } else {
        this.highlightTurn.emit(data.username);
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

    this.socket.on('callScale', username => {
      if (username === this.username) {
        this.callScaleEvent.emit();
        this.highlightTurn.emit('');
      } else {
        this.highlightTurn.emit(username);
      }
    });

    this.socket.on('announceScale', data => {
      if (!this.scaleAnnouncements.find( x => x.includes(data.split(' ')[0]))) {
        this.scaleAnnouncements.push(data);
      }
    });

    this.socket.on('showScales', data => {
      this.scaleAnnouncements = [];
      this.scaleRef = this.dialog.open(ScalesComponent, { disableClose: true, autoFocus: false, data: data.scales });
      setTimeout(() => {
        this.scaleRef.close();
      }, 3000);
    });
  }

  public emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

}
