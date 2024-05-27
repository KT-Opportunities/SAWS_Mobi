import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { APIService } from 'src/app/services/apis.service';
import { take, filter } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-subscription-package',
  templateUrl: './subscription-package.page.html',
  styleUrls: ['./subscription-package.page.scss'],
})
export class SubscriptionPackagePage implements OnInit {
  selectedSubscriptionPackageId: number | undefined;
  showAnnuallySection: boolean = false;
  showMonthlySection: boolean = true;
  isSubscriber: boolean = true;
  subscriptionId: number | undefined;
  dropdownVisible: { [key: string]: boolean } = {
    paymentType: false,
    freeSubscription: false,
    premiumSubscription: false,
    regulatedSubscription: false,
  };
  selectedPaymentType: string | undefined;

  subsObj: any = {
    returnUrl: '',
    cancelUrl: '',
    notifyUrl: '',
    name_first: 'test_User',
    name_last: 'test',
    email_address: 'raymond.mortu@gmail.com',
    m_payment_id: 'SAW_test_1',
    item_name: 'SAW Recurring subscription',
    item_description: 'Premium',
    email_confirmation: true,
    confirmation_email: 'raymond.mortu@gmail.com',
    amount: 500.0,
    recurring_amount: 500.0,
    frequency: 'annual',
  };

  browser: any;

  updateSub: any = {
    subscriptionId: '',
    userprofileid: 0,
    package_name: '',
    package_id: 0,
    package_price: 0,
    start_date: Date.now(),
    end_date: Date.now(),
    subscription_duration: 0,
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private iab: InAppBrowser,
    private APIService: APIService,
    private route: ActivatedRoute,
    private api: APIService,
    public plat: Platform
  ) {}

  ionViewWillEnter() {
    this.route.queryParams.subscribe((params) => {
      this.subscriptionId = params['id'];
      // Optionally, you can perform any actions based on the subscription package ID here
    });

    debugger;
    // this.authService.loginEvent.subscribe((loggedIn: boolean) => {
    //   // If the user is logged in
    if (this.subscriptionId) {
      // Check if a subscription package ID is set
      // if (this.selectedSubscriptionPackageId !== undefined) {
      // Call the subscribe method if a subscription package ID is set
      if (this.subscriptionId == 1) {
        this.subscribe(180, this.subscriptionId);
      } else if (this.subscriptionId == 2) {
        this.subscribe(380, this.subscriptionId, 'Regulated');
      }

      // this.subscribe(this.amount!, this.selectedSubscriptionPackageId);
      // }
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.subscriptionId = params['id'];
      // Optionally, you can perform any actions based on the subscription package ID here
    });

    debugger;
    // this.authService.loginEvent.subscribe((loggedIn: boolean) => {
    //   // If the user is logged in
    if (this.subscriptionId) {
      // Check if a subscription package ID is set
      // if (this.selectedSubscriptionPackageId !== undefined) {
      // Call the subscribe method if a subscription package ID is set
      if (this.subscriptionId == 1) {
        this.subscribe(180, this.subscriptionId);
      } else if (this.subscriptionId == 2) {
        this.subscribe(380, this.subscriptionId, 'Regulated');
      }

      // this.subscribe(this.amount!, this.selectedSubscriptionPackageId);
      // }
    }
    // });
    this.selectedPaymentType = 'monthly';

    const currentUrl = window.location.href;
    console.log(currentUrl);
    var landingPage = currentUrl.substr(0, currentUrl.lastIndexOf('/') + 1);
    console.log(landingPage + 'subscription-Successful');
    this.subsObj.returnUrl = landingPage + 'subscription-Successful';
    this.subsObj.cancelUrl = landingPage + 'subscription-package';
  }

  openInAppBrowser(url: string) {
    this.browser = this.iab.create(url, '_blank', {
      location: 'no',
      hidden: 'no',
      hardwareback: 'yes',
      zoom: 'no',
      //hideurlbar: 'yes',
    });

    //this.browser.addEventListener('loadstart', this.loadStartCallBack);

    this.browser.on('loadstart').subscribe((event: any) => {
      this.loadStartCallBack(event);
    });
  }

  loadStartCallBack(event: any) {
    /* Close InAppBrowser if loading the predefined close URL */
    if (event.url == this.subsObj.returnUrl) {
      debugger;
      this.browser.close();
      this.saveSub();
    } else if (event.url == this.subsObj.cancelUrl) {
      this.browser.close();
    }
  }

  subscribe(amount: number, subscriptionId: number, subscriptionType?: string) {
    var user: any = this.authService.getCurrentUser();
    const userLoginDetails = JSON.parse(user);

    if ((subscriptionId = 1)) {
      subscriptionType = 'Premium';
    } else if ((subscriptionId = 2)) {
      subscriptionType = 'Regulated';
    }

    this.subsObj.amount = Number(amount.toFixed(2));
    this.subsObj.recurring_amount = Number(amount.toFixed(2));
    this.subsObj.name_first = userLoginDetails?.aspUserName;
    this.subsObj.name_last = userLoginDetails?.aspUserName;
    this.subsObj.email_address = userLoginDetails?.aspUserEmail;
    this.subsObj.confirmation_email = userLoginDetails?.aspUserEmail;
    this.subsObj.m_payment_id = subscriptionId.toString();
    this.subsObj.item_name = subscriptionType;
    this.subsObj.item_description = subscriptionType;

    console.log('subO: ', this.subsObj);
    debugger;

    this.APIService.paySubscription(this.subsObj).subscribe(
      (payRes: any) => {
        console.log('url: ', payRes.url);
        this.openInAppBrowser(payRes.url);
      },
      (err) => {
        console.log('error: ', err);
      }
    );
  }

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }
  provideFeedback(subscriptionPackageId: number, amount?: number) {
    if (!this.authService.getIsLoggedIn()) {
      const redirectUrl = `/subscription-package?id=${subscriptionPackageId}`;
      this.authService.setRedirectUrl(redirectUrl);
      this.authService.setIsFromSubscription(true);
      this.router.navigate(['/login'], { queryParams: { redirectUrl } });

      // Create a promise that resolves when the user logs in
      const loginPromise = new Promise<void>((resolve, reject) => {
        const subscription = this.authService.loginEvent.subscribe({
          next: (loggedIn: boolean) => {
            if (loggedIn) {
              console.log('Login status changed:', loggedIn);
              // Once logged in, resolve the promise
              resolve();
              // Clean up subscription
              subscription.unsubscribe();
            }
          },
          error: (error: any) => {
            console.error(
              'Error occurred during login event subscription:',
              error
            );
            // Reject the promise if an error occurs
            reject(error);
          },
        });
      });

      // Once the user logs in, proceed with subscription
      loginPromise
        .then(() => {
          this.selectedSubscriptionPackageId = subscriptionPackageId;
          this.subscribe(amount!, subscriptionPackageId);
        })
        .catch((error) => {
          // Handle error appropriately
        });
    } else {
      // If already logged in, directly set the selectedSubscriptionPackageId
      this.selectedSubscriptionPackageId = subscriptionPackageId;
      // Proceed with subscription
      this.subscribe(amount!, subscriptionPackageId);
    }
  }

  saveSub() {
    var oneYearFromNow = new Date();

    debugger;
    var user: any = this.authService.getCurrentUser();
    const userLoginDetails = JSON.parse(user);
    this.updateSub.package_price = this.subsObj.recurring_amount;
    this.updateSub.package_id = Number(this.subsObj.m_payment_id);
    this.updateSub.package_name =
      this.selectedPaymentType + ' ' + this.subsObj.item_name;
    this.updateSub.subscriptionId = 0;
    this.updateSub.start_date = new Date(Date.now());
    this.updateSub.end_date = new Date(oneYearFromNow.setFullYear(
      oneYearFromNow.getFullYear() + 1
    ));
    this.updateSub.subscription_duration = Number(
      this.daysBtnDates(this.updateSub.start_date, this.updateSub.end_date)
    );
    this.updateSub.userprofileid = userLoginDetails?.aspUserID;
   //this.updateSub.userprofileid = 119;

    console.log('updateSub', this.updateSub);
    debugger;
    this.APIService.PostInsertSubscription(this.updateSub).subscribe(
      (data: any) => {
        console.log('postSub: ', data);
        this.router.navigate(['/landing-page']);
      },
      (err) => {
        console.log('postSub err: ', err);
      }
    );
  }

  displayIcon(): boolean {
    return this.isSubscriber; // Return true if the user is a subscriber, false otherwise
  }

  toggleDropdown(dropdownName: string) {
    // Close all dropdowns
    for (let key in this.dropdownVisible) {
      if (key !== dropdownName) {
        this.dropdownVisible[key] = false;
      }
    }

    // Toggle the specified dropdown
    this.dropdownVisible[dropdownName] = !this.dropdownVisible[dropdownName];
  }

  forecastPage() {
    this.router.navigate(['/landing-page']);
  }
  forecastPage2() {
    this.router.navigate(['/alnding-page']);
  }
  monthlypage() {
    this.selectedPaymentType = 'monthly'; // Update selected payment type
    this.router.navigate([
      '/subscription-package/payment-type',
      { paymentType: 'monthly' },
    ]);
  }

  annualypage() {
    this.selectedPaymentType = ''; // Update selected payment type
    this.router.navigate([
      '/subscription-package/payment-type',
      { paymentType: 'annually' },
    ]);
  }

  // private navigateToPaymentTypePage() {

  //   this.router.navigate(['/subscription-package/payment-type', { paymentType: this.selectedPaymentType }]);
  // }

  toggleMonthlySection() {
    console.log('toggleMonthlySection() called');
    // this.showMonthlySection = true;
    // this.showAnnuallySection = false;
  }

  GoToInternational() {
    this.router.navigate(['/international']);
  }
  GoToForecast() {
    this.router.navigate(['/forecast']);
  }
  GoTODomestic() {
    this.router.navigate(['/domestic']);
  }
  GoTOFlieghtBrief() {
    this.router.navigate(['/flight-briefing']);
  }
  GoToObservation() {
    this.router.navigate(['/observation']);
  }

  daysBtnDates(date1: any, date2: any) {
    let Difference_In_Time =
      new Date(date2).getTime() - new Date(date1).getTime();

    // Calculating the no. of days between
    // two dates
    let Difference_In_Days = Math.round(
      Difference_In_Time / (1000 * 3600 * 24)
    );

    return Difference_In_Days;
  }
}
