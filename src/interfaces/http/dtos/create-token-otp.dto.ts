import { IsNotEmpty, IsNumber, IsOptional, IsString, Matches, Max, MaxLength, Min } from 'class-validator';

export class CreateTokenOtpRequestDto {
    @IsString({ message: 'ID do usuário deve ser um texto' })
    @IsNotEmpty({ message: 'ID do usuário é obrigatório' })
    @MaxLength(10, { message: 'ID do usuário deve ter no máximo 10 caracteres' })
    @Matches(/^[0-9]+$/, { message: 'ID do usuário deve conter apenas números' })
    userId: string = '';

    @IsOptional()
    @IsNumber({}, { message: 'Tempo de expiração deve ser um número' })
    @Min(1, { message: 'Tempo de expiração deve ser pelo menos 1 minuto' })
    @Max(5, { message: 'Tempo de expiração deve ser no máximo 5 minutos' })
    expirationMinutes?: number;
}