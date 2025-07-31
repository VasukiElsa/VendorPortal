import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RfqComponent } from './rfq/rfq.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component'; 
import { GoodsReceiptComponent } from './goods-receipt/goods-receipt.component';
import { VendorAgingComponent } from './vendor-aging/vendor-aging.component';
import { VendorMemoComponent } from './vendor-memo/vendor-memo.component';
import { AuthGuard } from './shared/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'rfq', 
    component: RfqComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'purchase-order', 
    component: PurchaseOrderComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'invoice-details', 
    component: InvoiceDetailsComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'pdf-viewer/:invoiceNumber', 
    component: PdfViewerComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'goods-receipt', 
    component: GoodsReceiptComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'vendor-aging', 
    component: VendorAgingComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'vendor-memo', 
    component: VendorMemoComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
