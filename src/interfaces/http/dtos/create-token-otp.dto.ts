import { IsNotEmpty, IsNumber, IsOptional, IsString, Matches, Max, MaxLength, Min } from 'class-validator';

export class CreateTokenOtpRequestDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    @Matches(/^[0-9]+$/)
    userId: string = '';

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(5)
    expirationMinutes?: number;
}