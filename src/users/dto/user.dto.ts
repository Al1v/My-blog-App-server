import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'must be a string' })
  @IsEmail({}, { message: 'invalid email' })
  readonly email: string;
  @IsString({ message: 'must be a string' })
  readonly fullName: string;
  @IsString({ message: 'must be a string' })
  @Length(3, 16, { message: 'password must be between 3 and 16 symbols' })
  readonly password: string;
  readonly avatarUrl: string;
}

export class LoginDto {

  readonly email: string;
  readonly password: string;
}
