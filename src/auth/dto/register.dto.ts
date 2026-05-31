import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({
        example: 'alfi@gmail.com',
        description: 'User email address',
    })
    @IsEmail()
    email!: string;

    @ApiProperty({
        example: 'password123',
        description: 'User password',
        minLength: 8,
    })
    @IsString()
    @MinLength(8)
    @MaxLength(100)
    password!: string;

    @ApiProperty({
        example: 'Alfi Aprilia',
        description: 'Full name',
    })
    @IsString()
    @MaxLength(100)
    name!: string;
}