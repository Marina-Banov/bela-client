import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-four',
  templateUrl: './main-four.component.html',
  styleUrls: ['./main-four.component.scss']
})
export class MainFourComponent implements OnInit {

  @Input() orderedUsernames: any[];
  @Input() turn: string;
  @Input() scales: any[];
  @Input() playedCards: any[];

  constructor() { }

  ngOnInit() {
  }

}
