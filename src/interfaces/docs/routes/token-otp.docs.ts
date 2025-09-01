/**
 * @swagger
 * /token-otp:
 *   post:
 *     summary: Cria um novo token OTP
 *     tags: [Token OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTokenOtpRequest'
 *     responses:
 *       200:
 *         description: Token OTP criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenOtpResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 * 
 * /token-otp/validate:
 *   post:
 *     summary: Valida um token OTP
 *     tags: [Token OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ValidateTokenOtpRequest'
 *     responses:
 *       200:
 *         description: Resultado da validação do token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenOtpValidationResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */