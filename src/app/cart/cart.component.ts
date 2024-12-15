import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from './cart.service';
import { CartItem } from './cart-item.interface';
import { MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { jsPDF } from 'jspdf';
import { FormsModule } from '@angular/forms';
import QRCode from 'qrcode-generator';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule],
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  total: number = 0;
  paymentMethod: 'cash' | 'khqr' = 'cash';
  qrCodeUrl: string = '';

  @ViewChild('receiptDialog', { static: true }) receiptDialog!: TemplateRef<any>;
    @ViewChild('finalConfirmationDialog', { static: true }) finalConfirmationDialog!: TemplateRef<any>;
  @ViewChild('emailDialog', { static: true }) emailDialog!: TemplateRef<any>;

  private specialInstructions: string | undefined;
  customerName: any;
  soupTypeNames: { [key: string]: string } = {
    sichuan_spicy: 'Sichuan Spicy Broth',
    chongqing_spicy: 'Chongqing Spicy Broth',
    milky_broth: 'Milky Mala Broth',
    tomato: 'Tomato Broth',
    wild_mushroom: 'Wild Mushroom Broth'
  };
  customerEmail: string = '';


  constructor(private cartService: CartService, private dialog: MatDialog) {}

  ngOnInit() {
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.items = items;
        this.calculateTotal();
      },
      error: (error) => {
        console.error('Error fetching cart items:', error);
      }
    });

    // Generate QR Code for payment
    this.generateQRCode();
  }

  calculateTotal() {
    this.total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  updateQuantity(index: number, quantity: number) {
    if (quantity > 0) {
      this.cartService.updateQuantity(index, quantity);
    }
  }

  removeItem(index: number) {
    this.cartService.removeItem(index);
  }

sendReceiptEmail(dialogRef: MatDialogRef<any>) {
  if (this.customerEmail) {
    // Generate PDF blob
    const pdfBlob = this.generatePDF();

    const formData = new FormData();
    formData.append('pdf', pdfBlob, 'receipt.pdf');
    formData.append('customerEmail', this.customerEmail);
    formData.append('items', JSON.stringify(this.items));
    formData.append('total', this.total.toString());
    formData.append('paymentMethod', this.paymentMethod);

    // Add error handling for network issues
    fetch('http://localhost:3000/api/send-order-email', { // Make sure to use the correct server URL
      method: 'POST',
      body: formData
    })
    .then(async response => {
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Server response:', text);
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send email');
      }

      return data;
    })
    .then(data => {
      console.log(`Email sent to ${this.customerEmail}`);
      dialogRef.close();
      this.cartService.clearCart();
      alert('Receipt has been sent to your email!');
    })
    .catch(error => {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again.');
    });
  } else {
    console.error('Email address is required');
    alert('Please enter a valid email address');
  }

}

  checkout() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';

    this.dialog.open(this.receiptDialog, dialogConfig);
  }

  generateQRCode() {
    try {
      const paymentUrl = 'https://pay.ababank.com/bVH6Ad2ZPvdhGdJd8';
      const qr = QRCode(0, 'H');
      qr.addData(paymentUrl);
      qr.make();
      this.qrCodeUrl = qr.createDataURL(8);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  }

  generatePDF(): Blob {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // White background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, 'F');

    // Header
    doc.setFontSize(20);
    doc.setTextColor(220, 20, 60);
    doc.setFont('helvetica', 'bold');
    doc.text('KaiXin Official Receipt', 105, 25, { align: 'center' });

    // Customer Name Header
    doc.setFontSize(14);
    doc.setTextColor(220, 20, 60);
    doc.text(`Customer Name: ${this.customerName || 'Guest'}`, 20, 50);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 50);

    // Table Headers
    doc.setFontSize(10);
    doc.setTextColor(220, 20, 60);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Item', 20, 60);
    doc.text('Quantity', 80, 60);
    doc.text('Price', 120, 60);
    doc.text('Subtotal', 160, 60);

    // Separator
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(20, 65, 190, 65);

    // Order Items
    doc.setFont('helvetica', 'normal');
    let yOffset = 75;
    this.items.forEach((item) => {
      const subtotal = item.quantity * item.price;

      // Additional details
      const specialInstructions = item.specialInstructions ? `Note: ${item.specialInstructions}` : '';
      const iceLevel = item.iceLevel ? `Ice: ${item.iceLevel}` : '';
      const spiceLevel = item.spiceLevel ? `Spice: ${item.spiceLevel}` : '';
      const iced = item.iced ? 'Iced' : '';
      const toppings = item.topping ? `Toppings: ${item.topping}` : '';
      const soupType = item.soupType ? `Soup Type: ${this.soupTypeNames[item.soupType]}` : '';

      doc.setTextColor(0, 0, 0);
      doc.text(item.title, 20, yOffset);
      doc.text(item.quantity.toString(), 80, yOffset);
      doc.text(`$${item.price.toFixed(2)}`, 120, yOffset);
      doc.text(`$${subtotal.toFixed(2)}`, 160, yOffset);

      // Additional item details on next line
      if (this.specialInstructions || iceLevel || spiceLevel) {
        yOffset += 6;
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text([specialInstructions, iceLevel, spiceLevel, iced, toppings, soupType].filter(Boolean).join(' | '), 20, yOffset);
        doc.setFontSize(10);
      }

      yOffset += 10;
    });

    // Separator
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(20, yOffset, 190, yOffset);

    // Totals
    yOffset += 10;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Subtotal:', 120, yOffset);
    doc.text(`$${this.total.toFixed(2)}`, 160, yOffset);

    yOffset += 6;
    doc.setFont('helvetica', 'normal');
    doc.text('Tax (10%):', 120, yOffset);
    doc.text(`$${(this.total * 0.1).toFixed(2)}`, 160, yOffset);

    yOffset += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', 120, yOffset);
    doc.text(`$${(this.total * 1.1).toFixed(2)}`, 160, yOffset);

    // Payment Method
    yOffset += 15;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(`Payment Method: ${this.paymentMethod.toUpperCase()}`, 20, yOffset);

    // Footer
    yOffset = 280;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for your purchase!', 105, yOffset, { align: 'center' });

    // Return the PDF as a Blob
    const pdfBlob = doc.output('blob');

    // Create a download link and trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(pdfBlob);
    link.download = 'receipt.pdf';
    link.click();

    // Return the PDF as a Blob
    return doc.output('blob');
  }

  confirmOrder() {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.width = '600px';

  this.dialog.closeAll()
  this.dialog.open(this.finalConfirmationDialog, dialogConfig);
}

  sendEmail() {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.width = '400px';

  this.dialog.open(this.emailDialog, dialogConfig);
  }

}
