import { Component, OnInit } from '@angular/core';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'app-main-four',
  templateUrl: './main-four.component.html',
  styleUrls: ['./main-four.component.scss']
})
export class MainFourComponent implements OnInit {

  orderedUsernames: any[] = [];

  constructor(public gameService: GameService) { }

  ngOnInit() {
    this.gameService.updateUsersEvent.subscribe(data => {
      this.orderedUsernames = data.orderedUsers;
    });
  }

}
