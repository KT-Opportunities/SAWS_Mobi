import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { Keyboard } from '@capacitor/keyboard';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { APIService } from 'src/app/services/apis.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit, OnDestroy {

  isKeyboardVisible = false;
  loading = false;
  submitted = false;

  errorMgs = '';
  successMsg = '';
  userEmail = '';

  userForm!: FormGroup;

  // ============================================
  // PASSWORD VISIBILITY
  // ============================================

  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // ============================================
  // OTP
  // ============================================

  tokenBoxes: string[] = ['', '', '', '', '', ''];

  private keyboardShowListener: any;
  private keyboardHideListener: any;

  constructor(
    private router: Router,
    private platform: Platform,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private api: APIService,
    private toastController: ToastController
  ) {

    // ============================================
    // RESET PASSWORD FORM
    // ============================================

    this.userForm = this.fb.group(
      {
        Token: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(6)
          ]
        ],

        NewPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8)
          ]
        ],

        ConfirmPassword: [
          '',
          [
            Validators.required
          ]
        ]
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }

  // ============================================
  // ON INIT
  // ============================================

  async ngOnInit(): Promise<void> {

    await this.platform.ready();

    // ============================================
    // KEYBOARD LISTENERS
    // ============================================

    if (
      this.platform.is('capacitor') ||
      this.platform.is('cordova')
    ) {

      this.keyboardShowListener =
        await Keyboard.addListener(
          'keyboardWillShow',
          () => {
            this.isKeyboardVisible = true;
          }
        );

      this.keyboardHideListener =
        await Keyboard.addListener(
          'keyboardWillHide',
          () => {
            this.isKeyboardVisible = false;
          }
        );
    }

    // ============================================
    // GET EMAIL AND TOKEN FROM URL
    // ============================================

    this.route.queryParams.subscribe(params => {

      this.userEmail = params['email'] || '';

      // Backwards compatibility for token links
      const token = params['token'];

      if (token) {

        const tokenValue =
          token
            .toString()
            .substring(0, 6);

        this.userForm.patchValue({
          Token: tokenValue
        });

        this.tokenBoxes =
          tokenValue
            .split('')
            .concat(['', '', '', '', '', ''])
            .slice(0, 6);
      }
    });

    // ============================================
    // EMAIL REQUIRED
    // ============================================

    if (!this.userEmail) {

      this.presentToast(
        'top',
        'Email not found. Please request OTP again',
        'danger',
        'close'
      );

      this.router.navigate(['/forgot-password']);
    }
  }

  // ============================================
  // TOAST
  // ============================================

  async presentToast(
    position: 'top' | 'middle' | 'bottom',
    message: string,
    color: string,
    icon: string
  ) {

    const toast =
      await this.toastController.create({

        message: message,

        duration: 4000,

        position: position,

        color: color,

        icon: icon,

        cssClass: 'custom-toast'
      });

    await toast.present();
  }

  // ============================================
  // PASSWORD MATCH VALIDATOR
  // ============================================

  passwordMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {

    const password =
      control.get('NewPassword')?.value;

    const confirmPassword =
      control.get('ConfirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword
      ? null
      : { passwordMismatch: true };
  }

  // ============================================
  // NEW PASSWORD EYE TOGGLE
  // ============================================

  toggleNewPasswordVisibility(): void {

    this.showNewPassword =
      !this.showNewPassword;
  }

  // ============================================
  // CONFIRM PASSWORD EYE TOGGLE
  // ============================================

  toggleConfirmPasswordVisibility(): void {

    this.showConfirmPassword =
      !this.showConfirmPassword;
  }

  // ============================================
  // OTP INPUT
  // ============================================

  onTokenInput(
    event: any,
    index: number
  ): void {

    let value =
      event.target.value;

    // Only numbers
    value =
      value.replace(/[^0-9]/g, '');

    // One number per box
    value =
      value.substring(0, 1);

    this.tokenBoxes[index] =
      value;

    event.target.value =
      value;

    this.updateToken();

    // Move to next box
    if (value && index < 5) {

      const nextInput =
        document.getElementById(
          `token-${index + 1}`
        ) as HTMLInputElement;

      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  // ============================================
  // OTP BACKSPACE
  // ============================================

  onTokenKeyDown(
    event: KeyboardEvent,
    index: number
  ): void {

    if (
      event.key === 'Backspace' &&
      !this.tokenBoxes[index] &&
      index > 0
    ) {

      const previousInput =
        document.getElementById(
          `token-${index - 1}`
        ) as HTMLInputElement;

      if (previousInput) {

        previousInput.focus();

        this.tokenBoxes[index - 1] =
          '';

        previousInput.value =
          '';

        this.updateToken();
      }
    }
  }

  // ============================================
  // OTP PASTE
  // ============================================

  onTokenPaste(
    event: ClipboardEvent
  ): void {

    event.preventDefault();

    const pastedText =
      event.clipboardData?.getData('text') || '';

    const token =
      pastedText
        .replace(/[^0-9]/g, '')
        .substring(0, 6);

    if (!token) {
      return;
    }

    // Reset OTP boxes
    this.tokenBoxes = [
      '',
      '',
      '',
      '',
      '',
      ''
    ];

    // Fill OTP boxes
    token.split('').forEach(
      (digit, index) => {

        if (index < 6) {

          this.tokenBoxes[index] =
            digit;
        }
      }
    );

    this.updateToken();

    // Focus last entered box
    const lastIndex =
      Math.min(
        token.length - 1,
        5
      );

    const input =
      document.getElementById(
        `token-${lastIndex}`
      ) as HTMLInputElement;

    if (input) {
      input.focus();
    }
  }

  // ============================================
  // UPDATE TOKEN
  // ============================================

  private updateToken(): void {

    const token =
      this.tokenBoxes.join('');

    this.userForm.patchValue(
      {
        Token: token
      },
      {
        emitEvent: false
      }
    );

    this.userForm
      .get('Token')
      ?.markAsTouched();

    this.userForm
      .get('Token')
      ?.updateValueAndValidity();
  }

  // ============================================
  // SUBMIT
  // ============================================

  onSubmit(): void {

    this.errorMgs = '';
    this.successMsg = '';

    this.submitted = true;

    // ============================================
    // VALIDATE FORM
    // ============================================

    if (this.userForm.invalid) {

      this.userForm.markAllAsTouched();

      this.presentToast(
        'top',
        'Please fill all fields correctly',
        'danger',
        'close'
      );

      return;
    }

    this.loading = true;

    // ============================================
    // API REQUEST
    // ============================================

    const request = {

      email: this.userEmail,

      otp:
        this.userForm.value.Token,

      newPassword:
        this.userForm.value.NewPassword
    };

    this.api
      .VerifyOTPAndResetPassword(request)
      .subscribe({

        // ========================================
        // SUCCESS
        // ========================================

        next: (res: any) => {

          this.loading = false;

          if (res.success) {

            this.successMsg =
              'Password reset successfully';

            this.presentToast(
              'top',
              'Password reset successfully',
              'success',
              'checkmark'
            );

            setTimeout(() => {

              this.router.navigate([
                '/login'
              ]);

            }, 1500);
          }
        },

        // ========================================
        // ERROR
        // ========================================

        error: (error) => {

          this.loading = false;

          this.errorMgs =
            error?.error?.errorMessage ||
            'Invalid OTP or password';

          this.presentToast(
            'top',
            this.errorMgs,
            'danger',
            'close'
          );
        }
      });
  }

  // ============================================
  // LOGIN
  // ============================================

  login(): void {

    this.router.navigate([
      '/login'
    ]);
  }

  // ============================================
  // DESTROY
  // ============================================

  ngOnDestroy(): void {

    if (this.keyboardShowListener) {

      this.keyboardShowListener.remove();
    }

    if (this.keyboardHideListener) {

      this.keyboardHideListener.remove();
    }
  }
}

