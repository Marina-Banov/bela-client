import { Component, OnInit } from '@angular/core';
import { SocketsService } from '../services/sockets.service';
import { NavigationService } from '../services/navigation.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TrumpsComponent } from '../trumps/trumps.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  users = [];
  hand = [];
  myTeam = '';
  trump: any;
  trumpRef: MatDialogRef<any>;
  display8 = false;

  constructor(protected navigationService: NavigationService,
              protected socketsService: SocketsService,
              protected dialog: MatDialog) { }

  ngOnInit() {
    this.socketsService.username = this.navigationService.username;
    this.socketsService.emit('newUser', this.navigationService.username);

    this.socketsService.assignTeamEvent.subscribe(data => {
      this.myTeam = data;
    });

    this.socketsService.updateUsersEvent.subscribe(data => {
      this.users = data;
    });

    this.socketsService.handEvent.subscribe( data => {
      this.hand = data;
    });

    this.socketsService.callTrumpEvent.subscribe( data => {
      this.trumpRef = this.dialog.open(TrumpsComponent, { disableClose: true, autoFocus: false, data });
      this.trumpRef.afterClosed().subscribe( trump => {
        this.socketsService.emit('calledTrump', trump);
        this.display8 = true;
      });
    });

    this.socketsService.setTrumpEvent.subscribe( data => {
      this.trump = data.trump;
      this.hand = data.hand;
      this.display8 = true;
    });
  }

}
