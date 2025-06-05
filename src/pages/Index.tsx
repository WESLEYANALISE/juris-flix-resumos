
import { useState, useEffect } from 'react';
import { Search, BookOpen, Heart, User, LogOut, Filter, SortAsc } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth, AuthProvider } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import Auth from '@/components/Auth';
import ResumoReader from '@/components/ResumoReader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ResumoData {
  id: number;
  Area: string;
  Tema: string;
  Assunto: string;
  Resumo: string;
}

const IndexPage = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();

  const [resumos, setResumos] = useState<ResumoData[]>([]);
  const [filteredResumos, setFilteredResumos] = useState<ResumoData[]>([]);
  const [selectedResumo, setSelectedResumo] = useState<ResumoData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedTema, setSelectedTema] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('assunto');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [areas, setAreas] = useState<string[]>([]);
  const [temas, setTemas] = useState<string[]>([]);

  // Load resumos
  useEffect(() => {
    fetchResumos();
  }, []);

  // Filter resumos when dependencies change
  useEffect(() => {
    filterResumos();
  }, [resumos, searchTerm, selectedArea, selectedTema, sortBy, showFavoritesOnly, favorites]);

  const fetchResumos = async () => {
    try {
      const { data, error } = await supabase
        .from('RESUMOS_pro')
        .select('*')
        .order('id');

      if (error) throw error;

      setResumos(data || []);

      // Extract unique areas and temas
      const uniqueAreas = [...new Set(data?.map(r => r.Area) || [])].sort();
      const uniqueTemas = [...new Set(data?.map(r => r.Tema) || [])].sort();
      
      setAreas(uniqueAreas);
      setTemas(uniqueTemas);
    } catch (error) {
      console.error('Error fetching resumos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os resumos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterResumos = () => {
    let filtered = [...resumos];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(resumo =>
        resumo.Assunto.toLowerCase().includes(term) ||
        resumo.Area.toLowerCase().includes(term) ||
        resumo.Tema.toLowerCase().includes(term) ||
        resumo.Resumo.toLowerCase().includes(term)
      );
    }

    // Filter by area
    if (selectedArea !== 'all') {
      filtered = filtered.filter(resumo => resumo.Area === selectedArea);
    }

    // Filter by tema
    if (selectedTema !== 'all') {
      filtered = filtered.filter(resumo => resumo.Tema === selectedTema);
    }

    // Filter by favorites
    if (showFavoritesOnly) {
      filtered = filtered.filter(resumo => isFavorite(resumo.id));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'area':
          return a.Area.localeCompare(b.Area);
        case 'tema':
          return a.Tema.localeCompare(b.Tema);
        case 'assunto':
        default:
          return a.Assunto.localeCompare(b.Assunto);
      }
    });

    setFilteredResumos(filtered);
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso"
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedArea('all');
    setSelectedTema('all');
    setSortBy('assunto');
    setShowFavoritesOnly(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-netflix-lightGray">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  if (selectedResumo) {
    return (
      <ResumoReader
        resumo={selectedResumo}
        onBack={() => setSelectedResumo(null)}
        searchTerm={searchTerm}
      />
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-netflix-lightGray mb-2">
              Resumos Jurídicos
            </h1>
            <p className="text-gray-400">
              {filteredResumos.length} resumo(s) encontrado(s)
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-netflix-darkGray border-netflix-gray">
                <User className="h-4 w-4 mr-2" />
                {user.email}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-netflix-darkGray border-netflix-gray">
              <DropdownMenuLabel className="text-netflix-lightGray">Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-netflix-lightGray">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Search and Filters */}
        <div className="bg-netflix-darkGray border border-netflix-gray rounded-lg p-6 mb-6">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Pesquisar por assunto, área, tema ou conteúdo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-netflix-gray border-netflix-gray text-netflix-lightGray"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger className="bg-netflix-gray border-netflix-gray text-netflix-lightGray">
                <SelectValue placeholder="Todas as áreas" />
              </SelectTrigger>
              <SelectContent className="bg-netflix-darkGray border-netflix-gray">
                <SelectItem value="all">Todas as áreas</SelectItem>
                {areas.map(area => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTema} onValueChange={setSelectedTema}>
              <SelectTrigger className="bg-netflix-gray border-netflix-gray text-netflix-lightGray">
                <SelectValue placeholder="Todos os temas" />
              </SelectTrigger>
              <SelectContent className="bg-netflix-darkGray border-netflix-gray">
                <SelectItem value="all">Todos os temas</SelectItem>
                {temas.map(tema => (
                  <SelectItem key={tema} value={tema}>{tema}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-netflix-gray border-netflix-gray text-netflix-lightGray">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-netflix-darkGray border-netflix-gray">
                <SelectItem value="assunto">Ordenar por Assunto</SelectItem>
                <SelectItem value="area">Ordenar por Área</SelectItem>
                <SelectItem value="tema">Ordenar por Tema</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              variant={showFavoritesOnly ? "default" : "outline"}
              className={showFavoritesOnly 
                ? "bg-netflix-red hover:bg-netflix-darkRed" 
                : "bg-netflix-darkGray border-netflix-gray hover:bg-netflix-gray"
              }
            >
              <Heart className={`h-4 w-4 mr-2 ${showFavoritesOnly ? 'fill-current' : ''}`} />
              Favoritos
            </Button>
          </div>

          {/* Clear filters */}
          {(searchTerm || selectedArea !== 'all' || selectedTema !== 'all' || showFavoritesOnly) && (
            <Button
              onClick={clearFilters}
              variant="outline"
              size="sm"
              className="bg-netflix-gray border-netflix-gray text-netflix-lightGray hover:bg-netflix-darkGray"
            >
              Limpar filtros
            </Button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-netflix-darkGray border-netflix-gray">
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-6 w-full mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredResumos.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-netflix-lightGray mb-2">
              Nenhum resumo encontrado
            </h3>
            <p className="text-gray-400">
              Tente ajustar os filtros ou fazer uma nova pesquisa
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumos.map((resumo) => (
              <Card
                key={resumo.id}
                className="bg-netflix-darkGray border-netflix-gray hover:border-netflix-red cursor-pointer transition-all duration-300 group"
                onClick={() => setSelectedResumo(resumo)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-netflix-red text-white">
                        {resumo.Area}
                      </Badge>
                      <Badge variant="outline" className="border-netflix-gray text-netflix-lightGray">
                        {resumo.Tema}
                      </Badge>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(resumo.id);
                      }}
                      className="p-1 rounded hover:bg-netflix-gray transition-colors"
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          isFavorite(resumo.id)
                            ? 'fill-netflix-red text-netflix-red'
                            : 'text-gray-400 hover:text-netflix-red'
                        }`}
                      />
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-netflix-lightGray mb-3 group-hover:text-netflix-red transition-colors line-clamp-2">
                    {resumo.Assunto}
                  </h3>
                  
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {resumo.Resumo.replace(/[#*>`-]/g, '').substring(0, 150)}...
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <IndexPage />
    </AuthProvider>
  );
};

export default Index;
