import { Component, OnInit } from '@angular/core';
import { SocketsService } from '../services/sockets.service';
import { NavigationService } from '../services/navigation.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TrumpsComponent } from '../dialogs/trumps/trumps.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  showHand = false;
  orderedUsernames = [];
  hand = [];
  myTeam = '';
  trump: any;
  trumpRef: MatDialogRef<any>;
  display8 = false;
  turn = '';

  constructor(protected navigationService: NavigationService,
              protected socketsService: SocketsService,
              protected dialog: MatDialog) { }

  ngOnInit() {
    this.socketsService.username = this.navigationService.username;
    this.socketsService.emit('newUser', this.navigationService.username);

    this.socketsService.handEvent.subscribe( data => {
      this.showHand = true;
      this.hand = data;
    });

    this.socketsService.assignTeamEvent.subscribe(data => {
      this.myTeam = data;
    });

    this.socketsService.updateUsersEvent.subscribe(data => {
      this.orderedUsernames = data;
    });

    this.socketsService.highlightTurn.subscribe( data => {
      this.turn = data;
    });

    this.socketsService.callTrumpEvent.subscribe( data => {
      this.trumpRef = this.dialog.open(TrumpsComponent, { disableClose: true, autoFocus: false, data });
      this.trumpRef.afterClosed().subscribe( trump => {
        this.socketsService.emit('calledTrump', trump);
        this.display8 = true;
        this.hand.sort((a, b) => (a.scalePriority > b.scalePriority) ? 1 : -1);
      });
    });

    this.socketsService.setTrumpEvent.subscribe( data => {
      this.trump = data.trump;
      this.hand = data.hand;
      this.display8 = true;
      this.hand.sort((a, b) => (a.scalePriority > b.scalePriority) ? 1 : -1);
    });
  }

}
