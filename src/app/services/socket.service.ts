import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { LoadingService } from './loading.service';
import * as Models from '../classes';
import { ACTIONS } from '../classes';
import { GameService } from './game.service';
import { DialogArrangeUsersComponent } from '../components/dialog-arrange-users/dialog-arrange-users.component';
import { DialogTrumpsComponent } from '../components/dialog-trumps/dialog-trumps.component';
import { DialogRefService } from './dialog-ref.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: any;
  public roomCapacity: number;

  constructor(private dialog: MatDialog,
              private dialogService: DialogRefService,
              private router: Router,
              private loadingService: LoadingService,
              private game: GameService) { }

  public connect(): void {
    this.loadingService.startLoading();

    const username = sessionStorage.getItem('username');
    this.game.username = username;
    const roomId = sessionStorage.getItem('roomId');
    this.roomCapacity = parseInt(sessionStorage.getItem('roomCapacity'), 10);
    this.game.roomCapacity = this.roomCapacity;

    this.game.restart();

    this.socket = io(environment.apiUrl);
    this.socket.emit('clientMessage', {
      action: ACTIONS.JOIN_ROOM,
      username,
      roomId,
      roomCapacity: this.roomCapacity,
      hand: null
    });
    this.setEvents();
  }

  public disconnect(username: string): void {
    sessionStorage.removeItem('username');
    this.emit('killedMatch', username);
    this.socket.disconnect();
    this.router.navigate(['/login']).then();
    this.dialogService.dialogRef.close();
  }

  public emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }

  private setEvents(): void {
    this.socket.on('serverMessage', (data: Models.ServerMessage) => {
      switch (data.action) {
        case ACTIONS.ACCEPT_CARD:    this.game.acceptCard(data.username, data.card);      break;
        case ACTIONS.ANNOUNCE_SCALE: this.game.announceScale(data.username, data.points); break;
        case ACTIONS.ARRANGE_USERS:  this.arrangeUsers(data.users);                       break;
        case ACTIONS.CALL_BELA:      this.game.callBela(data.card);                       break;
        case ACTIONS.CALL_SCALE:     this.game.callScale(data.username);                  break;
        case ACTIONS.CALL_TRUMP:     this.callTrump(data.username, data.lastCall);        break;
        case ACTIONS.GAME_POINTS:    this.game.gamePoints(data.gamePoints);               break;
        case ACTIONS.INFO:           this.game.info(data.message);                        break;
        case ACTIONS.INFO_WAITING:   this.game.infoWaiting(data.message);                 break;
        case ACTIONS.MATCH_POINTS:   this.game.matchPoints(data.games, data.total);       break;
        case ACTIONS.NO_ROOM:        this.noRoom();                                       break;
        case ACTIONS.PLAY_CARD:      this.game.playCard(data.username);                   break;
        case ACTIONS.SET_HAND:       this.game.setHand(data.hand, data.displayAll);       break;
        case ACTIONS.SET_TRUMP:      this.game.setTrump(data.username, data.trump);       break;
        case ACTIONS.SHOW_SCALES:    this.game.showScales(data.scales);                   break;
        case ACTIONS.UPDATE_USERS:   this.game.updateUsers(data.users);                   break;
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
      this.dialogRef = this.dialog.open(DialogNotificationComponent, {
        disableClose: true,
        data: {
          message: username + ' je odustao. Vidimo se neki drugi put!',
          dotted: false
        }
      });
      setTimeout(() => { this.disconnect(this.username); }, 4000);
    });*/
  }

  private arrangeUsers(users: string[]): void {
    this.dialogService.dialogRef.close();
    this.dialogService.dialogRef = this.dialog.open(DialogArrangeUsersComponent, { disableClose: true, data: users });
    this.dialogService.dialogRef.afterClosed().subscribe(usernames => {
      this.emit('clientMessage', { action: ACTIONS.REORDER_PLAYERS, usernames });
    });
  }

  private callTrump(username: string, lastCall: boolean): void {
    this.game.turn = username;
    if (username === this.game.username) {
      this.dialogService.dialogRef = this.dialog.open(DialogTrumpsComponent, { disableClose: true, autoFocus: false, data: lastCall });
      this.dialogService.dialogRef.afterClosed().subscribe( trump => {
        this.emit('clientMessage', { action: ACTIONS.CALLED_TRUMP, trump });
      });
    }
  }

  private noRoom(): void {
    sessionStorage.removeItem('roomId');
    sessionStorage.removeItem('roomCapacity');
    this.socket.disconnect();
    setTimeout(() => {
      this.loadingService.stopLoading();
      this.router.navigate(['/login'], { state: { data: 'Room full' } }).then();
    }, 2000);
  }
}
