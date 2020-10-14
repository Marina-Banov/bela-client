import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../socket.service';

@Component({
  selector: 'app-team-board',
  templateUrl: './team-board.component.html',
  styleUrls: ['./team-board.component.scss']
})
export class TeamBoardComponent implements OnInit {

  teams = { A: [], B: [] };

  constructor(private socketService: SocketService) { }

  ngOnInit() {
    this.socketService.updateUsersEvent.subscribe(data => {
      this.teams = {
        A: [data.users[0], data.users[2]],
        B: [data.users[1], data.users[3]]
      };
    });
  }

}
