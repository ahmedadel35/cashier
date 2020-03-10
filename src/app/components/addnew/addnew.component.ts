import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Brand } from '../../interfaces/brand';
import { Type } from '../../interfaces/type';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-addnew',
    templateUrl: './addnew.component.html',
    styleUrls: ['./addnew.component.scss']
})
export class AddnewComponent implements OnInit {
    public isBrand = false;
    public types: Type[] = [];
    public typeId: number;
    public name: string;
    public isLoading = false;

    constructor(
        public dialogRef: MatDialogRef<AddnewComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private api: ApiService
    ) {
        this.isBrand = this.data.brand;
        this.types = this.data.types;
    }

    ngOnInit(): void {
        // console.log(this.dialogRef.id);
        // console.log(this.data);
    }

    save(f) {
        const obj = {
            name: f.name,
            typeId: null
        };

        if (this.isBrand) {
            obj.typeId = f.typeId;
        }

        console.log(obj);

        this.api.post('type', obj).subscribe(r => {
            console.log(r);
        }, err => console.log(err));
    }

    close() {
        this.dialogRef.close();
    }
}
