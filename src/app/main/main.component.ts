import { Component, OnInit } from '@angular/core';
import { SocketsService } from '../services/sockets.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TrumpsComponent } from '../dialogs/trumps/trumps.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  showHand = false;
  orderedUsernames: string[] = [];
  hand: string[] = [];
  trumpRef: MatDialogRef<any>;
  display8 = false;
  cardsToButtons = false;

  constructor(protected socketsService: SocketsService,
              protected dialog: MatDialog) { }

  ngOnInit() {
    this.socketsService.handEvent.subscribe( data => {
      this.showHand = true;
      this.hand = data;
    });

    this.socketsService.updateUsernamesEvent.subscribe(data => {
      this.orderedUsernames = data;
    });

    this.socketsService.callTrumpEvent.subscribe( data => {
      this.trumpRef = this.dialog.open(TrumpsComponent, { disableClose: true, autoFocus: false, data });
      this.trumpRef.afterClosed().subscribe( trump => {
        this.socketsService.emit('calledTrump', trump);
        this.display8 = true;
      });
    });

    this.socketsService.setTrumpEvent.subscribe( data => {
      this.display8 = true;
    });

    this.socketsService.playCardEvent.subscribe( data => {
      this.cardsToButtons = data;
    });
  }

}
