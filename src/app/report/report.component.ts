import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Bill } from '../interfaces/bill';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { isString } from 'util';
import { Type } from '../interfaces/type';
import moment = require('moment');

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
    public loader = false;
    public data: Bill[] | MatTableDataSource<Bill> = [];
    public displayedColumns: string[] = [
        'typeId',
        'brandId',
        'state',
        'quantity',
        'price',
        'value',
        'created_at',
        'id'
    ];

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(private api: ApiService) {}

    ngOnInit(): void {
        this.getData();
    }

    getData() {
        this.loader = true;

        this.api.get('bill').subscribe(
            (r: Bill[]) => {
                console.log(r);
                this.data = new MatTableDataSource(r);

                (this.data as MatTableDataSource<Bill>).filterPredicate = (
                    bill: Bill,
                    str: string
                ) => this.customFilter(bill, str);

                this.data.paginator = this.paginator;
                this.data.sort = this.sort;
                this.loader = false;
            },
            err => {
                console.log(err);
                this.loader = false;
            }
        );
    }

    getStateName(st: string) {
        return st === 'hot' ? 'ساخن' : 'بارد';
    }

    customFilter(bill: Bill, str: string) {
        const type = bill.type.name.trim().toLowerCase();
        const brand = bill.brand.name.trim().toLowerCase();
        const date = bill.created_at.trim().toLowerCase();

        return type.indexOf(str) > -1 || brand.indexOf(str) > -1 || date.indexOf(str) > -1;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        // console.log(filterValue);
        this.data.filter = filterValue.trim().toLowerCase();

        if ((this.data as MatTableDataSource<Bill>).paginator) {
            (this.data as MatTableDataSource<Bill>).paginator.firstPage();
        }
    }

    
}
