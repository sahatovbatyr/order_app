import { Role } from '../../../entities/role.entity';

export class JwtPayload {
  constructor(
    private _userId: number,
    private _username: string,
    private _roles: Role[],
  ) {}

  get userId(): number {
    return this._userId;
  }

  get username(): string {
    return this._username;
  }

  get roles(): Role[] {
    return this._roles;
  }
}
