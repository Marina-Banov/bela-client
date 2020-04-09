import { EventEmitter, Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ScalesComponent } from '../dialogs/scales/scales.component';
import { WaitingComponent } from '../dialogs/waiting/waiting.component';

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
  public username: string;
  public trump: any;
  public points: any;
  public scaleAnnouncements: string[] = [];
  private dialogRef: MatDialogRef<any>;

  constructor(protected dialog: MatDialog) {

    this.socket.on('waiting', () => {
      if (!this.dialogRef) {
        this.dialogRef = this.dialog.open(WaitingComponent, { disableClose: true, autoFocus: false });
      }
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
      if (this.dialogRef) {
        this.dialogRef.close();
        this.dialogRef = undefined;
      }
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
      this.trump = { trump: data.trump, username: data.username };
      for (const u of data.users) {
        if (u.username === this.username) {
          this.setTrumpEvent.emit(u.hand);
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

    this.socket.on('showScales', scales => {
      this.scaleAnnouncements = [];
      this.dialogRef = this.dialog.open(ScalesComponent, { disableClose: true, autoFocus: false, data: scales });
      setTimeout(() => {
        this.dialogRef.close();
        this.dialogRef = undefined;
      }, 4000);
    });

    this.socket.on('points', data => {
      this.points = data;
    });
  }

  public emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

}
