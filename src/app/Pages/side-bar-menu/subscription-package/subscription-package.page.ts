import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { APIService } from 'src/app/services/apis.service';
import { take, filter } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ActionSheetController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-subscription-package',
  templateUrl: './subscription-package.page.html',
  styleUrls: ['./subscription-package.page.scss'],
})
export class SubscriptionPackagePage implements OnInit {
  selectedSubscriptionPackageId: number | undefined;
  selectedSubscriptionPackageAmount: number | undefined;
  cancelSubscriptionId: number | undefined;
  showAnnuallySection: boolean = false;
  showMonthlySection: boolean = true;
  isSubscriber: boolean = true;

  isSubscriptionSwitch: boolean = false;

  isSubscribedPremiumMonthly: boolean = false;
  isSubscribedPremiumAnnually: boolean = false;
  isSubscriberRegulatedMonthly: boolean = false;
  isSubscriberRegulatedAnnually: boolean = false;

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

  premiumMontlySubscribedId: number = 0;
  premiumAnnuallySubscribedId: number = 0;
  regulateMonthlydSubscribedId: number = 0;
  regulateAnnuallydSubscribedId: number = 0;

  // selectedService: string | null = null;
  selectedFreeService: string | null = null;
  selectedPremiumService: string | null = null;
  selectedRegulatedService: string | null = null;

  token: string = '';
  subsArray: any = [];
  filteredSubscriptions: any = [];
  actionSheetSubHeader: string = '';

  subsObj: any = {
    returnUrl: '',
    cancelUrl: '',
    notifyUrl: '',
    name_first: 'test_User',
    name_last: 'test',
    userId: 0,
    email_address: 'raymond.mortu@gmail.com',
    m_payment_id: 'SAW_test_1',
    item_name: 'SAW Recurring subscription',
    item_description: 'Premium',
    email_confirmation: true,
    confirmation_email: 'raymond.mortu@gmail.com',
    amount: 500.0,
    recurring_amount: 500.0,
    frequency: 'annual',
    package_id: 0,
    subscription_amount: 500.00,
    package_name: 'monthly Premium',
    subscription_type: 'monthly'
  };

  public actionSheetButtonsCancel = [
    {
      text: 'UnSubscribe',
      role: 'destructive',
      icon: 'trash-outline',
      data: {
        action: 'delete',
      },
      handler: () => {
        this.handleAction('delete');
      }
    },
    {
      text: 'Cancel',
      role: 'cancel',
      icon: 'close',
      data: {
        action: 'cancel',
      },
      handler: () => {
        this.handleAction('cancel');
      }
    },
  ];

  public actionSheetButtonsCancelFreeSub = [
    {
      text: 'Cancel',
      role: 'cancel',
      icon: 'close',
      data: {
        action: 'cancel',
      },
      handler: () => {
        this.handleAction('cancel');
      }
    }
  ];

  public actionSheetButtonsSwitch = [
    {
      text: 'Change Subscription',
      icon: 'sync',
      data: {
        action: 'subscribe',
      },
      handler: () => {
        this.handleAction('subscribe');
      }
    },
    {
      text: 'Cancel',
      role: 'cancel',
      icon: 'close',
      data: {
        action: 'cancel',
      },
      handler: () => {
        this.handleAction('cancel');
      }
    },
  ];

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
    public plat: Platform,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController
  ) {}

  ionViewWillEnter() {
    this.route.queryParams.subscribe((params) => {
      this.subscriptionId = params['id'];
      // Optionally, you can perform any actions based on the subscription package ID here
    });

    //   // If the user is logged in
    if (this.subscriptionId) {
     // this.subscribe(this.premiumSubscriptionAmount, this.subscriptionId);
      this.CheckSubscriptionStatus(this.subscriptionId, this.selectedSubscriptionPackageAmount);
    }
  }

  ngOnInit() {

    if (this.authService.getIsLoggedIn()) {
      this.GetSubscriptions();
    }

    const currentUrl = window.location.href;
    console.log(currentUrl);
    var landingPage = currentUrl.substr(0, currentUrl.lastIndexOf('/') + 1);
    console.log(landingPage + 'subscription-Successful');
    this.subsObj.returnUrl = landingPage + 'subscription-successful';
    // this.subsObj.notifyUrl = landingPage + 'subscription-successful/:token';
    // this.subsObj.notifyUrl = 'http://160.119.253.130/saws/#/subscription/success';
    this.subsObj.notifyUrl =  environment.serverAPI + 'v1/Subscriber/Notify';
    this.subsObj.cancelUrl = landingPage + 'subscription-package';
  }

  GetSubscriptions(){
    var user: any = this.authService.getCurrentUser();
    const userLoginDetails = JSON.parse(user);

    this.APIService.GetSubscriptionByUserProfileId(userLoginDetails?.userprofileid).subscribe(
      (response: any) => {      
        
        this.subsArray = response;

        console.log("GetSubscriptions", response);
        
        response.forEach((element: any) => {

          if (element.package_id == 2) {
            this.isSubscribedPremiumMonthly = true;
            this.premiumMontlySubscribedId = element.subscriptionId;
          } else if (element.package_id == 3) {
            this.isSubscriberRegulatedMonthly = true;
            this.regulateMonthlydSubscribedId = element.subscriptionId;
          } else if (element.package_id == 5) {
            this.isSubscribedPremiumAnnually = true;
            this.premiumAnnuallySubscribedId = element.subscriptionId;
          } else {
            this.isSubscriberRegulatedAnnually = true;
            this.regulateAnnuallydSubscribedId = element.subscriptionId;
          }

        });
      
      },
      (err) => {
        console.log('error: ', err);
      }
    );
  }

  CheckSubscriptionStatus(subscriptionPackageId: number, amount?: number){
    var user: any = this.authService.getCurrentUser();
    const userLoginDetails = JSON.parse(user);

    this.APIService.GetSubscriptionByUserProfileId(userLoginDetails?.userprofileid).subscribe(
      (response: any) => {    
   
        // Initialize a flag to check if the subscriptionPackageId exists
        let packageExists = false;
        
        response.forEach((element: any) => {
          if (element.package_id == subscriptionPackageId) {
            packageExists = true;
          }
        });
    
        if(packageExists){

          this.presentToast('top','You have already subscribed to this package!', 'danger', 'close');
          this.router.navigate(['/subscription-package']);
          this.GetSubscriptions();

        } else if (response.length >= 1 && !packageExists) {

          this.presentActionSheetSwitch();
          this.GetSubscriptions();
          this.selectedSubscriptionPackageId = subscriptionPackageId;

        } else {

          this.subscribe(amount!, subscriptionPackageId);

        }
      },
      (err) => {
        console.log('error: ', err);
      }
    );
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

      if (isFirstCall) {
        this.token = event.url.split('/').pop() || '';
        console.log('this.token', this.token);
        isFirstCall = false;
      }

      this.loadStartCallBack(event);
    });

    this.browser.on('loadstop').subscribe((event: any) => {
      this.loadStopCallBack(event);
      
      // Extract the token from the URL
      const urlParams = new URLSearchParams(event.url);
      const token = urlParams.get('token'); // Adjust the key based on the actual parameter name
  
      if (token) {
        // this.token = token;
        console.log('Token on success:', token);
  
        // Handle the token
        // this.handleToken(this.token);
  
        // Close the browser after extracting the token
        this.browser.close();
      }
    });

    this.browser.on('exit').subscribe((event: any) => {
      
      console.log('loadexit - event', event)
      
      console.log('exit browswer activated')
      this.browser.close();
    });
  }

  loadStartCallBack(event: any) {
    /* Close InAppBrowser if loading the predefined close URL */

    console.log('loadstart- event', event)
        
    if (event.url == this.subsObj.returnUrl) {
      debugger;  
      this.browser.close();
      // this.saveSub();
    }

    // } else if (event.url == this.subsObj.notifyUrl) {
    //   console.log('notified user', event)
    // }
    // else if (event.url == this.subsObj.cancelUrl) {
    //   this.browser.close();
    // }
  }

  loadStopCallBack(event: any) {
    console.log('loadstop - event', event);
    // Implement any logic needed when the browser has stopped loading
    // For example, check if a certain condition is met or perform additional actions
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
    this.subsObj.userId = userLoginDetails?.userprofileid;
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
    this.subsObj.subscription_amount = Number(amount.toFixed(2));
    this.subsObj.package_id = subscriptionId;
    this.subsObj.package_name = this.selectedPaymentType + ' ' + this.subscriptionType ;
    this.subsObj.subscription_type = this.subscriptionType;

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

      this.selectedSubscriptionPackageAmount = amount;

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
          
        })
        .catch((error) => {
          // Handle error appropriately
        });
    } else {
      // If already logged in, directly set the selectedSubscriptionPackageId
      this.selectedSubscriptionPackageId = subscriptionPackageId;
      this.selectedSubscriptionPackageAmount = amount;

      // Implement a check for existing one
      this.CheckSubscriptionStatus(subscriptionPackageId, amount!);
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

        if (this.isSubscriptionSwitch){
          this.updateSwitchedSub();
        } else {
          this.presentToast('top','Subscription Added!', 'success', 'checkmark');
          this.GetSubscriptions();
        }

      },
      (err) => {
        console.log('postSub err: ', err);
      }
    );
  }

  CancelSubscription(subscriptionId: number){

    // this.APIService.CancelSubscriptionByUserProfileId(subscriptionId).subscribe(
    //   (data: any) => {
    //     console.log('cancelData: ', data);
    //     // this.router.navigate(['/landing-page']);

    //     // if (this.isSubscriptionSwitch){
    //     //   this.updateSwitchedSub();
    //     // } else {
    //     //   this.presentToast('top','Subscription Added!', 'success', 'checkmark');
    //     //   this.GetSubscriptions();
    //     // }

    //   },
    //   (err) => {
    //     console.log('postSub err: ', err);
    //   }
    // );
    
    // this.filteredSubscriptions = this.filterSubscriptionsById(subscriptionId);
    // this.filteredSubscriptions[0].subscription_status = 'Cancelled';
    
    this.cancelSubscriptionId = subscriptionId;
  
    this.presentActionSheetCancel();

  }

  CancelFreeSubscription(){

    this.presentActionSheetCancelFreeSub();

  }
  
  cancelSub() {

    var user: any = this.authService.getCurrentUser();
    const userLoginDetails = JSON.parse(user);

    this.APIService.CancelSubscription(this.cancelSubscriptionId!, userLoginDetails?.userprofileid).subscribe(
      (data: any) => {
        console.log('cancelSub: ', data);
        // this.router.navigate(['/landing-page']);

        this.presentToast('top','Subscription Cancelled!', 'success', 'checkmark')
        this.GetSubscriptions();
      },
      (err) => {
        console.log('cancelSub err: ', err);
      }
    );
    
  }

  switchSub() {

    this.isSubscriptionSwitch = true;
    this.subscribe(this.selectedSubscriptionPackageAmount!, this.selectedSubscriptionPackageId!);
    
  }

  updateSwitchedSub() {

    this.subsArray[0].subscription_status = 'Cancelled';

    this.isSubscriptionSwitch = false;

    this.APIService.PostInsertSubscription(this.subsArray[0]).subscribe(
      (data: any) => {
        console.log('updateSub: ', data);
        this.router.navigate(['/landing-page']);

        this.presentToast('top','Subscription Changed!', 'success', 'sync')
        this.GetSubscriptions();
      },
      (err) => {
        console.log('updateSub err: ', err);
      }
    );
    
  }

  filterSubscriptionsById(subscriptionId: number) {

    return this.subsArray.filter((subscription: any) => subscription.subscriptionId === subscriptionId);

  }

  async presentActionSheetCancel() {

    const actionSheet = await this.actionSheetController.create({
      header: 'Cancel Subscription!',
      subHeader: `Are you sure you want to UnSubscribe from the selected subscription?`,
      buttons: this.actionSheetButtonsCancel,
      cssClass: 'my-custom-class'
    });
    await actionSheet.present();

  }

  async presentActionSheetCancelFreeSub() {

    const actionSheet = await this.actionSheetController.create({
      header: 'Cancel Subscription!',
      subHeader: `This is a free subscriptions and cannot be unsubribed!`,
      buttons: this.actionSheetButtonsCancelFreeSub,
      cssClass: 'my-custom-class'
    });
    await actionSheet.present();

  }

  async presentActionSheetSwitch() {

    const actionSheet = await this.actionSheetController.create({
      header: 'Another Subscription Exists!',
      subHeader: `Are you sure you want to change the Subscription?`,
      buttons: this.actionSheetButtonsSwitch,
      cssClass: 'my-custom-class'
    });
    await actionSheet.present();

  }

  async presentToast(position: 'top' | 'middle' | 'bottom', message: string, color: string, icon: string) {

    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      position: position,
      color: color,
      icon: icon,
      cssClass:"custom-toast",
      swipeGesture: "vertical"
    });

    await toast.present();

  }

  handleAction(action: string) {

    switch(action) {
      case 'delete':
        this.cancelSub();
        console.log('Delete action triggered');
        break;
      case 'cancel':
        console.log('Cancel action triggered');
        break;
      case 'subscribe':
          this.switchSub();
          console.log('Subscribe action triggered');
          break;
      default:
        console.log('Unknown action');
    }

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
