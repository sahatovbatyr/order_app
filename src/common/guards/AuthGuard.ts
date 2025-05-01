import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';
import { CustomLoggerService } from '../../modules/logger/logger.service';
import { ILogMeta } from '../../interfaces/ILogMeta';

@Injectable()
export class AuthGuard implements CanActivate {
  private logMeta: ILogMeta;
  constructor(
    private authService: AuthService,
    private logger: CustomLoggerService,
  ) {
    this.logMeta = { context: AuthGuard.name };
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
