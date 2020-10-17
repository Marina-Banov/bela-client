import { Component, OnInit } from '@angular/core';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'app-score-board',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.scss']
})
export class ScoreBoardComponent implements OnInit {

  users: string[] = [];

  constructor(public gameService: GameService) { }

  ngOnInit() {
    this.gameService.updateUsersEvent.subscribe(data => {
      this.users = data.users;
    });
  }

}
