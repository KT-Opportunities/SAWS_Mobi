import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastController } from '@ionic/angular';
import { APIService } from 'src/app/services/apis.service';
import { Keyboard } from '@capacitor/keyboard';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  private mobileQuery: MediaQueryList;
  isMobile: boolean;
  notLogged = false;
  isLogged = false;
  submitted = false;
  username: string | null = null;
  password: string | null = null;
  userData: any = null;
  showPassword: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  loading = false;
  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  isKeyboardVisible = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private mediaMatcher: MediaMatcher,
    private authAPI: AuthService,
    private apiService: APIService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private renderer: Renderer2,
    private toastController: ToastController,
    private platform: Platform
  ) {
    this.mobileQuery = this.mediaMatcher.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => (this.isMobile = this.mobileQuery.matches);
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
    this.isMobile = this.mobileQuery.matches;

    Keyboard.addListener('keyboardWillShow', () => {
      this.isKeyboardVisible = true;
    });

    Keyboard.addListener('keyboardWillHide', () => {
      this.isKeyboardVisible = false;
    });
  }

  ionViewDidLeave() {

    const redirectUrl: string | null =this.authAPI.getRedirectUrl();
    
    if (this.userData != null) {
      this.UpdateSubscription(this.userData!.userprofileid);

      if (!this.authAPI.getIsFreeSubscription() && redirectUrl) {
          this.router.navigateByUrl(redirectUrl);
      } else if (this.authAPI.getIsFromSubscription() && redirectUrl) {
        this.router.navigateByUrl(redirectUrl);
      } else if (redirectUrl == '/landing-page') {
        this.router.navigateByUrl(redirectUrl);
      }  else if (this.authAPI.getIsFreeSubscription() && redirectUrl){
        this.presentToastSub('top','Subscription is required to access Service!', 'danger', 'close');
      }

    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const subscriptionPackageId = params['id'];
      if (subscriptionPackageId) {
        this.loginForm.patchValue({
          subscriptionPackageId: subscriptionPackageId,
        });
      }
    });

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

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);

    Keyboard.removeAllListeners();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    const passwordField = document.getElementById('field') as HTMLInputElement;
    passwordField.type = this.showPassword ? 'text' : 'password';
  }

  private mobileQueryListener: () => void;

  isLoginPage() {
    return this.router.url === '/login';
  }

  register() {
    this.router.navigate(['/register']);
  }

  forgortPassword() {
    this.router.navigate(['/forgot-password']);
  }

  home() {
    this.router.navigate(['/landing-page']);
    this.authAPI.setIsFromSubscription(false);
    this.authAPI.setSubscriptionStatus('');
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = null; // Clear previous error messages
    if (this.loginForm.valid) {
      this.loading = true;
      this.spinner.show();
      this.authAPI
        .login(this.loginForm.value)
        .subscribe(
          (response) => {
            if (response.rolesList == 'Subscriber') {
              this.userData = response;
              this.authAPI.setLoggedInStatus(true);
              this.authAPI.setUserData(this.userData);
              this.authAPI.saveCurrentUser(response);
              this.UpdateSubscription(response.userprofileid);

              const redirectUrl = this.authAPI.getRedirectUrl();

              console.log("redirectUrl:", redirectUrl)

              if (redirectUrl) {
                this.router.navigateByUrl('/landing-page');
              } else if (this.authAPI.getIsFromSubscription() && redirectUrl) {
                this.router.navigateByUrl(redirectUrl);
              } else {
                this.router.navigate(['/landing-page']);
                this.presentToast('top','Login Successful!', 'success', 'checkmark');
              }

              this.loginForm.reset();

            } else {
              // this.errorMessage = 'Only subscribers can login';
              this.presentToast('top','Only subscribers can login!', 'danger', 'close');
              // this.router.navigate(['login']);
            }
          },
          (error) => {
            if (error.statusText == 'Unauthorized') {
              // this.errorMessage = 'Invalid username or password';
              this.presentToast('top','Invalid username or password!', 'danger', 'close');
            } else {
              // this.errorMessage = 'An error occurred. Please try again.';
              this.presentToast('top','An error occurred. Please try again!', 'danger', 'close');
            }
            this.notLogged = true;
            this.loading = false;
          }
        )
        .add(() => {
          this.loading = false;
          this.spinner.hide();
        });
    }
  }

  UpdateSubscription(userId: number){
    this.apiService.GetActiveSubscriptionByUserProfileId(userId).subscribe(
      (data: any) => {
        
        if(data.length > 0) {
          this.authAPI.setSubscriptionStatus(data[0].package_name);
        } else {
          this.authAPI.setSubscriptionStatus('');
        }

      },
      (err) => {
        console.log('postSub err: ', err);
      }
    );
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', message: string, color: string, icon: string) {

    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
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

  async presentToastSub(position: 'top' | 'middle' | 'bottom', message: string, color: string, icon: string) {

    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: position,
      color: color,
      icon: icon,
      cssClass:"custom-toast",
      swipeGesture: "vertical",
      buttons: [
        {
          side: 'end',
          text: 'Go to Subscription',
          handler: () => {
            this.router.navigate(['/subscription-package']);
          }
        }
      ]
    });

    await toast.present();
  }
}
