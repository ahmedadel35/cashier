import { Component, OnInit, Inject, AfterContentInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Bill } from '../../interfaces/bill';

@Component({
    selector: 'app-print-bill',
    templateUrl: './print-bill.component.html',
    styleUrls: ['./print-bill.component.scss']
})
export class PrintBillComponent implements AfterContentInit {
    constructor(
        public dialogRef: MatDialogRef<PrintBillComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngAfterContentInit(): void {
        setTimeout(() => window.print(), 500);
    }

    printAgain() {
        setTimeout(() => window.print(), 200);
    }

    printCmd() {}
}
