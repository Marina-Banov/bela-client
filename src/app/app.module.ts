import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatSidenavModule } from '@angular/material';
import { GoogleIconModule } from 'google-icon';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { TrumpsComponent } from './trumps/trumps.component';
import { HandComponent } from './main/hand/hand.component';
import { TableComponent } from './main/table/table.component';
import { ScalesComponent } from './scales/scales.component';
import { NoHandComponent } from './no-hand/no-hand.component';
import { ScoreBoardComponent } from './sidenav/score-board/score-board.component';
import { SidenavComponent } from './sidenav/sidenav.component';

import { AuthGuard } from './services/auth.guard';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSidenavModule,
    GoogleIconModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    TrumpsComponent,
    HandComponent,
    TableComponent,
    ScalesComponent,
    NoHandComponent,
    ScoreBoardComponent,
    SidenavComponent
  ],
  entryComponents: [
    TrumpsComponent,
    ScalesComponent
  ],
  providers: [
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
