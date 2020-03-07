import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public serverPath = 'http://cx.test/';
  private Headers: HttpHeaders;

  constructor(private http: HttpClient) {
      const h = new HttpHeaders();
      h.append('Content-Type', 'application/x-www-form-urlencoded');
      h.append('Response-Type', 'application/json; charset=utf-8');

  }

   get(url: string): Observable<{} | any> {
    return this.http.get(this.serverPath + url, {headers: this.Headers});
  }

  post(url: string, data: any) {
    return this.http.post(this.serverPath + url, data, {headers: this.Headers});
  }

  put(url: string, data: any) {
    return this.http.put(this.serverPath + url, data, {headers: this.Headers});
  }

  async delete(url: string) {
    const d = await this.http.delete(this.serverPath + url, {headers: this.Headers});

    console.log(d);

    d.subscribe(
      (x: { deleted: boolean }) => {
        if (x && x.deleted) {
          return true;
        } else {
          return false;
        }
      },
      err => {
        console.log(err);
        return false;
      }
    );
  }
}
