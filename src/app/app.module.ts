import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatDialogModule,
  MAT_DIALOG_DEFAULT_OPTIONS
} from '@angular/material';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { TrumpsComponent } from './trumps/trumps.component';

import { AuthGuard } from './services/auth.guard';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    TrumpsComponent
  ],
  entryComponents: [
    TrumpsComponent
  ],
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
