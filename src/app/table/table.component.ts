import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {

  @Input() users: any[];
  @Input() myTeam: string;
  orderUsers = [];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.orderUsers = [];
    const index = this.users.indexOf(this.users.find(u => u.team === this.myTeam));
    if (index !== -1) {
      let i = index;
      do {
        this.orderUsers.push(this.users[i].username);
        i = (i + 1) % this.users.length;
      } while (i !== index);
    }
  }

}
