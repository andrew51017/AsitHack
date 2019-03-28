import { Component } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';

import {MicroBitService} from '../../services/MicroBitService';
import {ChangeDetectorRef} from '@angular/core'

import { ModalController } from '@ionic/angular';

import { SampleModalPage } from '../sample-modal/sample-modal.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  isConnected: boolean;

  isScanning: boolean;

  currentForceSamples: Array<Object>;

  recordedSamples: Array<object>;

  sampleStartTime: string;

  elapsedSeconds: number;

  currentTimer: any;

  isRecording: boolean;

  constructor(public ble: BLE, public service : MicroBitService, public ref: ChangeDetectorRef, public modalController : ModalController) { 
    this.isConnected = false;
    this.isScanning = false;
    this.isRecording = false;
    this.recordedSamples = [];
    this.elapsedSeconds = 0;

    this.connectToSensor();
  }

  public stopScan() {
    this.ble.stopScan().then(res => {
      this.isScanning = false;
    });
  }

  public connectToSensor() {

    console.log("Scanning");
    this.isScanning = true;

    this.ble.startScan([]).subscribe(foundDevice => {

      console.log(foundDevice);

      if (foundDevice.name && foundDevice.name.indexOf("BBC") > -1) {
        this.service.connectBle(foundDevice.id).subscribe(d => {
          
          this.ble.stopScan();
          this.isScanning = false;
          this.isConnected = true;
          console.log("Connected");
          this.ref.detectChanges();
        });
      }

    }, err => {
      console.log(err);
    }, () => {
      console.log("Done");
      this.isScanning = false;
    });    
  }

  public startSession() {

    this.currentForceSamples = [];
    this.sampleStartTime = Date();
    this.elapsedSeconds = 0;
    this.isRecording = true;
    this.service.writeAccelerometerPeriod(80);

    this.currentTimer = setInterval(() => {
      this.elapsedSeconds = this.elapsedSeconds + 1;
      this.ref.detectChanges();

    }, 1000);

    this.service.startReadSubscription().subscribe(f => {
      let currentForce = this.service.convertAccelerometerData(f);
      console.log(currentForce);

      this.currentForceSamples.push(currentForce);

      this.ref.detectChanges();
    });

  }

  public stopSession() {

    clearInterval(this.currentTimer);
    this.service.stopReadSubscription();

    // Calculate the average.

    let total = 0;

    this.currentForceSamples.forEach((s : any) => {
      total = total + s.combined;
    });

    let average = total / this.currentForceSamples.length;

    let combinedSamples = [];

    this.currentForceSamples.forEach((s : any) => {
      combinedSamples.push(s.combined);
    });

    let sample = {
      elapsedSeconds: this.elapsedSeconds,
      startTime: this.sampleStartTime,
      averageForce: average,
      minForce: Math.min(...combinedSamples),
      maxForce: Math.max(...combinedSamples)
    };

    this.recordedSamples.push(sample);

    this.isRecording = false;

    this.ref.detectChanges();
  }  

  public async showModal(sample) {
      const modal = await this.modalController.create({
        component: SampleModalPage,
        componentProps: { selectedSample: sample }
      });
      return await modal.present();
  }

}
