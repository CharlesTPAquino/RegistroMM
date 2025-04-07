import React, { useState } from 'react';
import { Product } from '../types';
import { PlusIcon } from '@heroicons/react/24/outline';

interface ProductFormProps {
  initialProduct?: Product;
  onSubmit: (name: string) => Promise<void>;
  className?: string;
}

export function ProductForm({ initialProduct, onSubmit, className = '' }: ProductFormProps) {
  const [name, setName] = useState(initialProduct?.name || '');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Nome do produto é obrigatório');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(trimmedName);
      setName('');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar produto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (error) setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div>
        <label
          htmlFor="productName"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Nome do Produto
        </label>
        <div className="mt-2">
          <input
            id="productName"
            type="text"
            value={name}
            onChange={handleNameChange}
            disabled={isSubmitting}
            placeholder="Digite o nome do produto"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {error && (
            <p className="mt-2 text-sm text-red-600" role="alert">{error}</p>
          )}
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <PlusIcon className="h-4 w-4" aria-hidden="true" />
        {isSubmitting ? 'Adicionando...' : 'Adicionar Produto'}
      </button>
    </form>
  );
}
