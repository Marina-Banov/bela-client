import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate() {
    if (sessionStorage.getItem('username')
      && sessionStorage.getItem('roomId')
      && sessionStorage.getItem('roomCapacity')) {
      return true;
    } else {
      this.router.navigate(['/login']).then(() => {
        return false;
      });
    }
  }

}
