import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-score-board',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.scss']
})
export class ScoreBoardComponent implements OnInit {

  @Input() points: any;

  constructor() { }

  ngOnInit() {
  }

}
