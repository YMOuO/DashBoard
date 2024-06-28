import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  deliveryData: any;
  qualityData: any;
  efficiencyData: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('assets/mock_data.json').subscribe((data: any) => {
      this.deliveryData = this.calculateDeliveryData(data);
      this.qualityData = this.calculateQualityData(data);
      this.efficiencyData = this.calculateEfficiencyData(data);
    });
  }

  calculateDeliveryData(data: any): any {
    // 計算交付率的邏輯
  }

  calculateQualityData(data: any): any {
    // 計算質量率的邏輯
  }

  calculateEfficiencyData(data: any): any {
    // 計算效率的邏輯
  }
}
