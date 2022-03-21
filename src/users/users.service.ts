import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDto, UserPartialDto } from './dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { AuthDto } from '../auth/dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly authService: AuthService,
  ) {}

  async signUp(dto: UserDto) {
    const { password, email } = dto;
    const hash = await argon2.hash(password);
    const auth = this.userRepository.create({
      ...dto,
      email: email.toLowerCase(),
      password: hash,
    });
    await this.userRepository.save(auth);
    return { message: 'Signup Successful' };
  }

  async signIn(dto: AuthDto) {
    const { password, email } = dto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid Credentials');

    const isPassword = await argon2.verify(user.password, password);
    if (!isPassword) throw new UnauthorizedException('Invalid Credentials');

    const { access_token } = await this.authService.signToken(
      user.id,
      user.email,
    );

    return { message: 'Sign-in Successful', access_token };
  }

  async update(id: string, updateAuthDto: UserPartialDto) {
    const user = await this.userRepository.findOne(id);
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
            const isEmail = await this.userRepository.findOne({
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
    //   const isEmail = await this.userRepository.findOne({
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

    await this.userRepository.save(user);
    return { message: 'Update Successful' };
  }

  getMe(userId: string) {
    return this.userRepository.findOne({
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
}
