
import React from 'react';
import { Book, Clock, Trophy, Target, BookOpen, Heart } from 'lucide-react';
import StatsCard from './StatsCard';
import { useResumos } from '../hooks/useResumos';

const PersonalDashboard: React.FC = () => {
  const { favorites, recents, resumos } = useResumos();

  const stats = [
    {
      title: 'Total de Resumos',
      value: resumos.length.toLocaleString(),
      icon: BookOpen,
      description: 'Disponíveis na plataforma'
    },
    {
      title: 'Favoritos',
      value: favorites.length,
      icon: Heart,
      trend: { value: 12, isPositive: true },
      description: 'Resumos salvos'
    },
    {
      title: 'Recentes',
      value: recents.length,
      icon: Clock,
      description: 'Acessados recentemente'
    },
    {
      title: 'Áreas Estudadas',
      value: new Set(recents.map(r => r.area)).size,
      icon: Book,
      trend: { value: 8, isPositive: true },
      description: 'Diferentes áreas do direito'
    },
    {
      title: 'Meta Semanal',
      value: '5/10',
      icon: Target,
      description: 'Resumos estudados esta semana'
    },
    {
      title: 'Conquistas',
      value: 3,
      icon: Trophy,
      trend: { value: 50, isPositive: true },
      description: 'Badges conquistadas'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-netflix-lightGray mb-2">
          Seu Progresso de Estudos
        </h2>
        <p className="text-gray-400">
          Acompanhe suas estatísticas e continue evoluindo
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default PersonalDashboard;
