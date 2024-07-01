export interface ManufacturingData {
  date: string;
  product_code: number;
  actual_output: number;
  plan_output: number;
  passed_qty: number;
  total_qty: number;
  std_hr: number;
  total_hr: number;
  failed_qty: number;
  efficiency: number;
  delivery: number;
  quality: number;
}
