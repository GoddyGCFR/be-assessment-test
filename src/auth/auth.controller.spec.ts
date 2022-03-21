import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    signUp: jest.fn((dto) => {
      return {
        message: 'Sign Up Successful',
      };
    }),

    signIn: jest.fn((dto) => {
      return {
        message: 'Sign In Successful',
        access_token: 'accessToken',
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should sign in a user', () => {
    expect(
      controller.signIn({ email: 'johndoe@yahoo.com', password: '123456' }),
    ).toMatchObject({
      message: 'Sign In Successful',
    });
  });

  it('should return 401 status code (Invalid login)', () => {
    expect(
      controller.signIn({ email: 'johndoe@yahoo.com', password: '1aa23456' }),
    ).toMatchObject({
      statusCode: 401,
      message: 'Invalid Credentials',
      error: 'Unauthorized',
    });
  });

  it('should create a new user', () => {
    expect(
      controller.signUp({
        email: 'johndoe222@yahoo.comm',
        password: '123456',
        lastName: 'Johnson',
        firstName: 'Smith',
      }),
    ).toMatchObject({ message: 'Sign Up Successful' });
  });
});
