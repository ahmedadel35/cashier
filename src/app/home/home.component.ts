import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Type } from '../interfaces/type';
import { Brand } from '../interfaces/brand';
import { Bill } from '../interfaces/bill';
import { MatDialog } from '@angular/material/dialog';
import { AddnewComponent } from '../components/addnew/addnew.component';
import * as moment from 'moment';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    public loader = false;
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
    public edit = false;

    // form props
    public date: any;
    public price: number;
    public amount: number;

    @ViewChild('amountEl') amountEl: ElementRef;

    constructor(private api: ApiService, public dialog: MatDialog) {}

    ngOnInit(): void {
        this.date = moment();
        this.loadData();
    }

    loadData() {
        this.loader = true;
        this.api.get('all').subscribe((d: Type[]) => {
            this.allTypes = [...d];
            this.doCalc(d);

            this.loader = false;
        });
    }

    doCalc(d: Type[] = this.allTypes) {
        this.data = d.filter(x => Array.isArray(x.brands) && x.brands.length);

        d.forEach(x => {
            if (x.brands.length) {
                x.brands.map(b => this.brands.push(b));
            }
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
            date: f.date
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

    addType(isEdit: Type = null) {
        this.dialogOpen(false, isEdit);
    }

    addBrand(isEdit: Brand = null) {
        this.dialogOpen(true, isEdit);
    }

    addNewBrand(r: Brand) {
        const hasMore = this.data.some(x => x.id === r.typeId);

        const t = this.allTypes.filter(x => x.id === r.typeId);

        if (!t || !t.length) {
            this.loader = false;
            return;
        }

        // IF type is already has one or more brands
        if (hasMore) {
            this.data.map(x => {
                if (x.id === r.typeId) {
                    x.brands.push(r);
                    this.brands.push(r);
                }
                return x;
            });
        } else {
            // this the first brand for this type
            const type: Type = t[0];

            type.brands.push(r);
            this.types.push(type);
            this.brands.push(r);
            this.data.push(type);
        }
    }

    dialogOpen(isBrand: boolean = false, isEdit?: Type | Brand) {
        // reset type list
        this.brandData = [];
        this.active = null;
        this.currentTypeId = null;

        const dialogRef = this.dialog.open(AddnewComponent, {
            width: '50%',
            disableClose: true,
            data: {
                brand: isBrand,
                edit: isEdit,
                types: isBrand ? this.allTypes : []
            }
        });

        dialogRef.afterClosed().subscribe((r: Brand) => {
            this.loader = true;
            // console.log(r);
            // check if it was an update dialog
            if (r.updated_at === 'true') {
                // check if this is a brand
                if (r.typeId) {
                    this.brands.map(x => {
                        if (x.id === r.id) {
                            x.typeId = r.typeId;
                            x.name = r.name;
                            x.price = r.price;
                        }
                        return x;
                    });
                    if (!isNaN(Number(r.created_at))) {
                        this.addNewBrand(r);

                        // remove brand from old type
                        this.data.map(x => {
                            if (x.id === Number(r.created_at)) {
                                x.brands = x.brands.filter(
                                    b => b.id !== r.id
                                );
                            }
                            return x;
                        });
                    }
                    this.doCalc();
                } else {
                    this.data.map(x => {
                        if (x.id === r.id) {
                            x.name = r.name;
                        }
                        return x;
                    });
                }
            } else {
                this.addNewBrand(r);
            }

            this.loader = false;
        });
    }
}
