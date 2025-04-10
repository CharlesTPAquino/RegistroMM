import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  // Remover verificação de usuário
  return children;
}
