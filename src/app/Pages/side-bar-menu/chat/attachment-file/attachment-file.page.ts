import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-attachment-file',
  templateUrl: './attachment-file.page.html',
  styleUrls: ['./attachment-file.page.scss'],
})
export class AttachmentFilePage implements OnInit {
  fileBaseUrl: any;
  date: Date;
  isImage: boolean = false;
  isVideo: boolean = false;
  isAudio: boolean = false;
  isApplication: boolean = false;
  buttonText:string = "";

  constructor(
    private formBuilder: FormBuilder,
    private authApi: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<AttachmentFilePage>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const currentDate = new Date();

    this.fileBaseUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      data.imageSRC
    );

    this.date = currentDate;

    this.isImage = data.fileType == 'Image';
    this.isVideo = data.fileType == 'Video';
    this.isAudio = data.fileType == 'Audio';
    this.isApplication = data.fileType == 'Application';
  }

  ngOnInit() {
    console.log("RouterURL", this.router.url);
    const routerUrl = this.router.url;
    if(routerUrl.includes("chat")){
      this.buttonText = "Send";
    }else{
      this.buttonText = "close";
    }
    console.log('DATA++++', this.data);
    console.log('DATA++++', this.data.imageSRC);
  }

  closeImageDialog() {
    this.dialogRef.close('close');
  }

  closeSubmitDialog() {
    this.dialogRef.close('submit');
  }
}
