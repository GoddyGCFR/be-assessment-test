import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthDto } from './dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/users/entities/user.entity';
import { UserDto } from '../users/dto';

@Injectable()
export class AuthService {
  constructor(
    // @InjectRepository(UserEntity)
    // private readonly userRepository: Repository<UserEntity>,

    private readonly jwt: JwtService,

    private readonly config: ConfigService,
  ) {}

  // async signUp(dto: UserDto) {
  //   const { password, email } = dto;
  //   const hash = await argon2.hash(password);
  //   const auth = this.userRepository.create({
  //     ...dto,
  //     email: email.toLowerCase(),
  //     password: hash,
  //   });
  //   await this.userRepository.save(auth);
  //   return { message: 'Signup Successful' };
  // }

  // async signIn(dto: AuthDto) {
  //   const { password, email } = dto;
  //
  //   const user = await this.userRepository.findOne({ where: { email } });
  //   if (!user) throw new UnauthorizedException('Invalid Credentials');
  //
  //   const isPassword = await argon2.verify(user.password, password);
  //   if (!isPassword) throw new UnauthorizedException('Invalid Credentials');
  //
  //   const { access_token } = await this.signToken(user.id, user.email);
  //
  //   return { message: 'Sign-in Successful', access_token };
  // }

  // remove(id: string) {
  //   return `This action removes a #${id} auth`;
  // }

  async signToken(id: UserEntity['id'], email: UserEntity['email']) {
    const payload = { sub: id, email };

    const secret = this.config.get('JWT_SECRET');

    return {
      access_token: await this.jwt.signAsync(payload, {
        secret,
        expiresIn: '1h',
      }),
    };
  }
}
