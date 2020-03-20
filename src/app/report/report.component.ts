import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Bill } from '../interfaces/bill';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

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

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.data.filter = filterValue.trim().toLowerCase();

        if ((this.data as MatTableDataSource<Bill>).paginator) {
            (this.data as MatTableDataSource<Bill>).paginator.firstPage();
        }
    }
}
