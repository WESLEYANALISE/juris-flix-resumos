import { useState, useEffect } from 'react';
import { useResumosOptimized } from '../hooks/useResumosOptimized';
import { TrendingUp, Eye, Users, Clock } from 'lucide-react';
interface PopularContentProps {
  onSubjectClick: (area: string, modulo: string, tema: string, assunto: string, assuntoId: number) => void;
}
interface PopularItem {
  id: number;
  area: string;
  modulo: string;
  tema: string;
  assunto: string;
  views: number;
  rank: number;
}
const PopularContent = ({
  onSubjectClick
}: PopularContentProps) => {
  const {
    resumos
  } = useResumosOptimized();
  const [popularItems, setPopularItems] = useState<PopularItem[]>([]);
  useEffect(() => {
    // Simular dados de popularidade baseados em critérios realistas
    // Em um app real, isso viria do backend com dados reais de acessos
    const simulatedPopular = resumos.map(resumo => ({
      id: resumo.id,
      area: resumo.area,
      modulo: resumo.nome_do_modulo,
      tema: resumo.nome_do_tema,
      assunto: resumo.titulo_do_assunto,
      // Simular views baseado no comprimento do texto e área
      views: Math.floor(Math.random() * 1000) + (resumo.texto?.length || 0) / 10 + (resumo.area === 'Direito Constitucional' ? 200 : 0) + (resumo.area === 'Direito Penal' ? 150 : 0) + (resumo.area === 'Direito Civil' ? 120 : 0),
      rank: 0
    })).sort((a, b) => b.views - a.views).slice(0, 20).map((item, index) => ({
      ...item,
      rank: index + 1
    }));
    setPopularItems(simulatedPopular);
  }, [resumos]);
  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };
  const getRankColor = (rank: number) => {
    if (rank <= 3) return 'text-yellow-400';
    if (rank <= 10) return 'text-netflix-red';
    return 'text-netflix-lightGray';
  };
  return <div className="space-y-6 animate-fade-in">
      <div className="text-center py-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <TrendingUp className="h-8 w-8 text-netflix-red" />
          <h1 className="font-bold text-netflix-lightGray text-2xl">
            Conteúdo Popular
          </h1>
        </div>
        <p className="text-gray-400 mb-2">
          Os assuntos mais acessados por todos os usuários
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Ranking Global</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Atualizado hoje</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {popularItems.map(item => <div key={item.id} onClick={() => onSubjectClick(item.area, item.modulo, item.tema, item.assunto, item.id)} className="group bg-netflix-darkGray border border-netflix-gray rounded-xl p-4 hover:border-netflix-red transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-netflix-red/10 transform hover:scale-[1.02]">
            <div className="flex items-start gap-4">
              {/* Ranking */}
              <div className={`text-2xl font-bold ${getRankColor(item.rank)} min-w-[60px] text-center`}>
                {getRankIcon(item.rank)}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-netflix-red/20 text-netflix-red px-2 py-1 rounded-full">
                    {item.area}
                  </span>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Eye className="h-3 w-3" />
                    <span className="text-xs">{item.views.toLocaleString()} visualizações</span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-netflix-lightGray group-hover:text-netflix-red transition-colors mb-1 line-clamp-2">
                  {item.assunto}
                </h3>
                
                <div className="text-sm text-gray-400 space-y-1">
                  <div className="truncate">
                    <span className="font-medium">Módulo:</span> {item.modulo}
                  </div>
                  <div className="truncate">
                    <span className="font-medium">Tema:</span> {item.tema}
                  </div>
                </div>
              </div>
              
              {/* Trending indicator */}
              <div className="text-netflix-red opacity-0 group-hover:opacity-100 transition-opacity">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </div>)}
      </div>
      
      {popularItems.length === 0 && <div className="text-center py-12">
          <TrendingUp className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-netflix-lightGray mb-2">
            Carregando ranking...
          </h3>
          <p className="text-gray-400">
            Aguarde enquanto compilamos os dados de popularidade
          </p>
        </div>}
    </div>;
};
export default PopularContent;