import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import Swiper from 'swiper';
import { SwiperContainer } from 'swiper/element';
import { SwiperOptions } from 'swiper/types';
import { Zoom } from 'swiper/modules';
import { DomSanitizer } from '@angular/platform-browser';

// Use Swiper's Zoom module
Swiper.use([Zoom]);

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.page.html',
  styleUrls: ['./image-modal.page.scss'],
})
export class ImageModalPage implements OnInit {
  @ViewChild('swiper') swiperRef!: ElementRef<HTMLElement>; // Reference to Swiper element
  swiper!: Swiper; // Swiper instance
  @Input() imgs: any; // Input for images array

  currentIndex: number = 0; // Current image index
  imgsIsArray: boolean = false; // Flag to check if imgs is an array
  img: any; // Current image source
  rotatedImg: string | null = null; // Rotated image data URL
  rotation: number = 0; // Rotation angle in degrees

  // Swiper configuration options
  swiperConfig: SwiperOptions = {
    zoom: true, // Enable zoom
    touchEventsTarget: 'container', // Handle touch events on the container
    on: {
      // Prevent default behavior on touch start
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
    console.log('Initial Image Source:', this.img);
    
    // Initialize the image based on input
    if (Array.isArray(this.imgs)) {
      this.img = this.imgs[this.currentIndex]; // Set the initial image if imgs is an array
      this.imgsIsArray = true;
    } else {
      this.img = this.imgs; // Set img directly if it's a single image
    }
  }

  close() {
    this.modalCtrl.dismiss(); // Close the modal
  }

  rotateLeft() {
    this.rotation -= 90; // Decrease rotation by 90 degrees
    this.rotation = this.rotation < 0 ? this.rotation + 360 : this.rotation; // Normalize rotation
    this.rotateImage(); // Rotate the image
  }

  rotateRight() {
    this.rotation += 90; // Increase rotation by 90 degrees
    this.rotation = this.rotation >= 360 ? this.rotation - 360 : this.rotation; // Normalize rotation
    this.rotateImage(); // Rotate the image
  }

  rotateImage() {
    const imgElement = new Image();
    imgElement.crossOrigin = 'Anonymous'; // Allow cross-origin requests
    imgElement.src = this.img; // Load the original image

    imgElement.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Calculate new dimensions based on rotation
      const angleInRadians = (this.rotation * Math.PI) / 180;
      const width = imgElement.width;
      const height = imgElement.height;
      const newWidth = Math.abs(Math.cos(angleInRadians) * width) + Math.abs(Math.sin(angleInRadians) * height);
      const newHeight = Math.abs(Math.sin(angleInRadians) * width) + Math.abs(Math.cos(angleInRadians) * height);

      // Set canvas dimensions
      canvas.width = newWidth;
      canvas.height = newHeight;

      // Translate context to the center of the canvas and rotate
      ctx!.translate(newWidth / 2, newHeight / 2);
      ctx!.rotate(angleInRadians);
      ctx!.drawImage(imgElement, -width / 2, -height / 2); // Draw the image centered

      // Get the data URL of the rotated image
      this.rotatedImg = canvas.toDataURL(); // Update rotated image source
    };

    imgElement.onerror = (error) => {
      console.error('Error loading image:', error); // Log error if image fails to load
    };
  }

  next() {
    this.currentIndex++; // Increment the index
    if (this.currentIndex >= this.imgs.length) {
      this.currentIndex = 0; // Loop back to the first image if at the end
    }
    this.img = this.imgs[this.currentIndex]; // Update the current image
  }

  prev() {
    this.currentIndex--; // Decrement the index
    if (this.currentIndex < 0) {
      this.currentIndex = this.imgs.length - 1; // Loop back to the last image if at the beginning
    }
    this.img = this.imgs[this.currentIndex]; // Update the current image
  }
}
