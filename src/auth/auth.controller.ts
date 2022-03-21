import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { UserDto } from '../users/dto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('sign-up')
  signUp(@Body() dto: UserDto) {
    return this.userService.signUp(dto);
  }

  @Post('sign-in')
  signIn(@Body() dto: AuthDto) {
    return this.userService.signIn(dto);
  }
}
