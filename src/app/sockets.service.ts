import { EventEmitter, Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WaitingComponent } from './dialogs/waiting/waiting.component';
import { TrumpsComponent } from './dialogs/trumps/trumps.component';
import { NotificationComponent } from './dialogs/notification/notification.component';
import { ScalesComponent } from './dialogs/scales/scales.component';
import { EnvService } from '../environments/env.service';
import { Router } from '@angular/router';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class SocketsService {

  private socket: any;
  private username: string;
  private roomId: string;
  private roomCapacity: number;
  private hand: any[];
  private dialogRef: MatDialogRef<any>;

  public handEvent = new EventEmitter<any>();
  public updateUsernamesEvent = new EventEmitter<string[]>();
  public callScaleEvent = new EventEmitter<any>();
  public playCardEvent = new EventEmitter<boolean>();
  public callBelaEvent = new EventEmitter<string>();

  public connected: boolean;
  public trump: any;
  public teams: any;
  public points: any;
  public scales: any[];
  public turn: string;
  public playedCards: string[];

  constructor(private env: EnvService,
              private dialog: MatDialog,
              private router: Router,
              private loadingService: LoadingService) {
    this.restart();
  }

  public connect(): void {
    this.loadingService.startLoading();
    this.username = sessionStorage.getItem('username');
    this.roomId = sessionStorage.getItem('roomId');
    this.roomCapacity = parseInt(sessionStorage.getItem('roomCapacity'), 10);
    this.hand = JSON.parse(sessionStorage.getItem('hand'));
    this.socket = io(this.env.apiUrl);
    this.socket.emit('joinRoom', {
      username : this.username,
      roomId : this.roomId,
      roomCapacity : this.roomCapacity,
      hand : this.hand
    });
    this.setEvents();
    // this.connected = true;
    // this.newUser(sessionStorage.getItem('username'));
  }

  public disconnect(username: string): void {
    sessionStorage.removeItem('username');
    this.emit('killedMatch', username);
    this.socket.disconnect();
    this.router.navigate(['/login']);
    this.dialogRef.close();
    this.connected = false;
  }

  public restart(): void {
    this.connected = false;
    this.username = '';
    this.trump = undefined;
    this.teams = undefined;
    this.points = {
      games: [{ A: 0, B: 0 }],
      total:  { A: 0, B: 0 }
    };
    this.scales = [];
    this.turn = '';
    this.playedCards = [];
  }

  public emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }

  public newUser(username: string): void {
    this.username = username;
    this.emit('newUser', username);
    this.dialogRef = undefined;
    this.setEvents();
  }

  private setEvents(): void {
    this.socket.on('noRoom', () => {
      sessionStorage.removeItem('roomId');
      sessionStorage.removeItem('roomCapacity');
      this.socket.disconnect();
      setTimeout(() => {
        this.loadingService.stopLoading();
        this.router.navigate(['/login'], { state: { data: 'Room full' } }).then();
      }, 2000);
    });

    this.socket.on('hand', (data: any) => {
      this.loadingService.stopLoading();
      if (data.username === this.username) {
        this.handEvent.emit({ hand: data.hand, display8: data.display8 });
      }
    });

    this.socket.on('updateUsers', (data: any) => {
      if (!this.dialogRef) {
        this.dialogRef = this.dialog.open(WaitingComponent, { disableClose: true, data: data.usernames.length });
      } else {
        this.dialogRef.componentInstance.data = data.usernames.length;
      }

      if (data.usernames.length !== 4) {
        return;
      }

      let index = data.usernames.indexOf(data.usernames.find(x => x === this.username));
      const orderedUsernames = [];
      for (let i = 0; i < 4; i++) {
        orderedUsernames.push(data.usernames[index]);
        index = (index + 1) % 4;
      }
      setTimeout( () => {
        this.dialogRef.close();
        this.updateUsernamesEvent.emit(orderedUsernames);
        this.teams = data.teams;
      }, 1000);
    });

    this.socket.on('callTrump', (data: any) => {
      this.turn = data.username;
      if (data.username === this.username) {
        this.dialogRef = this.dialog.open(TrumpsComponent, { disableClose: true, autoFocus: false, data: data.lastCall });
        this.dialogRef.afterClosed().subscribe( trump => {
          this.emit('calledTrump', trump);
        });
      }
    });

    this.socket.on('setTrump', (data: any) => {
      this.trump = data;
    });

    this.socket.on('callScale', (username: string) => {
      this.turn = username;
      if (username === this.username) {
        this.callScaleEvent.emit();
      }
    });

    this.socket.on('announceScale', (data: any) => {
      if (data.bela) {
        this.dialogRef = this.dialog.open(NotificationComponent, { disableClose: true, data: 'BELA!' });
        setTimeout( () => { this.dialogRef.close(); }, 1000);
      } else if (!this.scales.find( x => x.username === data.username)) {
        const points = data.points ? data.points : 'Dalje!';
        this.scales.push({ username: data.username, points });
      }
    });

    this.socket.on('showScales', (scales: any) => {
      this.dialogRef = this.dialog.open(ScalesComponent, { disableClose: true, autoFocus: false, data: scales });
      setTimeout(() => {
        this.dialogRef.close();
        this.scales = [];
      }, 4000);
    });

    this.socket.on('matchPoints', (data: any) => {
      this.points = data;
      this.playCardEvent.emit(false);
      this.trump = null;
    });

    this.socket.on('gamePoints', (data: any) => {
      this.points.games[0] = data;
      if (this.scales.length > 0) {
        setTimeout(() => {
          this.scales = [];
        }, 1000);
      }
    });

    this.socket.on('playCard', (username: string) => {
      this.turn = username;
      this.playCardEvent.emit(username === this.username);
    });

    this.socket.on('moveNotAllowed', (username: string) => {
      if (this.username === username) {
        this.dialogRef = this.dialog.open(NotificationComponent, { disableClose: true, data: 'REKA SAN NE MOŽE!' });
        setTimeout( () => { this.dialogRef.close(); }, 1000);
      }
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
      this.dialogRef = this.dialog.open(NotificationComponent, { disableClose: true, data: 'Team ' + team + ' je pao!' });
      setTimeout( () => { this.dialogRef.close(); }, 1000);
    });

    this.socket.on('endMatch', (winningTeam: string) => {
      this.emit('userLeaves', this.username);
      this.restart();
      this.router.navigate(['/end-screen', { win: winningTeam }]);
    });

    this.socket.on('killMatch', (username: string) => {
      this.dialogRef.close();
      const data = username + ' je odustao. Vidimo se neki drugi put!';
      this.dialogRef = this.dialog.open(NotificationComponent, { disableClose: true, data });
      setTimeout(() => {
        this.disconnect(this.username);
      }, 4000);
    });
  }
}
