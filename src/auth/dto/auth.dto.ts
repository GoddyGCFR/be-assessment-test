import { UserDto } from '../../users/dto';
import { PickType } from '@nestjs/mapped-types';

export class AuthDto extends PickType(UserDto, [
  'email',
  'password',
] as const) {}
