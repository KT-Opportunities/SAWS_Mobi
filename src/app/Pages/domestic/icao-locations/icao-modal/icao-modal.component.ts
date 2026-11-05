import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-icao-modal',
  templateUrl: './icao-modal.component.html',
  styleUrls: ['./icao-modal.component.scss'],
})
export class IcaoModalComponent {
  @Input() locationData: any; // Input from parent component

  constructor(private modalCtrl: ModalController, private dialogRef: MatDialogRef<IcaoModalComponent>,) {}

  closeImageDialog() {
    this.dialogRef.close('close');
  }
}
