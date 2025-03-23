import { Component, OnInit } from '@angular/core';
import { PromotionService } from 'src/app/services/promotion.service'; // Ensure this service exists and is correctly imported
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-voucher-list',
  standalone: false,
  templateUrl: './voucher-list.component.html',
  styleUrls: ['./voucher-list.component.css'],
  providers: [DatePipe]
})
export class VoucherListComponent implements OnInit {

  vouchers: any[] = [];

  constructor(
    private promotionService: PromotionService,
    private datePipe: DatePipe // Inject DatePipe
  ) {}

  ngOnInit() {
    // Load vouchers from promotionService
    this.loadVouchers();
  }

  // Fetch voucher data from promotionService
  loadVouchers() {
    this.promotionService.getPromotions().subscribe({
      next: (vouchers: any[]) => {
        // Process each voucher to adjust the promotion percent
        this.vouchers = vouchers.map(voucher => ({
          ...voucher,
          discount_percent: this.convertPromoPercent(voucher.discount_percent),
          formattedEndDate: this.formatEndDate(voucher.end_date) // Format the date
        }));
      },
      error: (err) => {
        console.error('Error loading vouchers:', err);
      }
    });
  }

  // Convert promotion percentage from decimal to integer (multiply by 100 for display)
  convertPromoPercent(decimalPercent: any): number {
    // Check if the value is an object and has the $numberDecimal property
    if (typeof decimalPercent === 'object' && decimalPercent.$numberDecimal) {
      decimalPercent = decimalPercent.$numberDecimal;
    }

    // Safely parse the decimal value
    const percent = parseFloat(decimalPercent);
    if (isNaN(percent)) {
      return 0; // Return 0 if the value is invalid
    }

    return percent * 100; // Convert and multiply by 100 for display
  }

  // Format end date to 'dd/MM/yyyy'
  formatEndDate(endDate: string): string {
    // Use DatePipe to format the date
    return this.datePipe.transform(endDate, 'dd/MM/yyyy') || '';
  }

  // Save voucher functionality
  saveVoucher(voucher: any, event: Event) {
    const button = event.target as HTMLButtonElement;
    button.innerText = "Đã lưu";
    button.style.background = "#f0f8f0"; 
    button.style.color = "#063B06"; 
    button.style.cursor = "default";
    button.disabled = true;
  }

}
