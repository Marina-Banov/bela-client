import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../socket.service';

@Component({
  selector: 'app-main-three',
  templateUrl: './main-three.component.html',
  styleUrls: ['./main-three.component.scss']
})
export class MainThreeComponent implements OnInit {

  orderedUsernames: any[] = [];

  constructor(public socketService: SocketService) { }

  ngOnInit() {
    this.socketService.updateUsersEvent.subscribe(data => {
      this.orderedUsernames = data.orderedUsers;
    });
  }

}
