import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthDto, UpdateAuthDto } from './dto';
import { AuthEntity } from './entities/auth.entity';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,

    private readonly jwt: JwtService,

    private readonly config: ConfigService,
  ) {}

  async signUp(createAuthDto: CreateAuthDto) {
    const { password, email } = createAuthDto;
    const hash = await argon2.hash(password);
    const auth = this.authRepository.create({
      ...createAuthDto,
      email: email.toLowerCase(),
      password: hash,
    });
    await this.authRepository.save(auth);
    return { message: 'Signup Successful' };
  }

  async signIn(signInDto: UpdateAuthDto) {
    const { password, email } = signInDto;

    const user = await this.authRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid Credentials');

    const isPassword = await argon2.verify(user.password, password);
    if (!isPassword) throw new UnauthorizedException('Invalid Credentials');

    const { access_token } = await this.signToken(user.id, user.email);

    return { message: 'Sign-in Successful', access_token };
  }

  getMe(userId: string) {
    return this.authRepository.findOne({
      where: { id: userId },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  async update(id: string, updateAuthDto: UpdateAuthDto) {
    const user = await this.authRepository.findOne(id);
    if (!user) return { message: 'You cannot perform this operation' };

    const keys = Object.keys(updateAuthDto);
    if (!keys.length) throw new BadRequestException('No fields to update');

    for await (const key of keys) {
      if (updateAuthDto[key] && updateAuthDto[key]?.toString().length) {
        switch (key) {
          case 'password':
            const hash = await argon2.hash(updateAuthDto[key]);
            user[key] = hash;
            break;

          case 'email':
            const email: string = updateAuthDto[key].toLowerCase();
            const isEmail = await this.authRepository.findOne({
              where: { email },
            });

            if (isEmail && isEmail.id.toString() !== id.toString())
              throw new BadRequestException('Email already exists');

            user[key] = email;

            break;

          default:
            user[key] = updateAuthDto[key];
        }
      }
    }

    // if (updateAuthDto.password) {
    //   user.password = await argon2.hash(updateAuthDto.password);
    // }
    //
    // if (updateAuthDto.email) {
    //   const email: string = updateAuthDto.email.toLowerCase();
    //   const isEmail = await this.authRepository.findOne({
    //     where: { email },
    //   });
    //
    //   if (isEmail && isEmail.id.toString() !== id.toString())
    //     throw new BadRequestException('Email already exists');
    //
    //   user.email = email;
    // }
    //
    // if (updateAuthDto.firstName) {
    //   user['firstName'] = updateAuthDto.firstName;
    // }
    //
    // if (updateAuthDto.lastName) {
    //   user['lastName'] = updateAuthDto.lastName;
    // }

    await this.authRepository.save(user);
    return { message: 'Update Successful' };
  }

  // remove(id: string) {
  //   return `This action removes a #${id} auth`;
  // }

  private async signToken(id: AuthEntity['id'], email: AuthEntity['email']) {
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
