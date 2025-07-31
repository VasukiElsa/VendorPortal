import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-vendor-memo',
  templateUrl: './vendor-memo.component.html',
  styleUrls: ['./vendor-memo.component.css']
})
export class VendorMemoComponent implements OnInit {
  memos: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('username');
    if (!userId) {
      alert('User not logged in');
      return;
    }

    const params = new HttpParams().set('userId', userId);

    this.http.get<any[]>('http://localhost:3000/vendor-memo/get-vendor-memos', { params })
      .subscribe({
        next: (res) => {
          this.memos = res;
          console.log('Memo Data:', res);
        },
        error: (err) => {
          console.error('Failed to fetch vendor memo data', err);
        }
      });
  }

  convertSAPDate(sapDate: string): string {
    const match = sapDate?.match(/\d+/);
    if (!match) return '';
    const date = new Date(parseInt(match[0], 10));
    return date.toLocaleDateString();
  }
}
