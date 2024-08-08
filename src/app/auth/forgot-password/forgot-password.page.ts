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
import { AlertController, Platform } from '@ionic/angular';
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
    private platform: Platform
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

  async Successfully() {
    const alert = await this.alertController.create({
      header: 'Success',

      message: 'Thank you! Your submission has been received!',
      buttons: ['OK'],
    });

    await alert.present();
  }

  onSubmit() {
    this.submitted = true;

    var body = {
      Email: this.userForm.controls['Email'].value,
    };

    if (this.userForm.invalid) {
      return;
    } else {
      this.api.RequestPasswordReset(body).subscribe(
        (data: any) => {
          this.router.navigate([this.router.url]);
          this.Successfully();
          this.statusMessage = true;
        },
        (error) => {
          console.error('Error:', error);
          if (
            error &&
            error.error &&
            error.error.response === 'Invalid email'
          ) {
            debugger;
            // this.router.navigate(['/forgot-password']);
            // Handle the case when the email doesn't exist
            this.errorMgs = 'The provided email does not exist.';
          } else {
            // Handle other types of errors
           
          }
          this.loading = false;
        }
      );
    }
  }
  home() {
    this.router.navigate(['/landing-page']);
  }

  onReset() {
    this.submitted = false;
    this.userForm.reset();
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  submitForm() {
 
    console.log('Form submitted!');
  }
}
