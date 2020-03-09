import { Component, OnInit, Input } from '@angular/core';
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
  public brandData: Brand[] = [];
  public types: Type[] = [];
  public brands: Array<Brand[]> = [];
  public date = '';
  public active: number;
  public heat = '';

  constructor(private api: ApiService, private http: HttpClient) {}

  ngOnInit(): void {
    this.date = (new Date()).toISOString();
    this.loadData();
  }

  loadData() {
    this.api.get('all').subscribe((d: Type[]) => {
      d = d.filter(x => Array.isArray(x.brands) && x.brands.length);
      this.data = d;

      // this.types = d.map(x => {
      //   if (x.brands[0]) {
      //       this.brands[x.brands[0].typeId] = x.brands;
      //   }
      //   delete x.brands;
      //   return x;
      // });

      // this.brands.shift();

      // console.log(this.types, this.brands);
    });
  }

  log() {
    console.log(this.date);
    console.log(this.heat);
  }

  setHeat(h) {
    console.log(h);
    this.heat = h;
  }

  openBrand(t: Type, inx: number) {
    // console.log(t, inx, this.data[inx].brands);
    this.active = inx;
    this.brandData = this.data[inx].brands;
  }

  
}
