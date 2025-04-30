import { Injectable } from '@nestjs/common';
import { RoleService } from './modules/role/role.service';
import { UserService } from './modules/user/user.service';

@Injectable()
export class AppService {
  constructor(
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  async onModuleInit() {
    await this.roleService.seed();
    await this.userService.seed();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
