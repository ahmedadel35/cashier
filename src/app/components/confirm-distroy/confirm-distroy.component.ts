import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-distroy',
  templateUrl: './confirm-distroy.component.html',
  styleUrls: ['./confirm-distroy.component.scss']
})
export class ConfirmDistroyComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmDistroyComponent>) { }

  ngOnInit(): void {
  }

}
