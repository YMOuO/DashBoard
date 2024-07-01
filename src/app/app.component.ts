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
  failedData: any[] = [];
  deliveryTrendData: any;
  qualityTrendData: any;
  efficiencyTrendData: any;
  CombinedTrendData: any;
  lineChartOptions: any;
  deliveryBarChartData: any;
  qualityBarChartData: any;
  efficiencyBarChartData: any;
  lowEfficiencyData: any[] = []; // 新增 lowEfficiencyData 屬性
  lowQualityData: any[] = []; // 新增 lowQualityData 屬性
  lowDeliveryData: any[] = []; // 新增 lowDeliveryData 屬性

  constructor(private dataService: DataService) {}
  ikan: number = 0;
  map2member: { [key: string]: any } = {
    delivery: ['actual_output', 'plan_output'],
    quality: ['passed_qty', 'total_qty'],
    efficiency: ['std_hr', 'total_hr'],
  };
  ngOnInit() {
    this.dataService.getData().subscribe((data: any[]) => {
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
      this.CombinedTrendData = this.getAllTrendData(data);
      this.deliveryBarChartData = this.getDeliveryBarChartData(data);
      this.qualityBarChartData = this.getQualityBarChartData(data);
      this.efficiencyBarChartData = this.getEfficiencyBarChartData(data);

      // 計算並設置低於90的數據
      this.lowEfficiencyData = this.getLowEfficiencyData(data);
      this.lowQualityData = this.getLowQualityData(data);
      this.lowDeliveryData = this.getLowDeliveryData(data);

      // 初始化 lineChartOptions 屬性，禁用 datalabels 插件
      this.lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            display: false, // 禁用 datalabels 插件
          },
        },
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
      };
    });
  }
  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  getChartData(label: string, value: number): any {
    var value_round = Math.round((value + Number.EPSILON) * 100) / 100;
    var value_round2 = Math.round((100 - value_round) * 100) / 100;
    return {
      //labels: [label, 'Remaining'],
      datasets: [
        {
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

  getAllTrendData(data: any): any {
    // 返回趨勢數據
    var data_key = ['delivery', 'quality', 'efficiency'];
    var tempdaily: { [key: string]: any } = {};
    for (var i = 0; i < data_key.length; i++) {
      tempdaily[data_key[i]] = this.getTrendData(data, data_key[i]);
    }
    var data_combine = [];
    for (var i = 0; i < data_key.length; i++) {
      data_combine.push(tempdaily[data_key[i]].datasets[0]);
    }
    var labels = tempdaily[data_key[0]].labels;
    return {
      labels: labels,
      datasets: data_combine,
    };
  }

  getTrendData(data: any, type: string): any {
    // 返回趨勢數據
    var tempdaily: { [key: string]: any } = {};
    for (var i = 0; i < data.length; i++) {
      var day: string = data[i].datecode;
      if (tempdaily.hasOwnProperty(data[i].datecode)) {
        tempdaily[day][this.map2member[type][0]] +=
          data[i][this.map2member[type][0]];
        tempdaily[day][this.map2member[type][1]] +=
          data[i][this.map2member[type][1]];
      } else {
        tempdaily[day] = {};
        tempdaily[day][this.map2member[type][0]] =
          data[i][this.map2member[type][0]];
        tempdaily[day][this.map2member[type][1]] =
          data[i][this.map2member[type][1]];
      }
    }
    var labels = Object.keys(tempdaily);
    labels.sort();
    var data_process_func = this.dataService.calculateDeliveryDataSingle;
    switch (type) {
      case 'delivery':
        data_process_func = this.dataService.calculateDeliveryDataSingle;
        break;

      case 'quality':
        data_process_func = this.dataService.calculateeQualityDataSingle;
        break;

      case 'efficiency':
        data_process_func = this.dataService.calculateEfficiencyDataSingle;
        break;
    }
    var values = [];
    for (var i = 0; i < labels.length; i++) {
      values.push(data_process_func(tempdaily[labels[i]]));
    }

    console.log('kk', labels.length, values.length);
    console.log('jj', labels, values);
    return {
      labels: labels,
      datasets: [
        {
          label: type,
          data: values,
          fill: false,
          borderColor: this.getRandomColor(),
        },
      ],
    };
  }

  // 新增方法來計算並設置不同 delivery 範圍內的產品數量
  getDeliveryBarChartData(data: any[]): any {
    let highDelivery = 0;
    let mediumDelivery = 0;
    let lowDelivery = 0;

    data.forEach((item) => {
      const delivery = this.dataService.calculateDeliveryData([item]);
      if (delivery > 85) {
        highDelivery++;
      } else if (delivery >= 80 && delivery <= 85) {
        mediumDelivery++;
      } else {
        lowDelivery++;
      }
    });

    return {
      labels: ['> 85%', '80-85%', '< 80%'],
      datasets: [
        {
          label: 'Count',
          data: [highDelivery, mediumDelivery, lowDelivery],
          backgroundColor: ['#4caf50', '#ffeb3b', '#f44336'],
        },
      ],
    };
  }

  // 新增方法來計算並設置不同 quality 範圍內的產品數量
  getQualityBarChartData(data: any[]): any {
    let highQuality = 0;
    let mediumQuality = 0;
    let lowQuality = 0;

    data.forEach((item) => {
      const quality = this.dataService.calculateQualityData([item]);
      if (quality > 92) {
        highQuality++;
      } else if (quality >= 90 && quality <= 92) {
        mediumQuality++;
      } else {
        lowQuality++;
      }
    });

    return {
      labels: ['> 98%', '90-98%', '< 90%'],
      datasets: [
        {
          label: 'Count',
          data: [highQuality, mediumQuality, lowQuality],
          backgroundColor: ['#4caf50', '#ffeb3b', '#f44336'],
        },
      ],
    };
  }

  // 新增方法來計算並設置不同 efficiency 範圍內的產品數量
  getEfficiencyBarChartData(data: any[]): any {
    let highEfficiency = 0;
    let mediumEfficiency = 0;
    let lowEfficiency = 0;

    data.forEach((item) => {
      const efficiency = this.dataService.calculateEfficiencyData([item]);
      if (efficiency > 75) {
        highEfficiency++;
      } else if (efficiency >= 65 && efficiency <= 75) {
        mediumEfficiency++;
      } else {
        lowEfficiency++;
      }
    });

    return {
      labels: ['> 75%', '65-75%', '<65%'],
      datasets: [
        {
          label: 'Count',
          data: [highEfficiency, mediumEfficiency, lowEfficiency],
          backgroundColor: ['#4caf50', '#ffeb3b', '#f44336'],
        },
      ],
    };
  }

  // 新增方法來過濾低於90的效率數據
  // 新增方法來過濾低於90的交付率數據
  getLowDeliveryData(data: any[]): any[] {
    var new_data = data.filter((item) => {
      const delivery = this.dataService.calculateDeliveryDataSingle(item);
      return delivery < 80;
    });
    new_data = JSON.parse(JSON.stringify(new_data));
    for (var i = 0; i < new_data.length; i++) {
      new_data[i].val = this.dataService.calculateDeliveryDataSingle(
        new_data[i]
      );
    }
    return new_data;
  }
  // 新增方法來過濾低於90的質量數據
  getLowQualityData(data: any[]): any[] {
    var new_data = data.filter((item) => {
      const quality = this.dataService.calculateeQualityDataSingle(item);
      return quality < 90;
    });
    new_data = JSON.parse(JSON.stringify(new_data));
    for (var i = 0; i < new_data.length; i++) {
      new_data[i].val = this.dataService.calculateeQualityDataSingle(
        new_data[i]
      );
    }
    return new_data;
  }

  getLowEfficiencyData(data: any[]): any[] {
    var new_data = data.filter((item) => {
      const efficiency = this.dataService.calculateEfficiencyDataSingle(item);
      return efficiency < 65;
    });
    new_data = JSON.parse(JSON.stringify(new_data));
    for (var i = 0; i < new_data.length; i++) {
      new_data[i].val = this.dataService.calculateEfficiencyDataSingle(
        new_data[i]
      );
    }
    return new_data;
  }
}
