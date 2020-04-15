import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-team-board',
  templateUrl: './team-board.component.html',
  styleUrls: ['./team-board.component.scss']
})
export class TeamBoardComponent implements OnInit {

  @Input() teams: any;

  constructor() { }

  ngOnInit() {
  }

}
