import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const generateOtp = async (userId, expirationMinutes = 5) => {
  try {
    const response = await axios.post(`${API_URL}/api/token-otp`, {
      userId,
      expirationMinutes
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar OTP:', error);
    throw error;
  }
};

export const validateOtp = async (token, userId) => {
  try {
    const response = await axios.post(`${API_URL}/api/token-otp/validate`, {
      token,
      userId
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao validar OTP:', error);
    throw error;
  }
};