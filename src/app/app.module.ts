import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/shared/material.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { SidenavComponent } from './child_components/sidenav/sidenav.component';
import { TasksComponent } from './child_components/tasks/tasks.component';
import { TasksListComponent } from './child_components/tasks/child_components/tasks-list/tasks-list.component';
import { NewTaskComponent } from './child_components/tasks/child_components/new-task/new-task.component';
import { RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { LogoutComponent } from './logout/logout.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TaskListItemComponent } from './child_components/tasks/child_components/task-list-item/task-list-item.component';
import { SnackbarService } from './services/snackbar.service';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    TasksComponent,
    TasksListComponent,
    NewTaskComponent,
    AuthComponent,
    LogoutComponent,
    TaskListItemComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'auth', pathMatch: 'full' },
      { path: 'auth', component: AuthComponent },
      { path: 'tasks', component: TasksComponent },
      { path: 'logout', component: LogoutComponent },
      { path: '**', redirectTo: 'auth', pathMatch: 'full' },
    ]),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  providers: [
    ScreenTrackingService,
    UserTrackingService,
    SnackbarService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
