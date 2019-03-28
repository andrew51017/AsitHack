import {Inject, Injectable} from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { of } from 'rxjs';
import { pipe } from 'rxjs'; 
import { mergeMap, switchMap, retry, 
  map, catchError, filter, scan } from 'rxjs/operators'; 

@Injectable()
export class MicroBitService {

  //region Consts

  private ACCELEROMETER_SERVICE_UUID               = 'e95d0753-251d-470a-a062-fa1922dfa9a8';
  private ACCELEROMETER_CHARACTERISTIC_UUID        = 'e95dca4b-251d-470a-a062-fa1922dfa9a8';
  private ACCELEROMETER_PERIOD_CHARACTERISTIC_UUID = 'e95dfb24-251d-470a-a062-fa1922dfa9a8';

  //endregion

  //region Fields

  private connectedMicroBit : any;

  //endregion

  //region Constructor

  /**
   * Constructs a MicroBitService
   * @param {BLE} ble The BLE client.
   */
  public constructor(public ble: BLE) {

  }

  //endregion

  //region Methods

  public connectBle(deviceId : string) {
    return this.ble.connect(deviceId).pipe(map(d => {
      this.connectedMicroBit = d;
      console.log(d);
      return d;
    }));
  }

  public readAccelerometer() {
    return this.ble.read(this.connectedMicroBit.id, this.ACCELEROMETER_SERVICE_UUID, this.ACCELEROMETER_CHARACTERISTIC_UUID);
  };

  public convertAccelerometerData(data : ArrayBuffer) {

    let typedData = new Int16Array(data);

    // Unit is milli-g. (g : Gals = 1 cm/s^2)

    let x = typedData[0];
    let y = typedData[1];
    let z = typedData[2];
  
    let rf1 = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

    let combined = Math.sqrt(Math.pow(rf1, 2) + Math.pow(z, 2));

    return {x: x, y: y, z: z, combined: combined};
  };

  public readAccelerometerPeriod() {

    return this.ble.read(this.connectedMicroBit.id, this.ACCELEROMETER_SERVICE_UUID, this.ACCELEROMETER_PERIOD_CHARACTERISTIC_UUID)
      .then(data => {
        let typedData = new Int16Array(data);
        return Promise.resolve(typedData[0]);
      })
      .catch(data => {
        throw data
      });
  };
  
  public writeAccelerometerPeriod(period : number) {
    if (period >= 640) {
      period = 640;
    } else if (period >= 160) {
      period = 160;
    } else if (period >= 80) {
      period = 80;
    } else if (period >= 20) {
      period = 20;
    } else if (period >= 10) {
      period = 10;
    } else if (period >= 5) {
      period = 5;
    } else if (period >= 2) {
      period = 2;
    } else {
      period = 1;
    }
  
    let buffer = new ArrayBuffer(2);
    let viewBuffer = new Uint16Array(buffer);
    viewBuffer[0] = period;

    this.ble.write(this.connectedMicroBit.id, this.ACCELEROMETER_SERVICE_UUID, this.ACCELEROMETER_PERIOD_CHARACTERISTIC_UUID, buffer);
  };

  public startReadSubscription() {
    return this.ble.startNotification(this.connectedMicroBit.id, this.ACCELEROMETER_SERVICE_UUID, this.ACCELEROMETER_CHARACTERISTIC_UUID);
  }

  public stopReadSubscription() {
    this.ble.stopNotification(this.connectedMicroBit.id, this.ACCELEROMETER_SERVICE_UUID, this.ACCELEROMETER_CHARACTERISTIC_UUID);
  }


  //endregion  

}
