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

  // selectedPaymentType: string | undefined ;
  selectedPaymentType: string = 'monthly';
  subscriptionType: string = '';
  freeSubscriptionAmount: number = 0;
  premiumSubscriptionAmount: number = 180;
  regulatedSubscriptionAmount: number = 380;

  freeSubscriptionId: number = 1;
  premiumSubscriptionId: number = 2;
  regulatedSubscriptionId: number = 3;

  // selectedService: string | null = null;
  selectedFreeService: string | null = null;
  selectedPremiumService: string | null = null;
  selectedRegulatedService: string | null = null;

  token: string = '';

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
    subscription_token: '',
    subscription_status: 'Active',
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

    //   // If the user is logged in
    if (this.subscriptionId) {
      // Check if a subscription package ID is set
      // if (this.selectedSubscriptionPackageId !== undefined) {
      // Call the subscribe method if a subscription package ID is set
      // if (this.subscriptionId == 1) {
      //   this.subscribe(180, this.subscriptionId);
      // } else if (this.subscriptionId == 2) {
      //   this.subscribe(380, this.subscriptionId, 'Regulated');
      // }

      // this.subscribe(380, this.subscriptionId);
      this.subscribe(this.premiumSubscriptionAmount, this.subscriptionId);

    }
  }

  ngOnInit() {
    // this.route.queryParams.subscribe((params) => {
    //   this.subscriptionId = params['id'];
    // });

    // if (this.subscriptionId) {
    //   this.subscribe(this.premiumSubscriptionAmount, this.subscriptionId);
    // }

    const currentUrl = window.location.href;
    console.log(currentUrl);
    var landingPage = currentUrl.substr(0, currentUrl.lastIndexOf('/') + 1);
    console.log(landingPage + 'subscription-Successful');
    this.subsObj.returnUrl = landingPage + 'subscription-successful';
    // this.subsObj.returnUrl = landingPage + 'subscription-package';
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

    console.log('this.browser', this.browser)

    //this.browser.addEventListener('loadstart', this.loadStartCallBack);

    let isFirstCall = true;

    this.browser.on('loadstart').subscribe((event: any) => {


      console.log('loadstart - event', event)
      // this.token = event.url;

      // console.log('this.token', this.token)

      if (isFirstCall) {
        this.token = event.url.split('/').pop() || '';
        console.log('this.token', this.token);
        isFirstCall = false;
      }

      this.loadStartCallBack(event);
    });
  }

  loadStartCallBack(event: any) {
    /* Close InAppBrowser if loading the predefined close URL */

    console.log('event', event)

    if (event.url == this.subsObj.returnUrl) {
      debugger;
      
      this.browser.close();
      this.saveSub();
    } else if (event.url == this.subsObj.cancelUrl) {
      this.browser.close();
    }
  }

  subscribe(amount: number, subscriptionId: number) {
      
    var user: any = this.authService.getCurrentUser();
    const userLoginDetails = JSON.parse(user);

    if ((subscriptionId == 2 || subscriptionId == 5)) {
      this.subscriptionType = 'Premium';
    } else if ((subscriptionId == 3 || subscriptionId == 6)) {
      this.subscriptionType = 'Regulated';
    } else {
      this.subscriptionType = 'Free';
    }

    debugger;

    // Transaction details
    this.subsObj.m_payment_id = subscriptionId.toString();
    this.subsObj.amount = Number(amount.toFixed(2));
    this.subsObj.item_name = this.subscriptionType;
    this.subsObj.item_description = this.subscriptionType; 
    // Customer details
    this.subsObj.name_first = userLoginDetails?.aspUserName;
    this.subsObj.name_last = userLoginDetails?.aspUserName;
    this.subsObj.email_address = userLoginDetails?.aspUserEmail;
    // Transaction options
    this.subsObj.confirmation_email = userLoginDetails?.aspUserEmail;

    // Subscriptions
    // subscription_type
    // billing_date
    // frequency
    // cycles
    this.subsObj.recurring_amount = Number(amount.toFixed(2));

    console.log('subO: ', this.subsObj);
    debugger;

    this.APIService.paySubscription(this.subsObj).subscribe(
      (payRes: any) => {
        console.log('url: ', payRes.url);
        console.log('response-paypal: ', payRes);
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

    var oneYearOrMonthFromNow = new Date();
    // var oneMonthFromNow = new Date();

    var user: any = this.authService.getCurrentUser();
    const userLoginDetails = JSON.parse(user);
    this.updateSub.package_price = this.subsObj.recurring_amount;
    this.updateSub.package_id = Number(this.subsObj.m_payment_id);
    this.updateSub.package_name = this.selectedPaymentType + ' ' + this.subsObj.item_name;
    this.updateSub.subscriptionId = 0;
    this.updateSub.subscription_status = 'Active';
    this.updateSub.subscription_token = this.token;
    this.updateSub.start_date = new Date(Date.now());

    if( this.selectedPaymentType === 'monthly'){

      this.updateSub.end_date = new Date(oneYearOrMonthFromNow.setMonth(
        oneYearOrMonthFromNow.getMonth() + 1
      ));
      this.updateSub.subscription_duration = Number(
        this.daysBtnDates(this.updateSub.start_date, this.updateSub.end_date)
      );

    } else {

      this.updateSub.end_date = new Date(oneYearOrMonthFromNow.setFullYear(
        oneYearOrMonthFromNow.getFullYear() + 1
      ));
      this.updateSub.subscription_duration = Number(
        this.daysBtnDates(this.updateSub.start_date, this.updateSub.end_date)
      );

    }



    this.updateSub.userprofileid = userLoginDetails?.userprofileid;

    debugger;

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

  selectPaymentType(type: string) {
    this.selectedPaymentType = type;

    if( type === 'monthly') {
      this.freeSubscriptionAmount = 0;
      this.premiumSubscriptionAmount = 180;
      this.regulatedSubscriptionAmount = 380;
      this.freeSubscriptionId = 1;
      this.premiumSubscriptionId = 2;
      this.regulatedSubscriptionId = 3;
    } else {
      this.freeSubscriptionAmount = 0;
      this.premiumSubscriptionAmount = 2160;
      this.regulatedSubscriptionAmount = 4560;
      this.freeSubscriptionId = 4;
      this.premiumSubscriptionId = 5;
      this.regulatedSubscriptionId = 6;
    }
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

  selectFreeService(service: string) {
    this.selectedFreeService = service;

    for (let key in this.dropdownVisible) {
        this.dropdownVisible[key] = false;
    }
  }

  selectPremiumService(service: string) {
    this.selectedPremiumService = service;

    for (let key in this.dropdownVisible) {
        this.dropdownVisible[key] = false;
    }
  }

  selectRegulatedService(service: string) {
    this.selectedRegulatedService = service;

    for (let key in this.dropdownVisible) {
        this.dropdownVisible[key] = false;
    }
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

  NavigateToLandingPage() {
    this.router.navigate(['/landing-page']);
  }
}
