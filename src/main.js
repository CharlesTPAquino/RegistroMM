import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';
console.log('Iniciando aplicação React...');
console.log('Verificando módulos:', { React, StrictMode, createRoot });
const rootElement = document.getElementById('root');
console.log('Elemento root:', rootElement);
if (!rootElement) {
    console.error('Elemento root não encontrado no DOM');
}
else {
    try {
        const root = createRoot(rootElement);
        console.log('Root criado com sucesso');
        root.render(_jsx(StrictMode, { children: _jsx(App, {}) }));
        console.log('Renderização concluída');
    }
    catch (error) {
        console.error('Erro durante a renderização:', error);
    }
}
