import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../socket.service';

@Component({
  selector: 'app-score-board',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.scss']
})
export class ScoreBoardComponent implements OnInit {

  users: string[] = [];

  constructor(public socketService: SocketService) { }

  ngOnInit() {
    this.socketService.updateUsersEvent.subscribe(data => {
      this.users = data.users;
    });
  }

}
