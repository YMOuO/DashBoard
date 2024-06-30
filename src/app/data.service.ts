import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ManufacturingData } from './data.model'; // 引入接口
function IsNotUndefined(val: any): boolean {
  return typeof val !== 'undefined';
}
@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dataUrl = 'assets/mock_data.json'; // 更新為您的JSON文件的路徑

  constructor(private http: HttpClient) {}

  getData(): Observable<any[]> {
    return this.http.get<any[]>(this.dataUrl);
  }
  ikan: number = 0;
  calculateDeliveryData(data: any[]): number {
    /*   var actualOutput = 1.0;
    var planOutput = 1.0;
    if (typeof data !== 'undefined') {
      if (typeof data.actual_output !== 'undefined') {
        actualOutput = data.actual_output;
      }
      if (typeof data.plan_output !== 'undefined') {
        planOutput = data.plan_output;
      }
    }
    //return 90;
    console.log('777', (5 / planOutput) * 100, this.ikan++);
    return (5 / planOutput) * 100; */

    var validData = [];
    for (var i = 0; i < data.length; i++) {
      if (
        IsNotUndefined(data[i].plan_output) &&
        IsNotUndefined(data[i].actual_output)
      ) {
        validData.push(data[i]);
      }
    }
    var sum_actual_output = 0;
    for (var i = 0; i < validData.length; i++) {
      sum_actual_output += validData[i].actual_output;
    }
    var sum_plan_output = 0;
    for (var i = 0; i < validData.length; i++) {
      sum_plan_output += validData[i].plan_output;
    }

    return (sum_actual_output / sum_plan_output) * 100;
  }

  calculateQualityData(data: any[]): number {
    var validData = [];
    for (var i = 0; i < data.length; i++) {
      if (
        IsNotUndefined(data[i].passed_qty) &&
        IsNotUndefined(data[i].total_qty)
      ) {
        validData.push(data[i]);
      }
    }
    var sum_total_qty = 0;
    for (var i = 0; i < validData.length; i++) {
      sum_total_qty += validData[i].total_qty;
    }
    var sum_passed_qty = 0;
    for (var i = 0; i < validData.length; i++) {
      sum_passed_qty += validData[i].passed_qty;
    }
    return (sum_passed_qty / sum_total_qty) * 100;
  }

  calculateEfficiencyData(data: any[]): number {
    var validData = [];
    for (var i = 0; i < data.length; i++) {
      //console.log('777', data[i].std_hr, data[i].total_hr, this.ikan++);

      if (IsNotUndefined(data[i].std_hr) && IsNotUndefined(data[i].total_hr)) {
        validData.push(data[i]);
      }
    }
    var sum_total_hr = 0;
    for (var i = 0; i < validData.length; i++) {
      sum_total_hr += validData[i].total_hr;
    }
    var sum_std_hr = 0;
    for (var i = 0; i < validData.length; i++) {
      sum_std_hr += validData[i].std_hr;
    }
    return (sum_std_hr / sum_total_hr) * 100;
  }
}
