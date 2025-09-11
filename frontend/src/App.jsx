import React from 'react';
import './App.css';
import OtpGenerator from './components/OtpGenerator';
import OtpValidator from './components/OtpValidator';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Serviço de OTP</h1>
      </header>
      <main>
        <OtpGenerator />
        <OtpValidator />
      </main>
      <footer>
        <p>Aplicação de demonstração - Clean Architecture OTP Service</p>
      </footer>
    </div>
  );
}

export default App;