import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements OnInit {
  pdfUrl: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const invoiceNumber = this.route.snapshot.paramMap.get('invoiceNumber');
    this.pdfUrl = `http://localhost:3000/invoice/pdf/${invoiceNumber}`;
  }
}
