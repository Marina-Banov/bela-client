import { Component, OnInit } from '@angular/core';
import { SocketsService } from '../services/sockets.service';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  hand = [];

  constructor(protected navigationService: NavigationService,
              protected socketsService: SocketsService) { }

  ngOnInit() {
    this.socketsService.username = this.navigationService.username;
    this.socketsService.emit('new user', this.navigationService.username);
    this.socketsService.event.subscribe( data => {
      this.hand = data;
    });
  }

}
