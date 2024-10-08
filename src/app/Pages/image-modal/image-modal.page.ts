import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import Swiper from 'swiper';
import { SwiperContainer } from 'swiper/element';
import { SwiperOptions } from 'swiper/types';
// import { Swiper } from 'swiper';
import { Zoom } from 'swiper/modules';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
Swiper.use([Zoom]);
@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.page.html',
  styleUrls: ['./image-modal.page.scss'],
})
export class ImageModalPage implements OnInit {
  @ViewChild('swiper') swiperRef!: ElementRef<HTMLElement>; // Use ElementRef for Swiper 11
  // @ViewChild('swiper', { static: true }) swiperElement?: ElementRef;
  swiper!: Swiper;
  @Input() img: any;
  rotatedImg: string | null = null;
  rotation: number = 0;
  swiperConfig: SwiperOptions = {
    zoom: true,
    touchEventsTarget: 'container', // or 'wrapper'
    on: {
      touchStart: (swiper, event) => {
        // Ensure event is not passive
        event.preventDefault();
      },
    },
  };
  constructor(
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit() {
    console.log(this.img);

    console.log('Image Source:', this.rotatedImg ? this.rotatedImg : this.img);
  }
  close() {
    this.modalCtrl.dismiss();
  }
  rotateLeft() {
    this.rotation -= 90;
    this.rotation = this.rotation < 0 ? this.rotation + 360 : this.rotation;
    this.rotateImage();
  }
  rotateRight() {
    this.rotation += 90;
    this.rotation = this.rotation >= 360 ? this.rotation - 360 : this.rotation;
    this.rotateImage();
  }

  rotateImage() {
    const imgElement = new Image();
    imgElement.crossOrigin = 'Anonymous'; // Allow cross-origin requests

    imgElement.src = this.img.changingThisBreaksApplicationSecurity; // Load the original image
    console.log('The Image:', this.img);
    console.log('The Image2:', imgElement.src);

    imgElement.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Calculate new dimensions based on rotation
      const angleInRadians = (this.rotation * Math.PI) / 180;
      const width = imgElement.width;
      const height = imgElement.height;
      const newWidth =
        Math.abs(Math.cos(angleInRadians) * width) +
        Math.abs(Math.sin(angleInRadians) * height);
      const newHeight =
        Math.abs(Math.sin(angleInRadians) * width) +
        Math.abs(Math.cos(angleInRadians) * height);

      // Set canvas dimensions
      canvas.width = newWidth;
      canvas.height = newHeight;

      // Translate context to the center of the canvas
      ctx!.translate(newWidth / 2, newHeight / 2);
      ctx!.rotate(angleInRadians);
      ctx!.drawImage(imgElement, -width / 2, -height / 2); // Draw the image centered

      // Get the data URL of the rotated image
      this.rotatedImg = canvas.toDataURL();
    };

    imgElement.onerror = (error) => {
      console.error('Error loading image:', error);
    };
  }
}
