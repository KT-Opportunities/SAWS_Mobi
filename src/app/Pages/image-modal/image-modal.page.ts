import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import Swiper from 'swiper';
import { SwiperOptions } from 'swiper/types';
import { Zoom } from 'swiper/modules';
import { DomSanitizer } from '@angular/platform-browser';

Swiper.use([Zoom]);

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.page.html',
  styleUrls: ['./image-modal.page.scss'],
})
export class ImageModalPage implements OnInit {
  @ViewChild('swiper') swiperRef!: ElementRef<HTMLElement>;
  swiper!: Swiper;
  @Input() imgs: any;
  currentIndex: number = 0;
  imgsIsArray: boolean = false;
  img: any;
  rotatedImg: string | null = null; // Store rotated image
  rotation: number = 0; // Track current rotation

  swiperConfig: SwiperOptions = {
    zoom: true,
    touchEventsTarget: 'container',
    on: {
      touchStart: (swiper, event) => {
        event.preventDefault();
      },
    },
  };

  constructor(
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    if (Array.isArray(this.imgs)) {
      this.img = this.imgs[this.currentIndex]; // Set initial image
      this.imgsIsArray = true;
    } else {
      this.img = this.imgs;
    }
    this.rotateImage(); // Apply the current rotation to the initial image
  }

  close() {
    this.modalCtrl.dismiss();
  }

  rotateLeft() {
    this.rotation -= 90;
    if (this.rotation < 0) this.rotation += 360;
    this.rotateImage(); // Apply the rotation
  }

  rotateRight() {
    this.rotation += 90;
    if (this.rotation >= 360) this.rotation -= 360;
    this.rotateImage(); // Apply the rotation
  }

  rotateImage() {
    const imgElement = new Image();
    imgElement.crossOrigin = 'Anonymous'; // Allow cross-origin requests

    imgElement.src = this.img; // Load the current image
    imgElement.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      const angleInRadians = (this.rotation * Math.PI) / 180;
      const width = imgElement.width;
      const height = imgElement.height;

      // Calculate new dimensions based on rotation
      const newWidth =
        Math.abs(Math.cos(angleInRadians) * width) +
        Math.abs(Math.sin(angleInRadians) * height);
      const newHeight =
        Math.abs(Math.sin(angleInRadians) * width) +
        Math.abs(Math.cos(angleInRadians) * height);

      // Set canvas dimensions to match the rotated image
      canvas.width = newWidth;
      canvas.height = newHeight;

      // Translate context to center of canvas before rotating
      ctx.translate(newWidth / 2, newHeight / 2);
      ctx.rotate(angleInRadians);
      ctx.drawImage(imgElement, -width / 2, -height / 2);

      // Get rotated image as base64 URL
      this.rotatedImg = canvas.toDataURL();
    };

    imgElement.onerror = (error) => {
      console.error('Error loading image:', error);
    };
  }

  next() {
    this.currentIndex++;
    if (this.currentIndex >= this.imgs.length) {
      this.currentIndex = 0; // Loop back to first image
    }
    this.img = this.imgs[this.currentIndex]; // Update current image
    this.rotateImage(); // Reapply the current rotation to the new image
  }

  prev() {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.imgs.length - 1; // Loop back to last image
    }
    this.img = this.imgs[this.currentIndex]; // Update current image
    this.rotateImage(); // Reapply the current rotation to the new image
  }
}
