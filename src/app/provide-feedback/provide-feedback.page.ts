import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { APIService } from '../services/apis.service';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AttachmentFilePage } from '../chat/attachment-file/attachment-file.page';

@Component({
  selector: 'app-provide-feedback',
  templateUrl: './provide-feedback.page.html',
  styleUrls: ['./provide-feedback.page.scss'],
})
export class ProvideFeedbackPage implements OnInit {
  userForm: FormGroup;
  aspUserName!: string;
  aspUserID!: string;
  aspUserEmail!: string;
  fullname!: string;
  selectedFile: File | undefined;
  selectedFileName: string | undefined;
  selectedFileSrc: string | ArrayBuffer | null = null;
  selectedFileType: string | undefined;
  addFile: boolean = false;
  fileType: string | undefined;
  shouldScrollToBottom: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private apiService: APIService,
    private router: Router,
    private alertController: AlertController,
    public dialog: MatDialog
  ) {
    this.userForm = this.formBuilder.group({
      title: ['', Validators.required],
      message: ['', Validators.required],
      feedbackFile: [null], // Initialize feedbackFile control
    });
  }

  ngOnInit() {
    const user = JSON.parse(sessionStorage.getItem('CurrentUser') || '{}');
    this.aspUserName = user.aspUserName;
    this.aspUserID = user.aspUserID;
    this.aspUserEmail = user.aspUserEmail;
    this.fullname = user.fullname;
  }

  onSubmitFeedback() {
    if (this.userForm.invalid) {
      return; // Form validation failed, do not proceed
    }

    const formValues = this.userForm.value;

    const feedbackData = {
      fullname: this.fullname,
      senderId: this.aspUserID,
      senderEmail: this.aspUserEmail,
      title: formValues.title,
      isresponded: false,
      FeedbackMessages: [
        {
          senderId: this.aspUserID,
          senderEmail: this.aspUserEmail,
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

    if (this.selectedFile) {
      this.uploadAttachment(this.selectedFile, feedbackData);
    } else {
      this.submitFeedback(feedbackData);
    }
  }

  uploadAttachment(file: File, feedbackData: any) {
    const formData = new FormData();
    formData.append('file', file);
    console.log('File uploaded::::', feedbackData);
    console.log('Filefile:', file);
  
    const dataToSend = {
      feedbackData: feedbackData,
      imageSRC: this.selectedFileSrc || '',
      message: feedbackData.message || '',
      responderEmail: this.aspUserEmail,
      resonderId: this.aspUserID,
      addFile: this.addFile,
      fileType: this.selectedFileType || '',
    };
  
    this.apiService.PostDocsForFeedback(dataToSend).subscribe(
      (uploadResponse: any) => {
        console.log('File uploaded successfully:', uploadResponse);
  
        // Update feedbackData with uploaded file URL
        dataToSend.feedbackData.FeedbackMessages[0].feedbackAttachment = uploadResponse.file_url;
  
        // Submit feedback after file upload
        this.submitFeedback(dataToSend.feedbackData);
      },
      (uploadError) => {
        console.error('Error uploading file:', uploadError);
        this.presentErrorAlert();
      }
    );
  }
  

  submitFeedback(feedbackData: any) {
    this.apiService.postInsertNewFeedback(feedbackData).subscribe(
      (response: any) => {
        console.log('Feedback submitted successfully:', response);
        this.presentSuccessAlert();
        this.router.navigate(['/message-list']);
      },
      (error) => {
        console.error('Error submitting feedback:', error);
        this.presentErrorAlert();
      }
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file;
    this.selectedFileName = file.name;
    // Other file handling logic...
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

  BacktoMessagelist() {
    this.router.navigate(['/message-list']);
  }

  openAttachmentDialog(formData: any) {
    const dialogRef = this.dialog.open(AttachmentFilePage, {
      data: {
        feedbackData: formData,
        imageSRC: this.selectedFileSrc || '',
        message: formData.message || '',
        responderEmail: this.aspUserEmail,
        resonderId: this.aspUserID,
        addFile: this.addFile,
        fileType: this.selectedFileType || '',
      },
      width: '85%',
      height: '50%',
      autoFocus: true,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 'submit') {
      }
    });
  }
}
