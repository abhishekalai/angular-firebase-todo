import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '../services/firebase-auth.service';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  emailSignInForm!: FormGroup;
  emailSignUpForm!: FormGroup;
  emailSignInInProgress = false;
  emailSignUpInProgress = false;

  constructor(
    private _fb: FormBuilder,
    private _firebaseAuthService: FirebaseAuthService,
    private _router: Router,
  ) {
    this.emailSignInForm = this._fb.group({
      email: [
        '',
        [Validators.email, Validators.required, Validators.maxLength(100)],
      ],
      password: ['', [Validators.required, Validators.maxLength(32)]],
    });

    const checkIfMatchingPasswords = (
      passwordKey: string,
      passwordConfirmationKey: string
    ) => {
      return (group: FormGroup) => {
        let passwordInput = group.controls[passwordKey],
          passwordConfirmationInput = group.controls[passwordConfirmationKey];
        if (passwordInput.value !== passwordConfirmationInput.value) {
          return passwordConfirmationInput.setErrors({ notEquivalent: true });
        } else {
          return passwordConfirmationInput.setErrors(null);
        }
      };
    };

    this.emailSignUpForm = this._fb.group(
      {
        email: [
          '',
          [Validators.email, Validators.required, Validators.maxLength(100)],
        ],
        password: ['', [Validators.required, Validators.maxLength(32)]],
        confirmPassword: ['', [Validators.required, Validators.maxLength(32)]],
      },
      { Validators: checkIfMatchingPasswords('password', 'confirmPassword') }
    );
  }

  ngOnInit(): void {}

  async doEmailSignIn() {
    if (!this.emailSignInForm.valid) {
      this.emailSignInForm.markAllAsTouched();
      return;
    }
    this.emailSignInInProgress = true;
    const { email, password } = this.emailSignInForm.getRawValue();
    await this._firebaseAuthService.signIn(email, password);
    this.emailSignInInProgress = false;
    this.emailSignInForm.reset();
    this._router.navigate(['tasks/myday']);
  }

  async doEmailSignUp() {
    if (!this.emailSignUpForm.valid) {
      this.emailSignUpForm.markAllAsTouched();
      return;
    }
    this.emailSignUpInProgress = true;
    const { email, password } = this.emailSignUpForm.getRawValue();
    await this._firebaseAuthService.signup(email, password);
    this.emailSignUpInProgress = false;
    this.emailSignUpForm.reset();
    // this.goToSignInTab();
  }
}
