
import React, { useState } from 'react';
import { User, LogOut, Heart, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const UserMenu = () => {
  const { user, signOut, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <button
        onClick={() => navigate('/auth')}
        className="flex items-center gap-2 px-4 py-2 bg-netflix-red hover:bg-netflix-darkRed text-white rounded-lg font-medium transition-colors"
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">Entrar</span>
      </button>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-netflix-lightGray hover:text-netflix-red transition-colors"
      >
        <div className="w-8 h-8 bg-netflix-red rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
        <span className="hidden sm:inline text-sm">
          {user?.email?.split('@')[0] || 'Usuário'}
        </span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-48 bg-netflix-darkGray border border-netflix-gray rounded-lg shadow-xl z-20">
            <div className="p-3 border-b border-netflix-gray">
              <p className="text-netflix-lightGray text-sm font-medium">
                {user?.email}
              </p>
            </div>
            
            <div className="p-2">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 text-netflix-lightGray hover:text-netflix-red hover:bg-netflix-gray rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
