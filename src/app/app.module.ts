import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { MainThreeComponent } from './components/main/main-three/main-three.component';
import { MainFourComponent } from './components/main/main-four/main-four.component';
import { HandComponent } from './components/hand/hand.component';
import { DialogTrumpsComponent } from './components/dialog-trumps/dialog-trumps.component';
import { DialogScalesComponent } from './components/dialog-scales/dialog-scales.component';
import { DialogArrangeUsersComponent } from './components/dialog-arrange-users/dialog-arrange-users.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ScoreBoardComponent } from './components/sidenav/score-board/score-board.component';
import { TeamBoardComponent } from './components/sidenav/team-board/team-board.component';
import { DialogNotificationComponent } from './components/dialog-notification/dialog-notification.component';
import { EndScreenComponent } from './components/end-screen/end-screen.component';
import { LoadingComponent } from './components/loading/loading.component';

import { AuthGuard } from './guards/auth.guard';
import { EnvService } from '../environments/env.service';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSidenavModule,
    MatIconModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    MainThreeComponent,
    MainFourComponent,
    HandComponent,
    DialogTrumpsComponent,
    DialogScalesComponent,
    DialogArrangeUsersComponent,
    SidenavComponent,
    ScoreBoardComponent,
    TeamBoardComponent,
    DialogNotificationComponent,
    EndScreenComponent,
    LoadingComponent
  ],
  providers: [
    AuthGuard,
    EnvService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
