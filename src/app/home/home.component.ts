import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { HttpClient } from '@angular/common/http';
import { Type } from '../interfaces/type';
import { Brand } from '../interfaces/brand';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public data: Type[] = [];
  public types: Type[] = [];
  public brands: Array<Brand[]> = [];
  public date = '';

  constructor(private api: ApiService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.api.get('all').subscribe((d: Type[]) => {
      this.data = d;

      this.types = d.map(x => {
        if (x.brands[0]) {
            this.brands[x.brands[0].typeId] = x.brands;
        }
        delete x.brands;
        return x;
      });

      this.brands.shift();

      console.log(this.types, this.brands);
    });
  }

  log() {
      console.log(this.date);
  }
}
