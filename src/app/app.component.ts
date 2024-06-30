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
  chartOptions: any;

  constructor(private dataService: DataService) {}
  ikan: number = 0;

  ngOnInit() {
    this.dataService.getData().subscribe((data: any[]) => {
      const delivery = this.dataService.calculateDeliveryData(data);
      //console.log('QAQ', delivery);
      console.log('QAQdelivery', delivery, this.ikan++);
      if (!Array.isArray(data)) {
        console.error('Data is not an array:', data);
        return;
      }
      const quality = this.dataService.calculateQualityData(data);
      const efficiency = this.dataService.calculateEfficiencyData(data);

      this.deliveryData = this.getChartData('Delivery', delivery);
      this.qualityData = this.getChartData('Quality', quality);
      this.efficiencyData = this.getChartData('Efficiency', efficiency);

      this.failedData = this.getFailedData(data);
      this.deliveryTrendData = this.getTrendData(data, 'delivery');
      this.qualityTrendData = this.getTrendData(data, 'quality');
      this.efficiencyTrendData = this.getTrendData(data, 'efficiency');
      /* this.chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            color: '#000000',
            font: {
              size: 20,
              weight: 'bold',
            },
            formatter: (value: any, context: any) => {
              if (context.dataIndex === 0) {
                return value.toFixed(2) + '%';
              }
              return '';
            },
            anchor: 'center',
            align: 'center',
          },
        },
        cutout: '70%',
        rotation: -Math.PI / 2,
        circumference: 2 * Math.PI,
      };*/
    });
  }

  /*  getDoughnutChartData(values: number[]): any {
    const value = values.reduce((a, b) => a + b, 0) / values.length; // 計算平均值
    return {
      labels: ['Used', 'Remaining'],
      datasets: [
        {
          data: [value, 100 - value],
          backgroundColor: ['#FF6384', '#E0E0E0'],
          hoverBackgroundColor: ['#FF6384', '#E0E0E0'],
          borderColor: '#FFFFFF',
          borderWidth: 2,
        },
      ],
    };
  } */
  getChartData(label: string, value: number): any {
    var value_round = Math.round((value + Number.EPSILON) * 100) / 100;
    var value_round2 = Math.round((100 - value_round) * 100) / 100;
    return {
      labels: [label, 'Remaining'],
      datasets: [
        {
          // data: [...value],
          data: [value_round, value_round2],
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
