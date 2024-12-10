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

  private logoImage: string = 'public/logo.png';  private specialInstructions: string | undefined;
  customerName: any;
  soupTypeNames: { [key: string]: string } = {
    sichuan_spicy: 'Sichuan Spicy Broth',
    chongqing_spicy: 'Chongqing Spicy Broth',
    milky_broth: 'Milky Mala Broth',
    tomato: 'Tomato Broth',
    wild_mushroom: 'Wild Mushroom Broth'
  };
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

  checkout() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';

    this.dialog.open(this.receiptDialog, dialogConfig);
  }

  generateQRCode() {
    try {
      // Replace with your actual payment URL or data
      const paymentUrl = 'https://pay.ababank.com/bVH6Ad2ZPvdhGdJd8';
      const qr = QRCode(0, 'H');
      qr.addData(paymentUrl);
      qr.make();
      this.qrCodeUrl = qr.createDataURL(8);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  }

  generatePDF() {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // White background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, 'F');

    // Add logo
    if (this.logoImage) {
      try {
        doc.addImage(this.logoImage, 'SVG', 20, 10, 30, 30);      } catch (err) {
        console.error('Error adding logo:', err);
      }
    }

    // Header
    doc.setFontSize(20);
    doc.setTextColor(220, 20, 60);
    doc.setFont('helvetica', 'bold');
    doc.text('KaiXin Official Receipt', 105, 25, { align: 'center' });

    // Customer Name Header
    doc.setFontSize(14);
    doc.setTextColor(220, 20, 60);
    doc.text(`Customer Name: ${this.customerName}`, 20, 50);
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
        doc.text([specialInstructions, iceLevel, spiceLevel].filter(Boolean).join(' | '), 20, yOffset);
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

    // Generate file name with date and time
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    const formattedTime = `${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}-${now.getSeconds().toString().padStart(2, '0')}`;
    const fileName = `KaiXin_Receipt_${formattedDate}_${formattedTime}.pdf`;

    // Save PDF
    doc.save(fileName);
  }

  confirmOrder() {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.width = '600px';

  this.dialog.closeAll()
  this.dialog.open(this.finalConfirmationDialog, dialogConfig);
}
}
