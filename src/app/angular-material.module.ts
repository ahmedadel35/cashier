import { NgModule } from '@angular/core';

import { LayoutModule } from '@angular/cdk/layout';

//
// Form Controls
//

// import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
// import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
// import { MatGridListModule } from '@angular/material/grid-list';
// import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatSliderModule } from '@angular/material/slider';
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import {
    MomentDateAdapter,
    MAT_MOMENT_DATE_ADAPTER_OPTIONS
} from '@angular/material-moment-adapter';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE
} from '@angular/material/core';
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatMomentDateModule } from '@angular/material-moment-adapter';

export const MY_FORMATS = {
    parse: { dateInput: 'dddd D MMMM YYYY' },
    display: {
        dateInput: 'dddd D MMMM YYYY',
        // monthYearLabel: 'MMM YYYY',
        // dateA11yLabel: 'LL',
        // monthYearA11yLabel: 'MMMM YYYY'
    }
};

//
// Navigation
//

const modules: any[] = [
    LayoutModule,

    // MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    // MatRadioModule,
    MatSelectModule,
    // MatGridListModule,
    // MatSliderModule,
    // MatSlideToggleModule,
    MatListModule,
    MatButtonModule,
    // MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonToggleModule,
    MatTableModule,
    MatMenuModule,
    MatDialogModule,
    // MatProgressSpinnerModule,
    // MatNativeDateModule,
    // MatMomentDateModule,
];

@NgModule({
    imports: [...modules],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'ar-EG' },
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
    ],
    exports: [...modules]
})
export class AngularMaterialModule {}
