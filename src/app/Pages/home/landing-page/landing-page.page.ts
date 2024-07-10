import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { SwiperModule } from 'swiper/types';
import { Swiper } from 'swiper';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import 'swiper/css';
import { AuthService } from 'src/app/services/auth.service';
import { APIService } from 'src/app/services/apis.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

export interface Advertisement {
  imageUrl: string;
  link: string;
  advertId: number;
  description: string;
  isActive?: boolean;
}
interface AdvertResponse {
  Value: {
    Status: string;
    Message: string;
    DetailDescription: {
      DocAdverts: {
        Id: number;
        URL: string; // Assuming URL is the property name for the advertisement link
      }[];
    };
  };
}

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.page.html',
  styleUrls: ['./landing-page.page.scss'],
})
export class LandingPage implements OnInit {
  @ViewChild('swiper', { static: true }) swiperElement?: ElementRef;
  swiper?: Swiper;
  advertisements: Advertisement[] = [];
  currentAdvertisementIndex: number = 0;
  currentAdvertisement: Advertisement | null = null;

  swiperConfig: any;
  browser: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: APIService,
    private sanitizer: DomSanitizer,
    private toastController: ToastController,
    private iab: InAppBrowser
  ) {}

  ionViewWillEnter() {
    this.UpdateSubscriptionStatus();
  }

  ngOnInit() {

    // Load all advertisements
    this.loadAllAdvertisements();
  
    // Call rotateAdvertisements immediately after loading advertisements
    this.rotateAdvertisements();
  
    // Set interval to rotate the advertisements every 10 seconds
    setInterval(() => {
      this.rotateAdvertisements();
    }, 6000);

  }

  addAdvertClick(body: any) {
    console.log('Success:', body);
    this.apiService.PostInsertAdvertClick(body).subscribe(
      (data: any) => {
        console.log('Success:', data);
      },
      (err) => {
        console.log('Error:', err);
      }
    );
  }
  
  rotateAdvertisements() {
       // It checks if there are advertisements available 
    if (this.advertisements.length > 0)
     {
      // if so, it updates the currentAdvertisement to the next advertisement in the array
      this.currentAdvertisementIndex = (this.currentAdvertisementIndex + 1) % this.advertisements.length;
      // is used to keep track of which advertisement is currently being displayed.
      this.currentAdvertisement = this.advertisements[this.currentAdvertisementIndex];
    }
    if (this.currentAdvertisement) {
    }

  }

  get isLoggedIn(): boolean {
    return this.authService.getIsLoggedIn();
  }

  get isFreeSubscription(): boolean {
    return this.authService.getIsFreeSubscription();
  }

  UpdateSubscriptionStatus(){

    var user: any = this.authService.getCurrentUser();
    const userLoginDetails = JSON.parse(user);

    if(this.isLoggedIn){

        this.apiService.GetActiveSubscriptionByUserProfileId(userLoginDetails?.userprofileid).subscribe(
        (data: any) => {
          
          if(data.length > 0) {
            this.authService.setSubscriptionStatus(data[0].package_name);
          } else {
            this.authService.setSubscriptionStatus('');
          }

        },
        (err) => {
          console.log('postSub err: ', err);
        }
      );

    } 
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

  forecastPage() {
    this.router.navigate(['/forecast']);
  }

  InternationalPage() {
    this.router.navigate(['/international']);
  }

  aerosportPage() {
    if (this.isLoggedIn && !this.isFreeSubscription ) {
      this.router.navigate(['/aero-sport']);
    } else if (this.isLoggedIn && this.isFreeSubscription) {
      this.presentToast('top','Subscription is required to access Service!', 'danger', 'close');
    } else {      
      this.authService.setRedirectUrl('/aero-sport');
      this.router.navigate(['/login']);
    }
  }

  observPage() {
    this.router.navigate(['/observation']);
  }

  FlightBriefing() {

    if (this.isLoggedIn && !this.isFreeSubscription) {
      this.router.navigate(['/flight-briefing']);
    } else if (this.isLoggedIn && this.isFreeSubscription) {
      this.presentToast('top','Subscription is required to access Service!', 'danger', 'close');
    } else {
      this.authService.setRedirectUrl('/flight-briefing');
      this.router.navigate(['/login']);
    }
  }

  domesticPage() {
    if (this.isLoggedIn && !this.isFreeSubscription) {
      this.router.navigate(['/domestic']);
    } else if (this.isLoggedIn && this.isFreeSubscription) {
      this.presentToast('top','Subscription is required to access Service!', 'danger', 'close');
    } else {
      this.authService.setRedirectUrl('/domestic');
      this.router.navigate(['/login']);
    }
    
  }

  goBack() {
    if (this.swiper) {
      this.swiper.slidePrev();
    }
  }

  goNext() {
    if (this.swiper) {
      this.swiper.slideNext();
    }
  }

  // This method fetches all advertisements 
  loadAllAdvertisements() {
    // Make an HTTP request to fetch advertisements.
    this.apiService.getAllAdverts().subscribe(
      (data: any[]) => {
        this.advertisements = data.map(ad => {
          // Prevent security vulnerabilities, create a safe URL for the image.
          const imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(ad.file_url);
          // Ensure the URL is valid and does not start with "http://localhost"
          const advertUrl = this.ensureValidURL(ad.advert_url);

          const advertId = ad.advertId;

          return { imageUrl, link: advertUrl, advertId } as Advertisement;
        });

        // Set the currentAdvertisement to the first advertisement in the array
        if (this.advertisements.length > 0) {
          this.currentAdvertisement = this.advertisements[0];
        }

        // Initialize Swiper after loading advertisements
        this.initializeSwiper();
      },
      (error: any) => {
        console.error('Error fetching all advertisements:', error);
      }
    );
  }

  // Ensure URL is valid
  ensureValidURL(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    return url;
  }

  // Launch advertisement link
  launchAdvertLink(advertUrl: string, advertId: number) {
    // window.open(advertUrl, "_blank");
    this.openInAppBrowser(advertUrl);

    const body = {
      advertClickId: 0,
      advertId: advertId
    }

    this.addAdvertClick(body)

  }

  initializeSwiper() {
    if (this.advertisements.length > 0 && this.swiperElement) {
      this.swiper = new Swiper(this.swiperElement.nativeElement, {
        direction: 'vertical',
        loop: true, // Enable looping to seamlessly rotate banners
        autoplay: {
          delay: 10000, // Set autoplay delay to 10 seconds
          disableOnInteraction: false,
        },
        navigation: false,
        allowTouchMove: true, // Allow users to swipe if needed
      });
    } 
  }

}