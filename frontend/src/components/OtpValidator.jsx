import React, { useState } from 'react';
import { validateOtp } from '../services/api';

const OtpValidator = () => {
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatValidationErrors = (errors) => {
    if (!errors || typeof errors !== 'object') {
      return 'Erro de validação nos dados enviados.';
    }

    const fieldLabels = {
      userId: 'ID do Usuário',
      token: 'Token OTP'
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
    setResult(null);
    
    try {
      const validationResult = await validateOtp(token, userId);
      setResult(validationResult);
    } catch (err) {
      console.log(err?.errors);
      setError(err?.errors ? formatValidationErrors(err.errors) : 'Erro ao validar token OTP. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Validar Token OTP</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="validateUserId">ID do Usuário:</label>
          <input
            type="text"
            id="validateUserId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="token">Token OTP:</label>
          <input
            type="text"
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Validando...' : 'Validar Token'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      
      {result && (
        <div className={`result ${result.isValid ? 'success' : 'failure'}`}>
          <h3>Resultado da Validação:</h3>
          <p className="status">
            {result.isValid ? 'Token válido!' : 'Token inválido!'}
          </p>
          {result.message && <p>{result.message}</p>}
        </div>
      )}
    </div>
  );
};

export default OtpValidator;