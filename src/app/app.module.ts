import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AddnewComponent } from './components/addnew/addnew.component';
import { ReportComponent } from './report/report.component';
import { ConfirmDistroyComponent } from './components/confirm-distroy/confirm-distroy.component';

import {NgxPrintModule} from 'ngx-print';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AddnewComponent,
    ReportComponent,
    ConfirmDistroyComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    // HttpClientJsonpModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    NgxPrintModule,
  ],
  entryComponents: [
    AddnewComponent,
    ConfirmDistroyComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
