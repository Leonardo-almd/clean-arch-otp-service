/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verifica a saúde da API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API está funcionando corretamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 */