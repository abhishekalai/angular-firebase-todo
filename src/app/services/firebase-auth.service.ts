import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { LocalStorageKeys } from 'src/shared/enum';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  isLoggedIn = false;
  _userId = '';

  public get userId() {
    if (this._userId) {
      return this._userId;
    } else {
      this._userId = JSON.parse(localStorage.getItem(LocalStorageKeys.user) as any).uid;
      return this._userId;
    }
  }

  public set userId(val: string) {
    this._userId = val;
  }

  constructor(
    public firebaseAuth: Auth
  ) { }

  async signIn(email: string, password: string) {
    try {
      const userCredentials = await signInWithEmailAndPassword(this.firebaseAuth, email, password);
      this.userId = userCredentials.user.uid;
      localStorage.setItem(LocalStorageKeys.user, JSON.stringify(userCredentials.user));
      localStorage.setItem(LocalStorageKeys.authProvider, JSON.stringify(userCredentials.providerId));

      this.isLoggedIn = true;
    } catch (error) {
      this.isLoggedIn = false;
      console.error(error);
    }
  }

  async signup(email: string, password: string) {
    return await createUserWithEmailAndPassword(this.firebaseAuth, email, password);
  }

  async logout(): Promise<void> {
    return signOut(this.firebaseAuth)
      .then(() => { localStorage.clear(); return; });
  }
}
