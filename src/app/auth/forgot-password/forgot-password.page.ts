import {
  Component,
  HostListener,
  ViewChild,
  ElementRef,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { APIService } from 'src/app/services/apis.service';
import { Keyboard } from '@capacitor/keyboard';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  userForm: FormGroup;
  submitted = false;
  errorMgs: string | null = null;
  successMessage: string | null = null;
  loading = false;
  statusMessage = false;
  errorMessage = false;

  isKeyboardVisible = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    // Adjust your layout here based on the window size
  }
  @ViewChild('content') content!: ElementRef;

  // Call this method when the keyboard is opened
  scrollContent(): void {
    this.content.nativeElement.scrollIntoView();
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
  constructor(
    private formBuilder: FormBuilder,
    private api: APIService,
    private router: Router,
    private alertController: AlertController,
    private platform: Platform,
    private toastController: ToastController
  ) {
    this.userForm = this.formBuilder.group({
      Email: ['', [Validators.required, this.emailValidator]],
    });

    Keyboard.addListener('keyboardWillShow', () => {
      this.isKeyboardVisible = true;
    });

    Keyboard.addListener('keyboardWillHide', () => {
      this.isKeyboardVisible = false;
    });
  }

  ngOnInit(): void {
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

  async presentToast(position: 'top' | 'middle' | 'bottom', message: string, color: string, icon: string) {

    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      position: position,
      color: color,
      icon: icon,
      cssClass:"custom-toast",
      swipeGesture: "vertical",
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

  onSubmit() {
    this.loading = true;
    this.submitted = true;

    var body = {
      Email: this.userForm.controls['Email'].value,
    };

    if (this.userForm.invalid) {
       this.presentToast('top','Invalid form submission!', 'danger', 'close');
       this.loading = false;
      return;
    } else {
      this.api.RequestPasswordReset(body).subscribe(
        (data: any) => {
          this.loading = false;

          this.presentToast('top','Request Successful! Please check your email for further intructions', 'success', 'checkmark');
          
          setTimeout(() => {
            this.navigateToLogin();
          }, 5000);

        },
        (error) => {
          if (
            error &&
            error.error &&
            error.error.response === 'Invalid email'
          ) {
            this.presentToast('top','The provided email does not exist!', 'danger', 'close');
          } else {
            this.presentToast('top','Something went wrong the request!', 'danger', 'close');
          }
          this.loading = false;
        }
      );
    }

    this.onReset();
  }
  login() {
    this.router.navigate(['/login']);
  }

  onReset() {
    this.submitted = false;
    this.userForm.reset();
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
