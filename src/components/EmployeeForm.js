import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { employeeService } from '../services/api';
/**
 * Componente para cadastro de funcionários
 */
export function EmployeeForm({ onEmployeeAdded }) {
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            alert('Por favor, insira o nome do funcionário');
            return;
        }
        setIsLoading(true);
        try {
            await employeeService.create({ name: name.trim() });
            setName('');
            onEmployeeAdded();
        }
        catch (error) {
            alert('Erro ao cadastrar funcionário');
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: "bg-white p-6 rounded-lg shadow-md", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Cadastrar Funcion\u00E1rio" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "employeeName", className: "block text-sm font-medium text-gray-700", children: "Nome do Funcion\u00E1rio" }), _jsx("input", { type: "text", id: "employeeName", name: "employeeName", value: name, onChange: (e) => setName(e.target.value), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500", placeholder: "Digite o nome do funcion\u00E1rio", required: true })] }), _jsx("button", { type: "submit", disabled: isLoading, className: "bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50", children: isLoading ? 'Cadastrando...' : 'Cadastrar Funcionário' })] })] }));
}
