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
  //一次計算總和
  calculateDeliveryData(data: any[]): number {
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
  //分開單獨計算
  calculateDeliveryDataSingle(data: any): number {
    var actual_output = 10;
    var plan_output = -10;
    if (
      IsNotUndefined(data.plan_output) &&
      IsNotUndefined(data.actual_output)
    ) {
      plan_output = data.plan_output;
      actual_output = data.actual_output;
    }

    return (actual_output / plan_output) * 100;
  }

  calculateeQualityDataSingle(data: any): number {
    var passed_qty = 10;
    var total_qty = -10;
    if (IsNotUndefined(data.passed_qty) && IsNotUndefined(data.total_qty)) {
      passed_qty = data.passed_qty;
      total_qty = data.total_qty;
    }

    return (passed_qty / total_qty) * 100;
  }

  calculateEfficiencyDataSingle(data: any): number {
    var std_hr = 10;
    var total_hr = -10;
    if (IsNotUndefined(data.std_hr) && IsNotUndefined(data.total_hr)) {
      std_hr = data.std_hr;
      total_hr = data.total_hr;
    }

    return (std_hr / total_hr) * 100;
  }
}
