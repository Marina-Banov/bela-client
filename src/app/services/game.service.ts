import { EventEmitter, Injectable } from '@angular/core';
import { DialogNotificationComponent } from '../components/dialog-notification/dialog-notification.component';
import { DialogScalesComponent } from '../components/dialog-scales/dialog-scales.component';
import * as Models from '../classes';
import { MatDialog } from '@angular/material/dialog';
import { LoadingService } from './loading.service';
import { DialogRefService } from './dialog-ref.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  public username: string;
  public roomCapacity: number;

  public handEvent = new EventEmitter<any>();
  public updateUsersEvent = new EventEmitter<any>();
  public callScaleEvent = new EventEmitter<any>();
  public discardTwo = new EventEmitter<any>();
  public playCardEvent = new EventEmitter<boolean>();
  public callBelaEvent = new EventEmitter<string>();

  private hand: Models.Hand;
  public playedCards: Models.AcceptCard[];
  public points: Models.Points;
  public scales: Models.StoreScale[];
  public trump: Models.SetTrump;
  public turn: string;

  constructor(private dialog: MatDialog,
              private dialogService: DialogRefService,
              private loadingService: LoadingService) { }

  public restart(): void {
    this.hand = null;
    this.trump = null;
    this.points = {
      games: [this.roomCapacity === 3 ? [0, 0, 0] : [0, 0]],
      total: this.roomCapacity === 3 ? [0, 0, 0] : [0, 0]
    };
    this.scales = [];
    this.playedCards = [];
    this.turn = '';
  }

  acceptCard(username: string, card: string): void {
    this.playedCards.push({ username, card });
  }

  announceScale(username: string, pointsN: number): void {
    const points = pointsN ? pointsN.toString() : 'Dalje!';
    this.scales.push({ username, points });
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

  gamePoints(gamePoints: number[]): void {
    this.points.games[0] = gamePoints;
    this.playedCards = [];
    if (this.scales.length > 0) {
      setTimeout(() => { this.scales = []; }, 1000);
    }
  }

  info(message: string) {
    this.dialogService.dialogRef = this.dialog.open(DialogNotificationComponent, { disableClose: true, data: { message, dotted: false } });
    setTimeout( () => { this.dialogService.dialogRef.close(); }, 1000);
  }

  infoWaiting(message: string): void {
    this.loadingService.stopLoading();
    if (!this.dialogService.dialogRef) {
      this.dialogService.dialogRef = this.dialog.open(DialogNotificationComponent, { disableClose: true, data: { message, dotted: true } });
    } else {
      this.dialogService.dialogRef.componentInstance.data = { message, dotted: true };
    }
  }

  matchPoints(games: number[][], total: number[]): void {
    this.points = { games, total };
    this.points.games.unshift(this.roomCapacity === 3 ? [0, 0, 0] : [0, 0]);
    this.playCardEvent.emit(false);
    this.trump = null;
    this.playedCards = [];
  }

  playCard(username: string): void {
    this.turn = username;
    this.playCardEvent.emit(username === this.username);
  }

  setHand(hand: Models.Card[], displayAll: boolean): void {
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
      this.dialogService.dialogRef = this.dialog.open(DialogScalesComponent, { disableClose: true, autoFocus: false, data: scales });
    }
    setTimeout(() => { this.dialogService.dialogRef.close(); }, 4000);
  }

  updateUsers(users: string[]): void {
    this.dialogService.dialogRef.close();
    let index = users.indexOf(users.find(x => x === this.username));
    const orderedUsers = [];
    for (let i = 0; i < this.roomCapacity; i++) {
      orderedUsers.push(users[index]);
      index = (index + 1) % this.roomCapacity;
    }
    this.updateUsersEvent.emit({ users, orderedUsers });
  }
}
