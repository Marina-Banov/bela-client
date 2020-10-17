import { Component, OnInit } from '@angular/core';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'app-main-three',
  templateUrl: './main-three.component.html',
  styleUrls: ['./main-three.component.scss']
})
export class MainThreeComponent implements OnInit {

  orderedUsernames: any[] = [];

  constructor(public gameService: GameService) { }

  ngOnInit() {
    this.gameService.updateUsersEvent.subscribe(data => {
      this.orderedUsernames = data.orderedUsers;
    });
  }

}
