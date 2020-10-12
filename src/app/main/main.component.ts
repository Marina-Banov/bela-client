import { Component, OnInit } from '@angular/core';
import { SocketsService } from '../sockets.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  showHand = false;
  orderedUsernames: string[] = [];
  hand: string[] = [];
  display8: boolean;
  cardsToButtons = false;
  roomCapacity: number;

  constructor(public socketsService: SocketsService) { }

  ngOnInit() {
    this.roomCapacity = parseInt(sessionStorage.getItem('roomCapacity'), 10);
    this.socketsService.connect();

    this.socketsService.handEvent.subscribe( data => {
      this.showHand = true;
      this.hand = data.hand;
      this.display8 = data.display8;
    });

    this.socketsService.updateUsernamesEvent.subscribe(data => {
      this.orderedUsernames = data;
    });

    this.socketsService.playCardEvent.subscribe( data => {
      this.cardsToButtons = data;
    });
  }

}
