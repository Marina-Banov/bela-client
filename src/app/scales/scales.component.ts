import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-scales',
  templateUrl: './scales.component.html',
  styleUrls: ['./scales.component.scss']
})
export class ScalesComponent implements OnInit {

  scalesByUser: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public scales: any) { }

  ngOnInit() {
    for (const s of this.scales) {
      const index = this.scalesByUser.indexOf(this.scalesByUser.find(x => x.username === s.username));
      if (index !== -1) {
        this.scalesByUser[index].hand.push(s.hand);
      } else {
        this.scalesByUser.push({
          username: s.username,
          hand: [s.hand]
        });
      }
    }
  }

}