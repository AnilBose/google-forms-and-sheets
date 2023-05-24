import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class GoogleFormService {
  private readonly formId: string = ''; // Replace with your Google Form ID
  private readonly spreadsheetId: string = ''; // Replace with your Google Form ID

  public generateFormUrl(
    name: string,
    email: string,
    phoneNumber: string,
  ): string {
    const baseUrl = `https://docs.google.com/forms/d/${this.formId}/viewform`;
    const queryParams = new URLSearchParams({
      'entry.495090285': name, // Replace with the appropriate field entry IDs
      'entry.798653141': email,
      'entry.1661552608': phoneNumber,
    });
    return `${baseUrl}?${queryParams.toString()}`;
  }

  public generateResponseUrl(): string {
    return `https://docs.google.com/forms/d/${this.formId}/edit#responses`;
  }

  public async getGoogleSheetData(): Promise<any[]> {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        private_key: process.env.GOOGLE_PRIVATE_KEY,
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    try {
      const range = 'A:D';

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range,
      });
      const values = response.data.values;
      const headers = values[0];
      const rows = values.slice(1);
      const jsonData = rows.map((row) => {
        const rowData = {};
        row.forEach((value, index) => {
          rowData[headers[index]] = value;
        });
        return rowData;
      });

      console.log('JSON response:', jsonData);
      return jsonData;
    } catch (error) {
      console.error('Error retrieving data from Google Sheet:', error);
    }
  }
}
