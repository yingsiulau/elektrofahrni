import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NativeDateAdapter } from "@angular/material/core";
import { MatButtonModule } from '@angular/material/button';


import { MatNativeDateModule, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { Platform } from '@angular/cdk/platform';
import emailjs from 'emailjs-com';



export class CustomDateAdapter extends NativeDateAdapter {
  constructor(matDateLocale: string) {
    super(matDateLocale);
  }

  override format(date: Date, _displayFormat: any): string {
    const day = this._twoDigit(date.getDate());
    const month = this._twoDigit(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  // Helper function to add leading zero if the number is less than 10
  private _twoDigit(n: number): string {
    return n < 10 ? '0' + n : n.toString();
  }
}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de-CH' },

    {
      provide: DateAdapter,
      useClass: CustomDateAdapter,
      deps: [MAT_DATE_LOCALE, Platform]
    },
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',

})
export class AppComponent {
  title = 'elektrofahrni';
  form: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder) {
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

  onSubmit(): void {
    if (this.form.valid) {
      console.log(this.form.value.telefon);

      const date = new Date(this.form.value.geburtsdatum);
      const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      };

      const formatter = new Intl.DateTimeFormat('de-DE');
      const formattedDate = formatter.format(date);

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
        }, (error) => {
          console.error('Error sending email', error);
        });
    }
  }



}