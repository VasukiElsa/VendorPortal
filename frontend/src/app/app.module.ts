import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RfqComponent } from './rfq/rfq.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import { SafeUrlPipe } from './safe-url.pipe';
import { GoodsReceiptComponent } from './goods-receipt/goods-receipt.component';
import { VendorAgingComponent } from './vendor-aging/vendor-aging.component';
import { VendorMemoComponent } from './vendor-memo/vendor-memo.component';
import { LoadingComponent } from './shared/loading.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    RfqComponent,
    PurchaseOrderComponent,
    InvoiceDetailsComponent,
    PdfViewerComponent,
    SafeUrlPipe,
    GoodsReceiptComponent,
    VendorAgingComponent,
    VendorMemoComponent,
    LoadingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
