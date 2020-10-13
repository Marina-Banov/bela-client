import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-arrange-users',
  templateUrl: './arrange-users.component.html',
  styleUrls: ['./arrange-users.component.scss']
})
export class ArrangeUsersComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  reorder(init, dir) {
    [this.data[init], this.data[init + dir]] = [this.data[init + dir], this.data[init]];
  }
}
