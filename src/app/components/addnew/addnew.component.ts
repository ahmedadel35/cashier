import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Brand } from '../../interfaces/brand';
import { Type } from '../../interfaces/type';
import { ApiService } from '../../services/api.service';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-addnew',
    templateUrl: './addnew.component.html',
    styleUrls: ['./addnew.component.scss']
})
export class AddnewComponent implements OnInit {
    public result: {
        obj?: Type | Brand;
        isBrand?: boolean;
        updated?: boolean;
        oldTypeId?: number;
        changedTypeId?: boolean;
    } = {};
    public isBrand = false;
    public types: Type[] = [];
    public isLoading = false;
    public isEdit = false;
    public obj: Type | Brand;

    // form props
    public typeId: number;
    public name: string;
    public price?: number;

    @ViewChild('addTypeOrBrand') form: NgForm;

    constructor(
        public dialogRef: MatDialogRef<AddnewComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private api: ApiService
    ) {
        const d = this.data;
        this.isBrand = d.brand;
        this.types = d.types;

        this.result.isBrand = d.brand;
        this.result.updated = d.edit;
        if (d.edit) {
            this.isEdit = true;
            this.obj = d.edit;
            const ed: Brand = d.edit;
            if (this.isBrand) {
                this.typeId = ed.typeId;
                this.result.oldTypeId = ed.typeId;
                this.price = ed.price;
            }
            this.name = ed.name;
        }
    }

    ngOnInit(): void {}

    save(f): void {
        if (this.isLoading || !f.name || !f.name.length) {
            return;
        }

        const httpMethod = this.isEdit ? 'put' : 'post';

        this.isLoading = true;
        const obj = {
            name: f.name,
            typeId: null,
            price: null
        };

        if (this.isBrand) {
            const url = this.isEdit
                ? `brand/${this.obj.id}`
                : `type/${f.typeId}`;
            obj.typeId = f.typeId;
            obj.price = f.price || 0;

            this.api[httpMethod](url, obj).subscribe(
                (r: Brand) => {
                    // console.log(r);
                    this.isLoading = false;
                    this.result.obj = r;
                    this.typeId = null;
                    this.name = '';
                    this.price = null;
                    this.close();
                },
                err => {
                    console.log(err);
                    this.isLoading = false;
                }
            );
        } else {
            const url = this.isEdit ? `type/${this.obj.id}` : `type`;
            this.api[httpMethod](url, obj).subscribe(
                (r: Type) => {
                    this.isLoading = false;
                    // console.log(r);
                    this.result.obj = r;
                    this.name = '';
                    this.close();
                },
                err => {
                    console.log(err);
                    this.isLoading = false;
                }
            );
        }
    }

    close() {
        if (this.result.obj) {
            this.result.changedTypeId =
                this.result.oldTypeId !== (this.result.obj as Brand).typeId;
        }
        this.dialogRef.close(this.result);
    }
}
