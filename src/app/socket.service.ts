import { EventEmitter, Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ArrangeUsersComponent } from './dialogs/arrange-users/arrange-users.component';
import { TrumpsComponent } from './dialogs/trumps/trumps.component';
import { NotificationComponent } from './dialogs/notification/notification.component';
import { ScalesComponent } from './dialogs/scales/scales.component';
import { EnvService } from '../environments/env.service';
import { Router } from '@angular/router';
import { LoadingService } from './loading.service';
import * as Models from './classes';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: any;
  private username: string;
  private roomId: string;
  private hand: Models.Hand;
  private dialogRef: MatDialogRef<any>;

  public handEvent = new EventEmitter<any>();
  public updateUsersEvent = new EventEmitter<any>();
  public callScaleEvent = new EventEmitter<any>();
  public discardTwo = new EventEmitter<any>();
  public playCardEvent = new EventEmitter<boolean>();
  public callBelaEvent = new EventEmitter<string>();

  public roomCapacity: number;
  public connected: boolean;
  public trump: Models.SetTrump;
  public points: Models.Points;
  public scales: Models.StoreScale[];
  public turn: string;
  public playedCards: Models.AcceptCard[];

  constructor(private env: EnvService,
              private dialog: MatDialog,
              private router: Router,
              private loadingService: LoadingService) { }

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
    this.restart();
    this.setEvents();
    // this.connected = true;
    // this.newUser(sessionStorage.getItem('username'));
  }

  public disconnect(username: string): void {
    sessionStorage.removeItem('username');
    this.emit('killedMatch', username);
    this.socket.disconnect();
    this.router.navigate(['/login']).then();
    this.dialogRef.close();
    this.connected = false;
  }

  public restart(): void {
    this.connected = false;
    this.trump = null;
    this.points = {
      games: [this.roomCapacity === 3 ? [0, 0, 0] : [0, 0]],
      total: this.roomCapacity === 3 ? [0, 0, 0] : [0, 0]
    };
    this.scales = [];
    this.turn = '';
    this.playedCards = [];
  }

  public emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
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

    this.socket.on('message', (message: string) => {
      if (!this.dialogRef) {
        this.dialogRef = this.dialog.open(NotificationComponent, { disableClose: true, data: { message, dotted: true } });
      } else {
        this.dialogRef.componentInstance.data = { message, dotted: true };
      }
    });

    this.socket.on('arrangeUsers', (data: string[]) => {
      this.dialogRef.close();
      this.dialogRef = this.dialog.open(ArrangeUsersComponent, { disableClose: true, data });
      this.dialogRef.afterClosed().subscribe(d => this.emit('reorderPlayers', d));
    });

    this.socket.on('hand', (data: Models.Hand) => {
      this.loadingService.stopLoading();
      this.hand = data;
      sessionStorage.setItem('hand', JSON.stringify(data.hand));
      this.handEvent.emit(data);
      if (data.hand.length === 12) {
        this.discardTwo.emit();
      }
    });

    this.socket.on('updateUsers', (data: string[]) => {
      this.dialogRef.close();
      let index = data.indexOf(data.find(x => x === this.username));
      const orderedUsers = [];
      for (let i = 0; i < this.roomCapacity; i++) {
        orderedUsers.push(data[index]);
        index = (index + 1) % this.roomCapacity;
      }
      this.updateUsersEvent.emit({ users: data, orderedUsers });
    });

    this.socket.on('callTrump', (data: Models.CallTrump) => {
      this.turn = data.username;
      if (data.username === this.username) {
        this.dialogRef = this.dialog.open(TrumpsComponent, { disableClose: true, autoFocus: false, data: data.lastCall });
        this.dialogRef.afterClosed().subscribe( trump => {
          this.emit('calledTrump', trump);
        });
      }
    });

    this.socket.on('setTrump', (data: Models.SetTrump) => {
      this.trump = data;
    });

    this.socket.on('callScale', (username: string) => {
      this.turn = username;
      if (username === this.username) {
        this.callScaleEvent.emit();
      }
    });

    this.socket.on('announceScale', (data: Models.AnnounceScale) => {
      if (data.bela) {
        this.dialogRef = this.dialog.open(NotificationComponent, { disableClose: true, data: { message: 'BELA!', dotted: false } });
        setTimeout( () => { this.dialogRef.close(); }, 1000);
      } else {
        const points = data.points ? data.points.toString() : 'Dalje!';
        this.scales.push({ username: data.username, points });
      }
    });

    this.socket.on('showScales', (scales: Models.ShowScale[]) => {
      if (scales.length > 0) {
        this.dialogRef = this.dialog.open(ScalesComponent, { disableClose: true, autoFocus: false, data: scales });
      }
      setTimeout(() => { this.dialogRef.close(); }, 4000);
    });

    this.socket.on('matchPoints', (data: Models.Points) => {
      this.points = data;
      this.points.games.unshift(this.roomCapacity === 3 ? [0, 0, 0] : [0, 0]);
      this.playCardEvent.emit(false);
      this.trump = null;
      this.playedCards = [];
    });

    this.socket.on('gamePoints', (data: number[]) => {
      this.points.games[0] = data;
      this.playedCards = [];
      if (this.scales.length > 0) {
        setTimeout(() => { this.scales = []; }, 1000);
      }
    });

    this.socket.on('playCard', (username: string) => {
      this.turn = username;
      this.playCardEvent.emit(username === this.username);
    });

    this.socket.on('moveNotAllowed', () => {
      this.dialogRef = this.dialog.open(NotificationComponent, {
        disableClose: true,
        data: {
          message: 'REKA SAN NE MOŽE!',
          dotted: false
        }
      });
      setTimeout( () => { this.dialogRef.close(); }, 1000);
    });

    this.socket.on('acceptCard', (data: Models.AcceptCard) => {
      this.playedCards.push(data);
    });

    this.socket.on('callBela', (data: any) => {
      if (data.username === this.username) {
        this.callBelaEvent.emit(data.card);
      }
    });

    this.socket.on('fail', (message: string) => {
      this.dialogRef = this.dialog.open(NotificationComponent, { disableClose: true, data: { message, dotted: false } });
      setTimeout( () => { this.dialogRef.close(); }, 1000);
    });

    this.socket.on('endMatch', (winningTeam: string) => {
      this.emit('userLeaves', this.username);
      this.restart();
      this.router.navigate(['/end-screen', { win: winningTeam }]).then();
    });

    this.socket.on('killMatch', (username: string) => {
      this.dialogRef.close();
      this.dialogRef = this.dialog.open(NotificationComponent, {
        disableClose: true,
        data: {
          message: username + ' je odustao. Vidimo se neki drugi put!',
          dotted: false
        }
      });
      setTimeout(() => { this.disconnect(this.username); }, 4000);
    });
  }
}
