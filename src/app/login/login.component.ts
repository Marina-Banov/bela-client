import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private loginForm: FormGroup;
  private submitted = false;

  constructor( private formBuilder: FormBuilder,
               private router: Router,
               protected navigationService: NavigationService) {
    this.loginForm = this.formBuilder.group( {
      username : ['', [Validators.required, Validators.pattern('^[^<>]+$')]]
    });
  }

  ngOnInit() {
  }

  login() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.navigationService.username = this.loginForm.controls.username.value;
    this.router.navigate(['/']);
  }
}
