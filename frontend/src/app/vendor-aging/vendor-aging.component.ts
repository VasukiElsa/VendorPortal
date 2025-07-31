import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-vendor-aging',
  templateUrl: './vendor-aging.component.html',
  styleUrls: ['./vendor-aging.component.css']
})
export class VendorAgingComponent implements OnInit {
  agingData: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('username');
    if (!userId) {
      alert('User not logged in');
      return;
    }

    const params = new HttpParams().set('userId', userId);

    this.http.get<any[]>('http://localhost:3000/vendor-payments/get-vendor-aging', { params })
      .subscribe({
        next: (data) => {
          this.agingData = data;
          console.log('Vendor Aging Data:', data);
        },
        error: (err) => {
          console.error('Failed to fetch vendor aging data', err);
        }
      });
  }

  convertSAPDate(sapDateString: string): string {
  const match = sapDateString?.match(/\d+/);
  if (!match) return '';
  const date = new Date(parseInt(match[0], 10));
  return date.toLocaleDateString();
}
}
