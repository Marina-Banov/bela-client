import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  fullRoom: boolean;
  loginForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router) {
    this.loginForm = this.formBuilder.group( {
      username: ['', [Validators.required, Validators.pattern('^[^<>]+$')]],
      room: ['', [Validators.required, Validators.pattern('^[^<>]+$')]]
    });
  }

  ngOnInit() {
    if (sessionStorage.getItem('username')
      && sessionStorage.getItem('roomId')
      && sessionStorage.getItem('roomCapacity')) {
      this.router.navigate(['/']).then();
    }
    this.fullRoom = (history.state.data === 'Room full');
    if (this.fullRoom) {
      this.loginForm.controls.username.setValue(sessionStorage.getItem('username'));
    }
  }

  getRoom(capacity) {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    sessionStorage.setItem('username', this.loginForm.controls.username.value);
    sessionStorage.setItem('roomId', this.loginForm.controls.room.value);
    sessionStorage.setItem('roomCapacity', capacity);
    this.router.navigate(['/']).then();
  }
}
