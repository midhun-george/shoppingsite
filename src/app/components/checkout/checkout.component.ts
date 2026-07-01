import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../services/shop.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  // 🏢 Replace this with your actual Google Pay / UPI ID string
  upiId: string = '9544476777-2@ybl'; 
  merchantName: string = 'Midhun George';
  qrCodeUrl: string = '';

  constructor(public shopService: ShopService, private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    // Safety check: redirect them out if their bag is totally empty
    if (this.shopService.cart().length === 0) {
      this.router.navigate(['/shop']);
      return;
    }
    this.generatePaymentQr();
  }

  generatePaymentQr() {
  const totalAmount = this.shopService.cartTotal();
  
  // Construct standard deep-linking UPI URI protocol
  const upiUri = `upi://pay?pa=${this.upiId}&pn=${encodeURIComponent(this.merchantName)}&am=${totalAmount}&cu=INR`;
  
  // 🔄 CHANGED: Switched from the deprecated Google API to the active QRServer API
  this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUri)}`;
}

sendWhatsAppConfirmation() {
  const businessNumber = '9544476777'; // 📱 Replace with your actual WhatsApp business phone number (include country code, no +)
  const message = this.buildReceiptMessage();
  
  // Construct the official WhatsApp deep link API
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${businessNumber}&text=${encodeURIComponent(message)}`;
  
  // Open WhatsApp tab smoothly
  window.open(whatsappUrl, '_blank');
}

sendEmailConfirmation() {
  const businessEmail = 'boutique@example.com'; // ✉️ Replace with your business email
  const subject = `Order Confirmation Request - Midhun`;
  const body = this.buildReceiptMessage();
  
  // Construct standard mailto protocol string
  const mailtoUrl = `mailto:${businessEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  window.location.href = mailtoUrl;
}

private buildReceiptMessage(): string {
  const user = this.authService.getUser();
  let itemDetails = '';
  
  this.shopService.cart().forEach(item => {
    itemDetails += `• ${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}\n`;
  });

  return `✨ *NEW ORDER CONFIRMATION* ✨\n\n` +
         `👤 *CUSTOMER DETAILS:*\n` +
         `• Name: ${user?.name}\n` +
         `• Contact: ${user?.phone}\n\n` +
         `📍 *SHIPPING ADDRESS:*\n` +
         `${user?.address},\n${user?.city} - ${user?.pincode}\n\n` +
         `🛍️ *ORDER SUMMARY:*\n${itemDetails}\n` +
         `💰 *TOTAL AMOUNT PAID:* ₹${this.shopService.cartTotal()}\n\n` +
         `📸 _Attached is my payment screenshot for your verification._`;
}
}
