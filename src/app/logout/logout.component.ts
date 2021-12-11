import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from '../services/firebase-auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  loggingOut = false;

  constructor(
    private _firebaseAuthService: FirebaseAuthService,
  ) { }

  async ngOnInit() {
    this.loggingOut = true;
    await this._firebaseAuthService.logout();
    this.loggingOut = false;
  }
}
