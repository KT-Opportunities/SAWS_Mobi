import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/apis.service';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Keyboard } from '@capacitor/keyboard';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  @ViewChild('userFormRef') userFormRef!: ElementRef;
  showPassword: boolean = false;
  currentStep: number = 1;
  userForm: FormGroup;
  submitted = false;
  errorMessage: string | null = null;
  errorMessageExist: string | null = null;
  successMessage: string | null = null;
  loading = false;
  statusMessage = false;
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    // Adjust your layout here based on the window size
  }
  @ViewChild('content') content!: ElementRef;

  // Call this method when the keyboard is opened
  scrollContent(): void {
    this.content.nativeElement.scrollIntoView();
  }

  scrollToForm() {
    if (this.userFormRef) {
      this.userFormRef.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  isKeyboardVisible = false;

  constructor(
    private formBuilder: FormBuilder,
    private api: APIService,
    private router: Router,
    private renderer: Renderer2,
    private alertController: AlertController,
    private authAPI: AuthService,
    private toastController: ToastController,
    private platform: Platform
  ) {
    this.userForm = this.formBuilder.group({
      Fullname: ['', Validators.required],
      Username: [''],
      Email: ['', [Validators.required, this.emailValidator]],
      Password: ['', [Validators.required, this.passwordValidator]],
      ConfirmPassword: ['', Validators.required],
      UserRole: ['Subscriber', Validators.required],
    });

    this.userForm.get('Password')?.valueChanges.subscribe(() => {
      this.clearPasswordError();
    });
    this.userForm.get('ConfirmPassword')?.valueChanges.subscribe(() => {
      this.clearPasswordError();
    });
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      // Listen for keyboard will show event
      Keyboard.addListener('keyboardWillShow', () => {
        this.isKeyboardVisible = true;
      });

      // Listen for keyboard will hide event
      Keyboard.addListener('keyboardWillHide', () => {
        this.isKeyboardVisible = false;
      });
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword; // Toggle the visibility

    const passwordField = document.getElementById(
      'Password'
    ) as HTMLInputElement;
    const confirmPasswordField = document.getElementById(
      'ConfirmPassword'
    ) as HTMLInputElement;

    // Toggle the type of both password fields based on the showPassword flag
    passwordField.type = this.showPassword ? 'text' : 'password';
    confirmPasswordField.type = this.showPassword ? 'text' : 'password';
  }

  async presentPopup() {
    const alert = await this.alertController.create({
      message: 'User Already Exists.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async Successfully() {
    const alert = await this.alertController.create({
      header: 'Success',

      message: 'Successfully Registered.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  emailValidator(control: any) {
    if (control.value) {
      const matches = control.value.match(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
      );
      return matches ? null : { invalidEmail: true };
    } else {
      return null;
    }
  }

  passwordValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const value: string = control.value;
    const hasCapitalLetter = /[A-Z]/.test(value);
    const hasSmallLetter = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const isValidLength = value.length >= 8;

    if (!hasCapitalLetter || !hasSmallLetter || !hasNumber || !isValidLength) {
      return { invalidPassword: true };
    }

    return null;
  }

  onSubmit() {
    this.loading = true;
    this.submitted = true;
    this.userForm.markAllAsTouched();
    this.scrollToForm();

    const password = this.userForm.get('Password')?.value;
    const confirmPassword = this.userForm.get('ConfirmPassword')?.value;

    if (password !== confirmPassword) {
      this.errorMessage = 'Password and confirm password do not match.';
      this.loading = false;
      return;
    }

    const body = {
      Fullname: this.userForm.get('Fullname')?.value,
      Username: this.userForm.get('Email')?.value,
      Email: this.userForm.get('Email')?.value,
      Password: this.userForm.get('Password')?.value,
      UserRole: this.userForm.get('UserRole')?.value,
    };

    var emailbody = {
      username: body.Username,
      password: body.Password,
    };

    if (this.userForm.invalid) {
      this.loading = false;
      return;
    } else {
      this.api.createNewUser(body).subscribe(
        (data: any) => {
          this.statusMessage = true;
          this.errorMessage = null;
          this.loading = false;

          this.presentToast(
            'top',
            'Account Created Successfully!',
            'success',
            'close'
          );
          this.sendEmail(emailbody);

          this.router.navigate(['login']);
          this.onReset();
        },
        (error: any) => {
          if (error.error.Message === 'User Exists') {
            // this.presentPopup();
            this.presentToastReg(
              'top',
              'User Alredy Exists!',
              'danger',
              'close'
            );
          }
          this.loading = false;
        }
      );
    }
  }

  sendEmail(body: any) {
    this.api.sendCredentials(body).subscribe(
      (data: any) => {},
      (err) => console.log('error', err)
    );
  }

  async presentToastReg(
    position: 'top' | 'middle' | 'bottom',
    message: string,
    color: string,
    icon: string
  ) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: position,
      color: color,
      icon: icon,
      cssClass: 'custom-toast',
      swipeGesture: 'vertical',
      buttons: [
        {
          side: 'end',
          text: 'Go to Login',
          handler: () => {
            this.router.navigate(['/login']);
          },
        },
      ],
    });

    await toast.present();
  }

  async presentToast(
    position: 'top' | 'middle' | 'bottom',
    message: string,
    color: string,
    icon: string
  ) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: position,
      color: color,
      icon: icon,
      cssClass: 'custom-toast',
      swipeGesture: 'vertical',
      buttons: [
        {
          icon: 'close',
          htmlAttributes: {
            'aria-label': 'close',
          },
        },
      ],
    });

    await toast.present();
  }

  login() {
    this.router.navigate(['/login']);
  }

  onReset() {
    this.submitted = false;
    this.userForm.reset();
    this.statusMessage = false;
  }

  clearPasswordError() {
    if (this.errorMessage === 'Password and confirm password do not match.') {
      this.errorMessage = null;
    }
  }

  NavigateToLogin() {
    this.router.navigate(['/login']);
  }

  nextStep() {
    this.currentStep++;
  }

  prevStep() {
    this.currentStep--;
  }

  submitForm() {
    console.log('Form submitted!');
  }
}
