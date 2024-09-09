import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, catchError, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  User: any;
  token: any;
  private feedbackSubject = new BehaviorSubject<any | null>(null);
  public feedbackObservable$ = this.feedbackSubject.asObservable();

  constructor(private http: HttpClient) {
    var stringUser = sessionStorage.getItem('User');
    if (stringUser) {
      this.User = JSON.parse(stringUser);
      this.token = this.User.DetailDescription.token;
    }
  }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }),
  };

  createNewUser(body: {}) {
    return this.http.post<any>(
      environment.serverAPI + 'v1/Authenticate/RegisterSubscriber',
      body
    );
  }

  setFeedbackData(data: any): void {
    this.feedbackSubject.next(data);
  }

  RequestPasswordReset(form: any) {
    return this.http
      .post<any>(
        environment.serverAPI +
          `v1/Authenticate/RequestPasswordReset?email=${form.Email}`,
        form
      )
      .pipe(
        catchError((error) => {
          console.error('API Error:', error);
          throw error;
        })
      );
  }

  PostInsertNewFeedback(body: {}) {
    return this.http.post<any>(
      environment.serverAPI + 'v1/Feedbacks/PostInsertNewFeedback',
      body
    );
  }

  getPagedAllSubscribers(pageNumber: any, pageSize: any) {
    return this.http.get<any>(
      environment.serverAPI +
        `v1/Feedbacks/GetPagedAllFeedbacks?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  getFeedbackById(id: number) {
    return this.http.get<any>(
      environment.serverAPI + `v1/Feedbacks/GetFeedbackById?Id=${id}`
    );
  }

  getFeedbackMessagesBySenderId(senderId: string) {
    return this.http.get<any>(
      environment.serverAPI +
        `v1/Feedbacks/GetFeedbackMessagesBySenderId?Id=${senderId}`
    );
  }

  PostDocsForFeedback(formData: any) {
    return this.http.post<any>(
      environment.serverAPI + 'v1/FileManager/PostDocsForFeedback',
      formData
    );
  }

  getAdvertByAdvertId(id: number) {
    return this.http.get<any>(
      environment.serverAPI + `v1/Adverts/GetAdvertByAdvertId?id=${id}`
    );
  }

  getAllAdverts() {
    return this.http.get<any>(
      environment.serverAPI + `v1/Adverts/GetAllAdverts`
    );
  }

  getDocAdvertFileById(id: any) {
    return this.http.get(
      environment.serverAPI + `v1/FileManager/GetDocAdvertFileById?Id=${id}`,
      { responseType: 'blob' }
    );
  }

  postInsertNewFeedback(body: {}) {
    return this.http.post<any>(
      environment.serverAPI + 'v1/Feedbacks/PostInsertNewFeedback',
      body
    );
  }

  PostInsertAdvertClick(body: {}) {
    return this.http.post<any>(
      environment.serverAPI + 'v1/Adverts/PostInsertAdvertClick',
      body
    );
  }

  paySubscription(body: any) {
    console.log('Subscribe: ', body);
    return this.http.post<any>(
      environment.serverAPI + 'v1/Subscribers/MakeRecurringPayment',
      body
    );
  }

  GetSourceTextFolderFiles(foldername: string) {
    return this.http.get<any>(
      environment.serverAPI +
        `v1/RawSource/GetSourceTextFolderFiles?textfoldername=${foldername}&lasthours=6`
    );
  }

  GetSourceTextFolderFilesTime(foldername: string, time: number) {
    const url = `${environment.serverAPI}v1/RawSource/GetSourceTextFolderFiles`;

    // Construct the query parameters including foldername and lasthours
    const queryParams = {
      textfoldername: foldername,
      lasthours: time,
    };

    // Make the HTTP GET request with query parameters
    return this.http.get<any>(url, { params: queryParams });
  }

  GetSourceChartFolderFilesList(foldername: any) {
    return this.http.get<any>(
      environment.serverAPI +
        `v1/RawSource/GetSourceChartFolderFilesList?imagefoldername=${foldername}`
    );
  }

  GetSourceChartFolderFilesListtime(foldername: any, time: any) {
    return this.http.get<any>(
      environment.serverAPI +
        `v1/RawSource/GetSourceChartFolderFilesList?imagefoldername=${foldername}&lasthours=${time}`
    );
  }

  GetSourceAviationFolderFilesList(foldername: any, time: any) {
    return this.http.get<any>(
      environment.serverAPI +
        `v1/RawSource/GetSourceAviationFolderFilesList?imagefoldername=${foldername}&lasthours=${time}`
    );
  }

  GetSourceAviationFolderFilesListNull(time: any) {
    return this.http.get<any>(
      environment.serverAPI +
        `v1/RawSource/GetSourceAviationFolderFilesList?imagefoldername=&lasthours=${time}`
    );
  }

  GetAviationFile(
    imagefoldername: string,
    imagefilename: string
  ): Observable<any> {
    const url = `${environment.serverAPI}v1/RawSource/GetAviationFile?imagefoldername=${imagefoldername}&imagefilename=${imagefilename}`;
    return this.http.get<any>(url);
  }

  GetChartsFile(
    imagefoldername: string,
    imagefilename: string
  ): Observable<any> {
    const url = `${environment.serverAPI}v1/RawSource/GetChartsFile?imagefoldername=${imagefoldername}&imagefilename=${imagefilename}`;
    return this.http.get<any>(url);
  }

  getFileType(fileMimetype: string): string {
    const videoMimeTypes = [
      'video/mp4',
      'video/quicktime',
      'video/x-msvideo',
      'video/x-ms-wmv',
    ];
    const imageMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/jpg',
      'image/svg+xml',
    ];
    const applicationMimeTypes = ['application/pdf'];
    const audioMimeTypes = [
      'audio/mpeg',
      'audio/mp4',
      'audio/ogg',
      'audio/wav',
      'audio/mp3',
    ];

    if (videoMimeTypes.includes(fileMimetype)) {
      return 'Video';
    } else if (imageMimeTypes.includes(fileMimetype)) {
      return 'Image';
    } else if (applicationMimeTypes.includes(fileMimetype)) {
      return 'Application';
    } else if (audioMimeTypes.includes(fileMimetype)) {
      return 'Audio';
    } else {
      return 'Unknown';
    }
  }

  getFeedbackData(): Observable<any> {
    return this.feedbackObservable$;
  }

  PostInsertSubscription(body: any) {
    return this.http.post<any>(
      environment.serverAPI + 'v1/Subscriptions/PostInsertSubscription',
      body
    );
  }

  CancelSubscription(subscriptionId: number) {
    const body = {
      subscriptionId: subscriptionId
    };

    return this.http.post<any>(
      environment.serverAPI +
        `v1/Subscriptions/CancelSubscription?subscriptionId=${subscriptionId}`,
        body
    );
  }

  GetSubscriptionByUserProfileId(Id: number) {
    return this.http.get<any>(
      environment.serverAPI +
        `v1/Subscriptions/GetActiveSubscriptionByUserProfileId?Id=${Id}`
    );
  }

  GetActiveSubscriptionByUserProfileId(Id: number) {
    return this.http.get<any>(
      environment.serverAPI +
        `v1/Subscriptions/GetActiveSubscriptionByUserProfileId?Id=${Id}`
    );
  }

  getSpeciReport(): Observable<any> {
    return this.http.get<any>(
      environment.serverAPI +
        'v1/RawSource/GetSourceTextFolderFiles?textfoldername=speci'
    );
  }

  getRecentTafs(foldername: string): Observable<any> {
    return this.http.get<any>(
      environment.serverAPI +
        `v1/RawSource/GetSourceTextFolderFiles?textfoldername=${foldername}`
    );
  }

  getRecentMetarReports(foldername: any, time: any) {
    return this.http.get<any>(
      environment.serverAPI +
        `v1/RawSource/GetSourceAviationFolderFilesList?imagefoldername=${foldername}&lasthours=${time}`
    );
  }

  fetchWindChartImages(
    foldername: any,
    lasthours: number = 12
  ): Observable<any[]> {
    const apiUrl = `${environment.serverAPI}v1/RawSource/GetSourceAviationFolderFilesList`;

    // Construct the query parameters including foldername and lasthours
    const queryParams = {
      imagefoldername: foldername,
      lasthours: lasthours.toString(),
    };

    // Make the HTTP GET request with query parameters
    return this.http.get<any[]>(apiUrl, { params: queryParams });
  }

  fetchHourlyChartData(
    foldername: any,
    lasthours: number = 24
  ): Observable<any[]> {
    const apiUrl = `${environment.serverAPI}v1/RawSource/GetSourceAviationFolderFilesList`;
    const queryParams = {
      imagefoldername: foldername,
      lasthours: lasthours.toString(),
    };
    return this.http.get<any[]>(apiUrl, { params: queryParams });
  }
}
