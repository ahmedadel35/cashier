import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../services/api.service';
import { HttpClient } from '@angular/common/http';
import { Type } from '../interfaces/type';
import { Brand } from '../interfaces/brand';
import { MatInput } from '@angular/material/input';
import { NgForm } from '@angular/forms';
import { Bill } from '../interfaces/bill';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddnewComponent } from '../components/addnew/addnew.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    public data: Type[] = [];
    public brandData: Brand[] = [];
    public bills: Bill[] = [];
    public types: Type[] = [];
    public allTypes: Type[] = [];
    public brands: Brand[] = [];
    public active: number;
    public heat = '';
    private currentTypeId: number;
    private currentBrandId: number;
    public sum: number = 0;

    // form props
    public date = '';
    public price: number;
    public amount: number;

    @ViewChild('amountEl') amountEl: ElementRef;

    constructor(private api: ApiService, public dialog: MatDialog) {}

    ngOnInit(): void {
        this.date = new Date().toISOString();
        this.loadData();
    }

    loadData() {
        this.api.get('all').subscribe((d: Type[]) => {
            this.allTypes = [...d];
            this.data = d.filter(
                x => Array.isArray(x.brands) && x.brands.length
            );

            d.forEach(x => {
                if (x.brands.length) {
                    x.brands.map(b => this.brands.push(b));
                }
            });
        });
    }

    setHeat(h, brand: Brand) {
        // console.log(h);
        this.heat = h;
        this.amount = null;
        this.amountEl.nativeElement.focus();
        this.price = brand.price || 0;
        this.currentBrandId = brand.id;
    }

    addBill(f) {
        const bill: Bill = {
            typeId: this.currentTypeId,
            brandId: this.currentBrandId,
            state: this.heat,
            quantity: f.amount,
            price: f.price,
            value: Number((f.amount * f.price).toFixed(2)),
            created_at: f.date
        };

        // console.log(bill);
        this.bills.push(bill);
        this.amount = null;
        this.showSum();
    }

    showSum() {
        const bills = [...this.bills];
        // @ts-ignore
        const x = bills.reduce(
            (c, a) => {
                c.value += a.value;
                return c;
            },
            { value: 0 }
        );

        if (this.bills.length > 1) {
            this.sum = Number(x.value.toFixed(2));
        }
    }

    openBrand(t: Type, inx: number) {
        this.active = inx;
        this.brandData = this.data[inx].brands;
        this.currentTypeId = t.id;
        // console.log(this.bills);
    }

    getTypeName(typeId: number) {
        return this.data.filter(x => x.id === typeId)[0].name;
    }

    getBrandName(brandId: number) {
        return this.brands.filter(x => x.id === brandId)[0].name;
    }

    getState(state: string) {
        return state === 'hot' ? 'ساخن' : 'بارد';
    }

    addType() {
        this.dialogOpen(false);
    }

    addBrand() {
        this.dialogOpen(true);
    }

    dialogOpen(isBrand: boolean = false) {
        this.dialog.open(AddnewComponent, {
            width: '50%',
            disableClose: true,
            data: {
                brand: isBrand,
                types: this.allTypes
            }
        });
    }
}
