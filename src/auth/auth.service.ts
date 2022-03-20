import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthEntity } from './entities/auth.entity';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
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

  async signIn(signInDto: CreateAuthDto) {
    const { password, email } = signInDto;

    const isEmail = await this.authRepository.findOne({ where: { email } });
    if (!isEmail) return { message: 'Invalid Credentials' };

    const isPassword = await argon2.verify(isEmail.password, password);
    if (!isPassword) return { message: 'Invalid Credentials' };

    return { message: 'SignIn Successful' };
  }

  async update(id: string, updateAuthDto: UpdateAuthDto) {
    const user = await this.authRepository.findOne(id);
    if (!user) return { message: 'You cannot perform this operation' };

    const updatedData = {};
    if (updateAuthDto.password) {
      updatedData['password'] = await argon2.hash(updateAuthDto.password);
    }

    if (updateAuthDto.email) {
      updatedData['email'] = updateAuthDto.email;
      const isEmail = await this.authRepository.findOne({
        where: { email: updateAuthDto.email },
      });
      if (isEmail && isEmail.id.toString() !== id.toString())
        return { message: 'Email already taken' };
    }

    if (updateAuthDto.firstName) {
      updatedData['firstName'] = updateAuthDto.firstName;
    }

    if (updateAuthDto.lastName) {
      updatedData['lastName'] = updateAuthDto.lastName;
    }

    await this.authRepository.update(id, updatedData);
    return { message: 'Update Successful' };
  }

  // remove(id: string) {
  //   return `This action removes a #${id} auth`;
  // }
}
