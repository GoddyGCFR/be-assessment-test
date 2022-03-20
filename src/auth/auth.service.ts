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
    const { password } = createAuthDto;
    const hash = await argon2.hash(password);
    const auth = this.authRepository.create({
      ...createAuthDto,
      password: hash,
    });
    // return this.authRepository.save(auth);
    await this.authRepository.save(auth);
    return { message: 'Signup Successful' };
  }

  signIn() {
    // return this.authRepository;
  }

  // findOne(id: string) {
  //   return `This action returns a #${id} auth`;
  // }
  //
  update(id: string, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }
  //
  // remove(id: string) {
  //   return `This action removes a #${id} auth`;
  // }
}
