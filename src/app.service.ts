import { Injectable } from '@nestjs/common';
import { RoleService } from './modules/role/role.service';

@Injectable()
export class AppService {
  constructor(private readonly roleService: RoleService) {}

  async onModuleInit() {
    await this.roleService.seed();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
