import { Component, OnInit } from '@angular/core';
import { SocketsService } from '../services/sockets.service';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(protected navigationService: NavigationService,
              protected socketsService: SocketsService) { }

  ngOnInit() {
    this.socketsService.emit('new user', this.navigationService.username);
  }

}
