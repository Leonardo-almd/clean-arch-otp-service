import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class ValidateTokenOtpRequestDto {
    @IsString({ message: 'ID do usuário deve ser um texto' })
    @IsNotEmpty({ message: 'ID do usuário é obrigatório' })
    @MaxLength(10, { message: 'ID do usuário deve ter no máximo 10 caracteres' })
    @Matches(/^[0-9]+$/, { message: 'ID do usuário deve conter apenas números' })
    userId: string = '';

    @IsNotEmpty({ message: 'Token OTP é obrigatório' })
    @IsString({ message: 'Token OTP deve ser um texto' })
    @Matches(/^\d{6}$/, { message: 'Token OTP deve ter exatamente 6 dígitos' })
    token: string = '';
}