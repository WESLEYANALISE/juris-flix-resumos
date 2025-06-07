
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, User, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface NavigationProps {
  onBack?: () => void;
  title?: string;
  showBackButton?: boolean;
  isAuthenticated?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ 
  onBack, 
  title, 
  showBackButton = true,
  isAuthenticated = false 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleAuth = () => {
    if (isAuthenticated) {
      handleLogout();
    } else {
      navigate('/auth');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <nav className="bg-netflix-darkGray border-b border-netflix-gray sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {showBackButton && location.pathname !== '/' && (
              <button
                onClick={handleBack}
                className="text-netflix-lightGray hover:text-white transition-colors p-2 rounded-lg hover:bg-netflix-gray"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            {title && (
              <h1 className="text-lg font-semibold text-netflix-lightGray truncate">
                {title}
              </h1>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleAuth}
              className="flex items-center gap-2 px-4 py-2 bg-netflix-red hover:bg-netflix-darkRed text-white rounded-lg font-medium transition-colors"
            >
              {isAuthenticated ? (
                <>
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sair</span>
                </>
              ) : (
                <>
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Entrar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
