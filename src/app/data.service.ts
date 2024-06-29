import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ManufacturingData } from './data.model'; // 引入接口

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dataUrl = 'assets/mock_data.json'; // 更新為您的JSON文件的路徑

  constructor(private http: HttpClient) {}

  getData(): Observable<any[]> {
    return this.http.get<any[]>(this.dataUrl);
  }

  calculateDeliveryData(data: any): any {
    console.log(
      'h',
      data.actual_output,
      data.plan_output,
      'OuO',
      typeof data.actual_output,
      typeof data.plan_output
    );
    var lod = [];
    for (var i = 0; i < data.length; i++) {
      var actualOutput = 1.0;
      var planOutput = 1.0;
      if (typeof data[i].actual_output !== 'undefined') {
        actualOutput = data[i].actual_output;
      }
      if (typeof data[i].plan_output !== 'undefined') {
        planOutput = data[i].plan_output;
      }
      lod.push((actualOutput / planOutput) * 100);
    }

    return lod;
  }

  calculateQualityData(data: any): number {
    const passedQty = data.passed_qty;
    const totalQty = data.total_qty;
    return (passedQty / totalQty) * 100;
  }

  calculateEfficiencyData(data: any): number {
    const stdHr = data.std_hr;
    const totalHr = data.total_hr;
    return (stdHr / totalHr) * 100;
  }
}
