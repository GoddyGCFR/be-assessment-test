import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, UpdateAuthDto as PartialDto } from './dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signUp(createAuthDto);
  }

  @Post('sign-in')
  signIn(@Body() createAuthDto: PartialDto) {
    return this.authService.signIn(createAuthDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update')
  update(
    @Param('id') id: string,
    @Body() updateAuthDto: PartialDto,
    @Req() req: Request,
  ) {
    const { id: userId } = req.user as unknown as { id: string };
    return this.authService.update(userId, updateAuthDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Req() req: Request) {
    const { id: userId } = req.user as unknown as { id: string };
    return this.authService.getMe(userId);
  }
}
