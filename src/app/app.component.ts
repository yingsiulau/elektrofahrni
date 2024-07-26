import { Component, LOCALE_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';



import { MatNativeDateModule, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import emailjs from 'emailjs-com';
import { CustomDateAdapter } from './custom-date-adapter';
import { CommonModule } from '@angular/common';

// Import locale data
import localeDeCh from '@angular/common/locales/de-CH';
import { registerLocaleData } from '@angular/common';

// Register the locale data
registerLocaleData(localeDeCh);


export const MY_DATE_FORMATS = {
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMM YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
    yearA11yLabel: 'YYYY',
  },
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSnackBarModule,
    MatNativeDateModule // For date formatting
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'de-CH' }, // Set the default locale
    { provide: MAT_DATE_LOCALE, useValue: 'de-CH' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MY_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',

})
export class AppComponent {
  title = 'elektrofahrni';
  form: FormGroup;

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar) {
    this.form = this.fb.group({
      vorname: ['', [Validators.required]],
      nachname: ['', [Validators.required]],
      geburtsdatum: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefon: ['', [Validators.required]],
      adresse: ['', [Validators.required]],
      plz: ['', [Validators.required]],
      ort: ['', [Validators.required]],
      ausbildung: ['', [Validators.required]],
      nachricht: ''
    });
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const date = new Date(this.form.value.geburtsdatum);
      const formattedDate = format(date, 'dd.MM.yyyy', { locale: de });

      console.log(formattedDate);
      const templateParams = {
        vorname: this.form.value.vorname,
        nachname: this.form.value.nachname,
        geburtsdatum: formattedDate,
        email: this.form.value.email,
        telefon: this.form.value.telefon,
        adresse: this.form.value.adresse,
        plz: this.form.value.plz,
        ort: this.form.value.ort,
        ausbildung: this.form.value.ausbildung,
        nachricht: this.form.value.nachricht
      };
      emailjs.send('service_p2cmw3s', 'template_tblhiwf', templateParams, '1AbFLkhB2NiddtDp0')
        .then((response) => {
          console.log('Email sent successfully', response);
          this.openSnackBar('Erfolgreich abgeschickt!', 'Schliessen')
        }, (error) => {
          console.error('Error sending email', error);
          this.openSnackBar('Etwas ist schief gelaufen', 'Schliessen')
        });
    }
  }

  onDateChange(event: any): void {
    const date = event.value;
    console.log(date);
    
    // Optional: hier kannst du weitere Anpassungen oder Validierungen vornehmen
  }


  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}