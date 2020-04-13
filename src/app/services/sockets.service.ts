import { EventEmitter, Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ScalesComponent } from '../dialogs/scales/scales.component';
import { WaitingComponent } from '../dialogs/waiting/waiting.component';
import { EnvService } from '../../environments/env.service';
import { NavigationService } from './navigation.service';

@Injectable({
  providedIn: 'root'
})
export class SocketsService {

  private socket: any;
  private readonly username: string;
  private dialogRef: MatDialogRef<any>;

  public handEvent = new EventEmitter<any>();
  public updateUsernamesEvent = new EventEmitter<string[]>();
  public callTrumpEvent = new EventEmitter<boolean>();
  public callScaleEvent = new EventEmitter<any>();
  public playCardEvent = new EventEmitter<boolean>();
  public callBelaEvent = new EventEmitter<string>();

  public trump: any;
  public points: any = {
    games: [{ A: 0, B: 0 }],
    total:  { A: 0, B: 0 }
  };
  public announcements: string[] = [];
  public turn = '';
  public playedCards: string[] = [];
  public teams: any;

  constructor(private env: EnvService,
              protected navigationService: NavigationService,
              protected dialog: MatDialog) {

    this.socket = io(env.apiUrl);
    this.username = this.navigationService.username;
    this.emit('newUser', this.username);

    this.socket.on('hand', (data: any) => {
      if (!this.dialogRef) {
        this.dialogRef = this.dialog.open(WaitingComponent, { disableClose: true });
      }
      if (data.username === this.username) {
        this.handEvent.emit({ hand: data.hand, display8: data.display8 });
      }
    });

    this.socket.on('updateUsers', (data: any) => {
      let index = data.usernames.indexOf(data.usernames.find(x => x === this.username));
      const orderedUsernames = [];
      for (let i = 0; i < 4; i++) {
        orderedUsernames.push(data.usernames[index]);
        index = (index + 1) % 4;
      }
      setTimeout( () => {
        this.updateUsernamesEvent.emit(orderedUsernames);
        this.teams = data.teams;
        this.dialogRef.close();
      }, 1500);
    });

    this.socket.on('callTrump', (data: any) => {
      if (data.username === this.username) {
        this.callTrumpEvent.emit(data.lastCall);
      }
      this.turn = data.username;
    });

    this.socket.on('setTrump', (data: any) => {
      this.trump = data;
    });

    this.socket.on('callScale', (username: string) => {
      if (username === this.username) {
        this.callScaleEvent.emit();
      }
      this.turn = username;
    });

    this.socket.on('announceScale', (data: string) => {
      if (!this.announcements.find( x => x.includes(data.split(' ')[0]))) {
        this.announcements.push(data);
      }
    });

    this.socket.on('showScales', (scales: any) => {
      this.dialogRef = this.dialog.open(ScalesComponent, { disableClose: true, autoFocus: false, data: scales });
      setTimeout(() => {
        this.dialogRef.close();
        this.announcements = [];
      }, 4000);
    });

    this.socket.on('matchPoints', (data: any) => {
      this.points = data;
      this.announcements = [];
      this.playCardEvent.emit(false);
    });

    this.socket.on('gamePoints', (data: any) => {
      this.points.games[0] = data;
      if (this.announcements.length > 0) {
        setTimeout(() => {
          this.announcements = [];
        }, 2000);
      }
    });

    this.socket.on('playCard', (username: string) => {
      this.playCardEvent.emit(username === this.username);
      this.turn = username;
    });

    this.socket.on('acceptCard', (data: any) => {
      this.playedCards.push(data);
      if (this.playedCards.length === 4) {
        setTimeout(() => {
          this.playedCards = [];
        }, 2000);
      }
    });

    this.socket.on('callBela', (data: any) => {
      if (data.username === this.username) {
        this.callBelaEvent.emit(data.card);
      }
    });

    this.socket.on('fail', (team: string) => {
      this.announcements = ['Team ' + team + ' je pao!'];
    });
  }

  public emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

}
