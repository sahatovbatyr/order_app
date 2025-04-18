import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../../modules/auth/auth.service';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../entities/role.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {
    // this.logger.log('The Guard is activate.');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const reqiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (!reqiredRoles) {
        return true;
      }

      const req = context.switchToHttp().getRequest();
      const payload = await this.authService.getPayload(req);

      req.user = {
        id: payload.userId,
        username: payload.username,
        roles: payload.roles,
      };

      console.log('payload.roles : ', payload);

      return req.user.roles.some((role: Role) =>
        reqiredRoles.includes(role.title),
      );
    } catch (err) {
      throw new ForbiddenException('Access DENIED:' + err);
    }
  }
}
