import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';

console.log('Iniciando aplicação React...');
console.log('Verificando módulos:', { React, StrictMode, createRoot });

const rootElement = document.getElementById('root');
console.log('Elemento root:', rootElement);

if (!rootElement) {
  console.error('Elemento root não encontrado no DOM');
} else {
  try {
    const root = createRoot(rootElement);
    console.log('Root criado com sucesso');
    
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    console.log('App renderizado com sucesso');
  } catch (error) {
    console.error('Erro ao renderizar App:', error);
  }
}
