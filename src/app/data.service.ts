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

  calculateDeliveryData(data: any): number {
    const actualOutput = data.actual_output;
    const planOutput = data.plan_output;
    return (actualOutput / planOutput) * 100;
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
