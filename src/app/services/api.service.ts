import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public serverPath = 'http://cx.test/';

  constructor(private http: HttpClient) { }

  get() {
    this.http.get(this.serverPath).subscribe(r => {
      console.log(r);
    }, err => console.log(err));
  }
}
