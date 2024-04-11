import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../services/apis.service';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Feedback } from '../Models/message.model';
import { fileDataFeedback } from '../Models/File';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-provide-feedback',
  templateUrl: './provide-feedback.page.html',
  styleUrls: ['./provide-feedback.page.scss'],
})
export class ProvideFeedbackPage implements OnInit {
  feedbackForm: FormGroup;
  selectedFile: File | undefined;
  selectedFileName: string | undefined;
  selectedFileSrc: string | ArrayBuffer | null = null;
  userId: any; // Assuming userId is correctly obtained
  userEmail: any;
  fullname: any;
  files: fileDataFeedback[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private APIService: APIService,
    private formBuilder: FormBuilder,
    private authS: AuthService,
    private alertController: AlertController,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog
  ) {
    this.feedbackForm = this.formBuilder.group({
      title: ['', Validators.required],
      message: ['', Validators.required],
      feedbackFile: [null], // This will hold the file object
    });
  }

  ngOnInit() {
    // Assuming you retrieve user details from AuthService
    const user = this.authS.getCurrentUser();
    console.log('USER DETAILS:', user);
    if (user) {
      const userLoginDetails = JSON.parse(user);
      this.userEmail = userLoginDetails.aspUserEmail;
      this.userId = userLoginDetails.aspUserID;
      this.fullname = userLoginDetails.fullname;
    }
  }

  onSubmit() {
    if (this.feedbackForm.valid) {
      const formValues = this.feedbackForm.value;
      const body = {
        fullname: this.fullname, // Provide fullname if needed
        senderId: this.userId,
        senderEmail: this.userEmail,
        responderId: '',
        responderEmail: '',
        title: formValues.title,
        isresponded: false,
        FeedbackMessages: [
          {
            senderId: this.userId,
            senderEmail: this.userEmail,
            responderId: '',
            responderEmail: '',
            feedback: formValues.message,
            response: '',
            broadcast: null,
            broadcastId: null,
            feedbackAttachment: this.selectedFileName || '',
            feedbackAttachmentFileName: this.selectedFileName || '',
            responseAttachment: '',
            responseAttachmentFileName: '',
          },
        ],
      };
      console.log('BODY::', body);
      // Call API to submit feedback
      this.APIService.postInsertNewFeedback(body).subscribe(
        (data: any) => {
          const feedbackId = data.DetailDescription.feedbackId;
          this.uploadFile(feedbackId); // Upload file after successful feedback submission
          this.presentSuccessAlert();
          this.feedbackForm.reset();
        },
        (err) => {
          console.error('Error:', err);
          this.presentErrorAlert();
        }
      );
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;

      // Optionally display file preview
      const reader = new FileReader();
      reader.onload = () => {
        // Handle file preview if needed
      };
      reader.readAsDataURL(file);
    }
  }

  uploadFile(feedbackId: number) {
    
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('feedbackMessageId', feedbackId.toString());

      this.APIService.PostDocsForFeedback(formData).subscribe(
        (data: any) => {
          console.log('File upload successful:', data);
        },
        (err) => {
          console.error('File upload failed:', err);
        }
      );
    }
  }

  async presentErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Failed to submit feedback. Please try again later.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Feedback Successfully Sent.',
      buttons: ['OK'],
    });
    await alert.present();
  }
  navigateToLandingPage() {
    this.router.navigate(['/landing-page']);
  }

  navigateToMessageList() {
    this.router.navigate(['/message-list']);
  }
  home() {
    // Navigate to landing page
    this.navigateToLandingPage();
  }

  BacktoMessagelist() {
    // Navigate to message list page
    this.router.navigate(['/message-list']);
  }
  // Other methods for navigation, dialog, etc. can be defined here
}
