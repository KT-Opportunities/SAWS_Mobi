import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import Swiper from 'swiper';
import { SwiperOptions } from 'swiper/types';
import { Zoom } from 'swiper/modules';
import { DomSanitizer } from '@angular/platform-browser';

Swiper.use([Zoom]);

@Component({
  selector: 'app-view-symbol',
  templateUrl: './view-symbol.page.html',
  styleUrls: ['./view-symbol.page.scss'],
})
export class ViewSymbolPage implements OnInit {
  @ViewChild('swiper') swiperRef!: ElementRef<HTMLElement>;
  swiper!: Swiper;
  
@Input() imgs!: string | string[]; // "I promise this will be set"
img!: string; // same here

  rotatedImg: string | null = null; 
  rotation: number = 0; 
  currentIndex: number = 0;
  imgsIsArray: boolean = false;

  swiperConfig: SwiperOptions = {
    zoom: true,
    touchEventsTarget: 'container',
  };

  constructor(
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    if (Array.isArray(this.imgs)) {
      this.imgsIsArray = true;
      this.img = this.imgs[this.currentIndex];
    } else {
      this.img = this.imgs; 
    }
    this.rotateImage();
  }

  close() {
    this.modalCtrl.dismiss();
  }

  rotateLeft() {
    this.rotation -= 90;
    if (this.rotation < 0) this.rotation += 360;
    this.rotateImage();
  }

  rotateRight() {
    this.rotation += 90;
    if (this.rotation >= 360) this.rotation -= 360;
    this.rotateImage();
  }

  rotateImage() {
    const imgElement = new Image();
    imgElement.src = this.img;
    imgElement.crossOrigin = 'Anonymous';
    imgElement.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const angle = (this.rotation * Math.PI) / 180;
      const w = imgElement.width;
      const h = imgElement.height;
      const newWidth = Math.abs(Math.cos(angle) * w) + Math.abs(Math.sin(angle) * h);
      const newHeight = Math.abs(Math.sin(angle) * w) + Math.abs(Math.cos(angle) * h);
      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx.translate(newWidth / 2, newHeight / 2);
      ctx.rotate(angle);
      ctx.drawImage(imgElement, -w / 2, -h / 2);
      this.rotatedImg = canvas.toDataURL();
    };
    imgElement.onerror = (err) => console.error('Error loading image:', err);
  }

  next() {
    if (!this.imgsIsArray) return;
    this.currentIndex = (this.currentIndex + 1) % this.imgs.length;
    this.img = this.imgs[this.currentIndex];
    this.rotateImage();
  }

  prev() {
    if (!this.imgsIsArray) return;
    this.currentIndex = (this.currentIndex - 1 + this.imgs.length) % this.imgs.length;
    this.img = this.imgs[this.currentIndex];
    this.rotateImage();
  }
}
