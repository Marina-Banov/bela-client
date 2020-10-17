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
import { ACTIONS } from './classes';

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
    this.socket.on('serverMessage', (data: Models.ServerMessage) => {
      switch (data.action) {
        case ACTIONS.ACCEPT_CARD:    this.acceptCard(data.username, data.card);      break;
        case ACTIONS.ANNOUNCE_SCALE: this.announceScale(data.username, data.points); break;
        case ACTIONS.ARRANGE_USERS:  this.arrangeUsers(data.users);                  break;
        case ACTIONS.CALL_BELA:      this.callBela(data.card);                       break;
        case ACTIONS.CALL_SCALE:     this.callScale(data.username);                  break;
        case ACTIONS.CALL_TRUMP:     this.callTrump(data.username, data.lastCall);   break;
        case ACTIONS.GAME_POINTS:    this.gamePoints(data.gamePoints);               break;
        case ACTIONS.INFO:           this.info(data.message);                        break;
        case ACTIONS.INFO_WAITING:   this.infoWaiting(data.message);                 break;
        case ACTIONS.MATCH_POINTS:   this.matchPoints(data.games, data.total);       break;
        case ACTIONS.NO_ROOM:        this.noRoom();                                  break;
        case ACTIONS.PLAY_CARD:      this.playCard(data.username);                   break;
        case ACTIONS.SET_HAND:       this.setHand(data.hand, data.displayAll);       break;
        case ACTIONS.SET_TRUMP:      this.setTrump(data.username, data.trump);       break;
        case ACTIONS.SHOW_SCALES:    this.showScales(data.scales);                   break;
        case ACTIONS.UPDATE_USERS:   this.updateUsers(data.users);                   break;
      }
    });
    /*

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
    });*/
  }

  acceptCard(username: string, card: string): void {
    this.playedCards.push({ username, card });
  }

  announceScale(username: string, pointsN: number): void {
    const points = pointsN ? pointsN.toString() : 'Dalje!';
    this.scales.push({ username, points });
  }

  arrangeUsers(users: string[]): void {
    this.dialogRef.close();
    this.dialogRef = this.dialog.open(ArrangeUsersComponent, { disableClose: true, data: users });
    this.dialogRef.afterClosed().subscribe(d => this.emit('reorderPlayers', d));
  }

  callBela(card: string): void {
    this.callBelaEvent.emit(card);
  }

  callScale(username: string): void {
    this.turn = username;
    if (username === this.username) {
      this.callScaleEvent.emit();
    }
  }

  callTrump(username: string, lastCall: boolean): void {
    this.turn = username;
    if (username === this.username) {
      this.dialogRef = this.dialog.open(TrumpsComponent, { disableClose: true, autoFocus: false, data: lastCall });
      this.dialogRef.afterClosed().subscribe( trump => {
        this.emit('calledTrump', trump);
      });
    }
  }

  gamePoints(gamePoints: number[]): void {
    this.points.games[0] = gamePoints;
    this.playedCards = [];
    if (this.scales.length > 0) {
      setTimeout(() => { this.scales = []; }, 1000);
    }
  }

  info(message: string) {
    this.dialogRef = this.dialog.open(NotificationComponent, { disableClose: true, data: { message, dotted: false } });
    setTimeout( () => { this.dialogRef.close(); }, 1000);
  }

  infoWaiting(message: string): void {
    if (!this.dialogRef) {
      this.dialogRef = this.dialog.open(NotificationComponent, { disableClose: true, data: { message, dotted: true } });
    } else {
      this.dialogRef.componentInstance.data = { message, dotted: true };
    }
  }

  matchPoints(games: number[][], total: number[]): void {
    this.points = { games, total };
    this.points.games.unshift(this.roomCapacity === 3 ? [0, 0, 0] : [0, 0]);
    this.playCardEvent.emit(false);
    this.trump = null;
    this.playedCards = [];
  }

  noRoom(): void {
    sessionStorage.removeItem('roomId');
    sessionStorage.removeItem('roomCapacity');
    this.socket.disconnect();
    setTimeout(() => {
      this.loadingService.stopLoading();
      this.router.navigate(['/login'], { state: { data: 'Room full' } }).then();
    }, 2000);
  }

  playCard(username: string): void {
    this.turn = username;
    this.playCardEvent.emit(username === this.username);
  }

  setHand(hand: Models.Card[], displayAll: boolean): void {
    this.loadingService.stopLoading();
    this.hand = { hand, displayAll };
    sessionStorage.setItem('hand', JSON.stringify(hand));
    this.handEvent.emit(this.hand);
    if (hand.length === 12) {
      this.discardTwo.emit();
    }
  }

  setTrump(username: string, trump: string): void {
    this.trump = { username, trump };
  }

  showScales(scales: Models.ShowScale[]): void {
    if (scales.length > 0) {
      this.dialogRef = this.dialog.open(ScalesComponent, { disableClose: true, autoFocus: false, data: scales });
    }
    setTimeout(() => { this.dialogRef.close(); }, 4000);
  }

  updateUsers(users: string[]): void {
    this.dialogRef.close();
    let index = users.indexOf(users.find(x => x === this.username));
    const orderedUsers = [];
    for (let i = 0; i < this.roomCapacity; i++) {
      orderedUsers.push(users[index]);
      index = (index + 1) % this.roomCapacity;
    }
    this.updateUsersEvent.emit({ users, orderedUsers });
  }
}
