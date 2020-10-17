import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-arrange-users',
  templateUrl: './dialog-arrange-users.component.html',
  styleUrls: ['./dialog-arrange-users.component.scss']
})
export class DialogArrangeUsersComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  reorder(init, dir) {
    [this.data[init], this.data[init + dir]] = [this.data[init + dir], this.data[init]];
  }
}
