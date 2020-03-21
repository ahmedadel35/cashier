import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Type } from '../interfaces/type';
import { Brand } from '../interfaces/brand';
import { Bill } from '../interfaces/bill';
import { MatDialog } from '@angular/material/dialog';
import { AddnewComponent } from '../components/addnew/addnew.component';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PrintBillComponent } from '../components/print-bill/print-bill.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    private ERROR_MESS = 'حدث خطأ غير متوقع ، برجاء إعادة المحاولة لاحقاً';
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
    public sum: {
        value?: number;
        amount?: number;
        price?: number;
    } = {};
    public edit = false;
    public editBill = false;
    public activeBillIndex?: number = null;
    public isSavingBill = false;

    // form props
    public date: any;
    public price: number;
    public amount: number;

    @ViewChild('amountEl') amountEl: ElementRef;

    constructor(
        private api: ApiService,
        public dialog: MatDialog,
        private snakeBar: MatSnackBar
    ) {}

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
        this.editBill = false;

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
            value: Number((f.amount * f.price).toFixed(2))
            // date: f.date
        };

        this.bills.push(bill);
        this.amount = null;
        this.showSum();
    }

    showSum() {
        this.sum.amount = this.sum.price = this.sum.value = 0;

        if (this.bills.length) {
            this.bills.forEach((x: Bill) => {
                this.sum.amount += x.quantity;
                this.sum.price += x.price;
                this.sum.value += x.value;
            });

            this.sum.value = Number(this.sum.value.toFixed(2));
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
                this.edit = false;
            },
            err => {
                this.loader = false;
                this.edit = false;
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
                this.edit = false;
            },
            err => {
                this.loader = false;
                this.edit = false;
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
                    this.edit = false;
                }
            );
    }

    editOneBill(b: Bill, inx: number) {
        this.editBill = true;
        this.activeBillIndex = inx;
        this.amount = b.quantity;
        this.heat = b.state;
        this.price = b.price;
    }

    updateBill(b: Bill, inx: number) {
        this.editBill = false;
        b.state = this.heat;
        b.quantity = this.amount;
        b.price = this.price;
        b.value = Number((this.amount * this.price).toFixed(2));

        this.bills[inx] = b;
        this.showSum();

        // reset globals
        this.heat = null;
        this.amount = this.price = null;
    }

    updateHeat(h: string) {
        this.heat = h;
    }

    saveBill() {
        this.isSavingBill = true;
        const date = moment(this.date).format('dddd DD MMMM YYYY [،] hh:mm a');
        const bills = [...this.bills];
        bills.map(x => {
            x.created_at = this.getBrandName(x.brandId);
            x.state = this.getState(x.state);
            return x;
        });
        console.log(bills);

        this.showSum();

        const printDialogRef = this.dialog.open(PrintBillComponent, {
            data: {
                bills,
                sum: this.sum.value,
                date,
                isBill: true
            },
            width: '100%'
        });

        printDialogRef.afterOpened().subscribe(r => {
            (document.querySelector(
                '.cdk-overlay-pane'
            ) as HTMLDivElement).style.maxWidth = '100%';
            (document.querySelector(
                '.cdk-overlay-pane'
            ) as HTMLDivElement).style.height = '100%';
        });

        this.isSavingBill = false;

        this.bills = [];

        // show alert that saving was success
        // this.showFeedback('تم الحفظ بنجاح');

        return;
        this.api.post('bill', this.bills).subscribe(
            (r: { saved: boolean }) => {
                if (r && r.saved) {
                    this.bills = [];

                    // show alert that saving was success
                    this.showFeedback('تم الحفظ بنجاح');
                } else {
                    this.showFeedback(this.ERROR_MESS, true);
                }
                this.isSavingBill = false;
            },
            err => {
                // console.log(err);
                this.showFeedback(this.ERROR_MESS, true);
                this.isSavingBill = false;
            }
        );
    }

    deleteOrStopEditing(inx: number): void {
        if (this.editBill && this.activeBillIndex === inx) {
            this.editBill = false;
            return;
        }

        // it`s a delete bill action
        this.bills.splice(inx, 1);

        this.showSum();
    }

    private showFeedback(mess: string, isError: boolean = false) {
        this.snakeBar.open(mess, null, {
            duration: 2500,
            panelClass: [
                isError ? 'bg-danger' : 'bg-success',
                'text-center',
                'font-weight-bolder'
            ]
        });
    }
}
