import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserLoggedIn } from '../Models/User.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userData: any;
  private redirectUrl: string | null = null;

  constructor(private http: HttpClient) {}

  loginEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  private loginEventSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loginEvent$: Observable<boolean> = this.loginEventSubject.asObservable();

  logout() {
    // Logic for logging out
    this.isLoggedIn = false;
    this.setIsFromSubscription(false);
    this.setSubscriptionStatus('');
    // window.location.reload();
  }
  login(form: any) {
    const body = { UserName: form.username, Password: form.password };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post<any>(
      `${environment.serverAPI}v1/Authenticate/Login`,
      body,
      httpOptions
    );
  }
  private isLoggedIn = false;
  private isFreeSubscription = true;
  private isFromSubscription = false;
  private isToReturnToSub = false;
  private subscriptionPackageIdSubject = new BehaviorSubject<
    number | undefined
  >(undefined);
  subscriptionPackageId$ = this.subscriptionPackageIdSubject.asObservable();

  setSubscriptionPackageId(subscriptionPackageId: number) {
    this.subscriptionPackageIdSubject.next(subscriptionPackageId);
  }

  getIsLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  getIsFromSubscription(): boolean {
    return this.isFromSubscription;
  }

  setIsFromSubscription(status: boolean): void {
    this.isFromSubscription = status;
  }

  getIsToReturnToSub(): boolean {
    return this.isToReturnToSub;
  }

  setIsToReturnToSub(status: boolean): void {
    this.isToReturnToSub = status;
  }

  setLoggedInStatus(status: boolean): void {
    this.isLoggedIn = status;
    this.loginEventSubject.next(status);
  }

  setSubscriptionStatus(status: string): void {
    if(status == '' || status == 'monthly Free' || status == 'annually Free') {
      this.isFreeSubscription = true;
    } else {
      this.isFreeSubscription = false;
    }
  }

  getIsFreeSubscription(): boolean {
    return this.isFreeSubscription;
  }

  setUserData(userData: any) {
    this.userData = userData;
    console.log('TEST::', this.userData);
  }

  getUserData() {
    return this.userData;
  }

  setRedirectUrl(url: string) {
    this.redirectUrl = url;
  }

  getRedirectUrl() {
    return this.redirectUrl;
  }

  saveCurrentUser(user: UserLoggedIn): string {
    sessionStorage.setItem('CurrentUser', JSON.stringify(user));
    // sessionStorage.setItem("token", user.token);
    return 'User Saved';
  }

  getCurrentUser() {
    return sessionStorage.getItem('CurrentUser');
  }
}
