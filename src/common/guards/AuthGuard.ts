import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {
    // this.logger.log('The Guard is activate.');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const payload = await this.authService.getPayload(req);

      req.user = {
        id: payload.userId,
        username: payload.username,
        roles: payload.roles,
      };

      return true;
    } catch (err) {
      throw new UnauthorizedException('Access DENIED:' + err);
    }
  }
}
