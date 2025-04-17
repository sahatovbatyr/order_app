import { Injectable } from '@nestjs/common';
import { BaseCustomService } from '../../common/ base/BaseCustomService';
import { User } from '../../entities/user.entity';
import { DbTable } from '../../enums/DbTable';

@Injectable()
export class UserService extends BaseCustomService<User> {
  protected getRelations(): string[] {
    return [DbTable.ROLES];
  }
}
