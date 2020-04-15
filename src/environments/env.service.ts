import { Injectable } from '@angular/core';
import { environment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  constructor() { }

  get apiUrl(): string {
    return (environment.production && window['__env'] != null) ? window['__env'].apiUrl : 'http://localhost:80';
  }

}
