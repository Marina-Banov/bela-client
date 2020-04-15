import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public submitted = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router) {
    this.loginForm = this.formBuilder.group( {
      username : ['', [Validators.required, Validators.pattern('^[^<>]+$')]]
    });
  }

  ngOnInit() {
    if (sessionStorage.getItem('username')) {
      this.router.navigate(['/']);
    }
  }

  login() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    sessionStorage.setItem('username', this.loginForm.controls.username.value);
    this.router.navigate(['/']);
  }
}
