import { Controller, Body, Patch, UseGuards, Req, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserPartialDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('update')
  update(@Body() dto: UserPartialDto, @Req() req: Request) {
    const { id: userId } = req.user as unknown as { id: string };
    return this.usersService.update(userId, dto);
  }

  @Get('me')
  getMe(@Req() req: Request) {
    const { id: userId } = req.user as unknown as { id: string };
    return this.usersService.getMe(userId);
  }
}
