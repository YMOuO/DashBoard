import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';
import { ManufacturingData } from './data.model'; // 引入接口

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  deliveryData: any;
  qualityData: any;
  efficiencyData: any;
  failedData: ManufacturingData[] = [];
  deliveryTrendData: any;
  qualityTrendData: any;
  efficiencyTrendData: any;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getData().subscribe((data) => {
      console.log('QAQ', data);
      const delivery = this.dataService.calculateDeliveryData(data);
      //console.log('QAQ', delivery);
      const quality = this.dataService.calculateQualityData(data);
      const efficiency = this.dataService.calculateEfficiencyData(data);

      this.deliveryData = this.getChartData('Delivery', delivery);
      this.qualityData = this.getChartData('Quality', quality);
      this.efficiencyData = this.getChartData('Efficiency', efficiency);

      this.failedData = this.getFailedData(data);
      this.deliveryTrendData = this.getTrendData(data, 'delivery');
      this.qualityTrendData = this.getTrendData(data, 'quality');
      this.efficiencyTrendData = this.getTrendData(data, 'efficiency');
    });
  }

  getChartData(label: string, value: number): any {
    return {
      labels: [label, 'Remaining'],
      datasets: [
        {
          data: [value, 100 - value],
          backgroundColor: ['#42A5F5', '#FFA726'],
          hoverBackgroundColor: ['#64B5F6', '#FFB74D'],
        },
      ],
    };
  }

  getFailedData(data: any): any[] {
    // 返回不及格的數據
    return data.filter((item: any) => item.failed_qty > 0);
  }

  getTrendData(data: any, type: string): any {
    // 返回趨勢數據
    const labels = data.map((item: any) => item.date);
    const values = data.map((item: any) => {
      if (type === 'delivery') {
        return this.dataService.calculateDeliveryData(item);
      } else if (type === 'quality') {
        return this.dataService.calculateQualityData(item);
      } else if (type === 'efficiency') {
        return this.dataService.calculateEfficiencyData(item);
      }
      return [];
    });

    return {
      labels: labels,
      datasets: [
        {
          label: type,
          data: values,
          fill: false,
          borderColor: '#4bc0c0',
        },
      ],
    };
  }
}
