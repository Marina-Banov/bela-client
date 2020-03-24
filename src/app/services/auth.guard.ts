import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { NavigationService } from './navigation.service';

@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate {

  constructor( private router: Router,
               private navigationService: NavigationService ) { }

  canActivate() {
    if ( this.navigationService.username ) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

}
