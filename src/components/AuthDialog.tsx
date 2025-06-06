
import React, { useState } from 'react';
import { X, Lock, Download } from 'lucide-react';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (email: string, password: string) => void;
  title: string;
}

const AuthDialog: React.FC<AuthDialogProps> = ({
  isOpen,
  onClose,
  onAuthenticate,
  title
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simular autenticação
    setTimeout(() => {
      onAuthenticate(email, password);
      setLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-netflix-darkGray border border-netflix-gray rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Lock className="h-6 w-6 text-netflix-red" />
            <h2 className="text-xl font-bold text-netflix-lightGray">
              Autenticação Necessária
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-netflix-red transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-gray-300 mb-6 text-sm">
          Para baixar o PDF "{title}", confirme suas credenciais:
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-netflix-lightGray mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-netflix-lightGray focus:border-netflix-red focus:outline-none"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-netflix-lightGray mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-netflix-lightGray focus:border-netflix-red focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-netflix-red hover:bg-netflix-darkRed disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Baixar PDF
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Esta é uma tela de demonstração para validação de download
        </p>
      </div>
    </div>
  );
};

export default AuthDialog;
