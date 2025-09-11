import React, { useState } from 'react';
import { generateOtp } from '../services/api';

const OtpGenerator = () => {
  const [userId, setUserId] = useState('');
  const [expirationMinutes, setExpirationMinutes] = useState(5);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatValidationErrors = (errors) => {
    if (!errors || typeof errors !== 'object') {
      return 'Erro de validação nos dados enviados.';
    }

    const fieldLabels = {
      userId: 'ID do Usuário',
      expirationMinutes: 'Tempo de Expiração'
    };

    const errorMessages = Object.entries(errors).map(([field, messages]) => {
      const fieldLabel = fieldLabels[field] || field;
      const messageList = Array.isArray(messages) ? messages : [messages];
      return `${fieldLabel}: ${messageList.join(', ')}`;
    });

    return errorMessages.join('\n');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const result = await generateOtp(userId, expirationMinutes);
      setToken(result);
    } catch (err) {
      console.log(err?.errors);
      setError(err?.errors ? formatValidationErrors(err.errors) : 'Erro ao gerar token OTP. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Gerar Token OTP</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userId">ID do Usuário:</label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="expiration">Tempo de Expiração (minutos):</label>
          <input
            type="number"
            id="expiration"
            value={expirationMinutes}
            onChange={(e) => setExpirationMinutes(Number(e.target.value))}
            min="1"
            max="60"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Gerando...' : 'Gerar Token'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      
      {token && (
        <div className="result">
          <h3>Token Gerado:</h3>
          <p className="token">{token.token}</p>
          <p>Expira em: {token.expiresAt}</p>
        </div>
      )}
    </div>
  );
};

export default OtpGenerator;