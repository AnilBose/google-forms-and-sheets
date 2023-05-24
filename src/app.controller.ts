import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { GoogleFormService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly googleFormService: GoogleFormService) {}

  @Get('form-url')
  getFormUrl(
    @Query('name') name: string,
    @Query('email') email: string,
    @Query('phoneNumber') phoneNumber: string,
  ): string {
    return this.googleFormService.generateFormUrl(name, email, phoneNumber);
  }

  @Get('response-url')
  getResponseUrl(): string {
    return this.googleFormService.generateResponseUrl();
  }

  @Get('google-sheet-data')
  async getGoogleSheetData(): Promise<any[]> {
    return this.googleFormService.getGoogleSheetData();
  }
}
