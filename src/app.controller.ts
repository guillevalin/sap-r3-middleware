import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/createNotification')
  async createNotification(): Promise<any> {
    return await this.appService.createNotification();
  }

  @Get('/goodsMovement')
  async goodsMovement(): Promise<any> {
    return await this.appService.goodsMovement();
  }
}
