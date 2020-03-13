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
    // public types: Type[] = [];
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
        this.brandData = [];
        this.active = null;

        this.data = d.filter(x => Array.isArray(x.brands) && x.brands.length);

        d.forEach(x => {
            if (x.brands && x.brands.length) {
                x.brands.map(b => this.brands.push(b));
            }
        });
    }

    setHeat(h, brand: Brand) {
        if (this.edit) {
            return;
        }

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

    removeBrand(b: Brand) {
        this.loader = true;

        this.api.delete(`brand/${b.id}`).subscribe(
            (x: { delete: boolean }) => {
                if (x && x.delete) {
                    // remove from list
                    this.allTypes.map(c => {
                        if (c.id === b.typeId) {
                            c.brands = c.brands.filter(r => r.id !== b.id);
                        }
                        return c;
                    });

                    this.doCalc();
                    this.loader = false;
                } else {
                    this.loader = false;
                    return false;
                }
            },
            err => {
                this.loader = false;
                console.log(err);
            }
        );
    }

    removeType(t: Type) {
        this.loader = true;

        this.api.delete(`type/${t.id}`).subscribe(
            (x: { delete: boolean }) => {
                if (x && x.delete) {
                    this.allTypes = this.allTypes.filter(r => r.id !== t.id);

                    this.doCalc();
                }
                this.loader = false;
            },
            err => {
                this.loader = false;
                console.log(err);
            }
        );
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

        dialogRef
            .afterClosed()
            .subscribe(
                (r: {
                    obj?: Type | Brand;
                    isBrand?: boolean;
                    updated?: boolean;
                    oldTypeId?: number;
                    changedTypeId?: boolean;
                }) => {
                    this.loader = true;

                    // check if it was an update dialog
                    if (r.updated) {
                        // check if this is a brand
                        if (r.isBrand) {
                            const obj: Brand = r.obj as Brand;

                            this.allTypes.map(x => {
                                // check if user changed brand type
                                if (r.changedTypeId) {
                                    if (x.id === r.oldTypeId) {
                                        // remove from old type brands
                                        x.brands = x.brands.filter(
                                            b => b.id !== x.id
                                        );
                                    } else if (x.id === obj.typeId) {
                                        // add to new type brands
                                        x.brands.push(obj);
                                    }
                                } else {
                                    // if user did not change brand type
                                    if (x.id === obj.typeId) {
                                        // update current brand
                                        x.brands.map(b => {
                                            if (b.id === obj.id) {
                                                b.name = obj.name;
                                                b.price = obj.price;
                                                b.updated_at = obj.updated_at;
                                            }
                                        });
                                    }
                                }
                                return x;
                            });
                        } else {
                            // if obj is type
                            const obj: Type = r.obj;

                            this.allTypes.map(t => {
                                if (t.id === obj.id) {
                                    t.name = obj.name;
                                }
                            });
                        }
                    } else {
                        // if user added new brand
                        if (r.isBrand) {
                            const obj: Brand = r.obj as Brand;
                            this.allTypes.map(t => {
                                if (t.id === obj.typeId) {
                                    t.brands.push(obj);
                                }
                                return t;
                            });
                        } else {
                            // user added new type
                            (r.obj as Type).brands = [];
                            this.allTypes.push(r.obj);
                        }
                    }

                    this.doCalc();
                    this.loader = false;
                }
            );
    }
}
