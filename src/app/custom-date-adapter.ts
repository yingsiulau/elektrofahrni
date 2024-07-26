import { NativeDateAdapter } from '@angular/material/core';
import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  private readonly formatString = 'dd.MM.yyyy';

  // Override the format method
  override format(date: Date, displayFormat: Object): string {
    return formatDate(date, this.formatString, this.locale);
  }

  // Override the parse method
  override parse(value: any, parseFormat: Object): Date | null {
    const parts = (value || '').split('.');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Months are zero-based
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return null;
  }
}
