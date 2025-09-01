import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class ValidateTokenOtpRequestDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    @Matches(/^[0-9]+$/)
    userId: string = '';

    @IsNotEmpty()
    @IsString()
    @Matches(/^\d{6}$/)
    token: string = '';
}