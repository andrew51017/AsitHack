import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-sample-modal',
  templateUrl: './sample-modal.page.html',
  styleUrls: ['./sample-modal.page.scss'],
})
export class SampleModalPage implements OnInit {

  selectedSampe: any;

  chartData: Object;

  chartData2: Object;

  constructor(private modalController: ModalController, private navParams: NavParams) { }

  ngOnInit() {

    this.selectedSampe = this.navParams.data.selectedSample;

    this.chartData = {
      chartType: 'LineChart',
      dataTable: [
        ['Person', 'Average', 'Min', 'Max'],
        ['BP1', 1050, 800, 1100],
        ['BP2', 900, 750, 1400],
        ['BP3', 1200, 900, 1500],
        ['You', this.selectedSampe.averageForce, this.selectedSampe.minForce, this.selectedSampe.maxForce],
      ],
      options: {
      'title': 'Benchmark',
      }
    };

    this.chartData2 = {
      chartType: 'Bar',
      dataTable: [
        ['Person', 'Average', 'Min', 'Max'],
        ['BP1', 1050, 800, 1100],
        ['BP2', 900, 750, 1400],
        ['BP3', 1200, 900, 1500],
        ['You', this.selectedSampe.averageForce, this.selectedSampe.minForce, this.selectedSampe.maxForce],
      ],
      options: {
      'title': 'Benchmark',
      },
      bars: 'horizontal', // Required for Material Bar Charts.
      series: {
        0: { axis: 'average' },
        1: { axis: 'min' },
        2: { axis: 'max' }
      },
      axes: {
        x: {
          average: {label: 'Average'},
          min: {label: 'Min'},
          max: {label: 'Max'},
        }
      }      
    };    


  }

}
