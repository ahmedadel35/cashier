import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    public serverPath = 'http://localhost/cx/public/api/';

    constructor(private http: HttpClient) {}

    getHeaders(): HttpHeaders {
        const h = new HttpHeaders();
        h.append('Content-Type', 'application/x-www-form-urlencoded');
        h.append('Response-Type', 'application/json; charset=utf-8');
        h.append('Accept', 'application/json');
        h.append('Access-Control-Allow-Origin', '*');

        return h;
    }

    get(url: string): Observable<{} | any> {
        return this.http.get(this.serverPath + url, {
            headers: this.getHeaders()
        });
    }

    post(url: string, data: any) {
        return this.http.post(this.serverPath + url, data, {
            headers: this.getHeaders()
        });
    }

    put(url: string, data: any) {
        return this.http.put(this.serverPath + url, data, {
            headers: this.getHeaders()
        });
    }

    delete(url: string) {
        return this.http.delete(this.serverPath + url, {
            headers: this.getHeaders()
        });
    }
}
