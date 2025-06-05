
import { useState, useEffect } from 'react';
import { legalAreas } from '../data/legalData';
import { LegalArea, LegalTheme, LegalSubject } from '../types/legal';
import SearchBar from '../components/SearchBar';
import AreaCard from '../components/AreaCard';
import ThemesList from '../components/ThemesList';
import SubjectsList from '../components/SubjectsList';
import ArticleView from '../components/ArticleView';
import Navigation from '../components/Navigation';
import FavoritesList from '../components/FavoritesList';
import RecentsList from '../components/RecentsList';

type ViewState = 
  | { type: 'areas' }
  | { type: 'themes'; area: LegalArea }
  | { type: 'subjects'; theme: LegalTheme }
  | { type: 'article'; subject: LegalSubject };

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'home' | 'favorites' | 'recent'>('home');
  const [viewState, setViewState] = useState<ViewState>({ type: 'areas' });
  const [areas, setAreas] = useState(legalAreas);

  // Get all subjects for favorites and recents
  const getAllSubjects = (): LegalSubject[] => {
    return areas.flatMap(area => 
      area.themes.flatMap(theme => theme.subjects)
    );
  };

  const favorites = getAllSubjects().filter(subject => subject.isFavorite);
  const recents = getAllSubjects()
    .filter(subject => subject.lastViewed)
    .sort((a, b) => (b.lastViewed?.getTime() || 0) - (a.lastViewed?.getTime() || 0))
    .slice(0, 10);

  const handleToggleFavorite = (subjectId: string) => {
    setAreas(prevAreas => 
      prevAreas.map(area => ({
        ...area,
        themes: area.themes.map(theme => ({
          ...theme,
          subjects: theme.subjects.map(subject => 
            subject.id === subjectId 
              ? { ...subject, isFavorite: !subject.isFavorite }
              : subject
          )
        }))
      }))
    );
  };

  const handleSubjectView = (subject: LegalSubject) => {
    // Update last viewed
    setAreas(prevAreas => 
      prevAreas.map(area => ({
        ...area,
        themes: area.themes.map(theme => ({
          ...theme,
          subjects: theme.subjects.map(s => 
            s.id === subject.id 
              ? { ...s, lastViewed: new Date() }
              : s
          )
        }))
      }))
    );
    
    setViewState({ type: 'article', subject });
  };

  const filteredAreas = areas.filter(area => 
    area.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    area.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    area.themes.some(theme => 
      theme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      theme.subjects.some(subject => 
        subject.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  );

  const renderContent = () => {
    if (activeTab === 'favorites') {
      return <FavoritesList favorites={favorites} onSubjectClick={handleSubjectView} />;
    }
    
    if (activeTab === 'recent') {
      return <RecentsList recents={recents} onSubjectClick={handleSubjectView} />;
    }

    // Home tab
    switch (viewState.type) {
      case 'areas':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAreas.map((area) => (
              <AreaCard
                key={area.id}
                area={area}
                onClick={() => setViewState({ type: 'themes', area })}
              />
            ))}
          </div>
        );

      case 'themes':
        return (
          <ThemesList
            themes={viewState.area.themes}
            onThemeClick={(theme) => setViewState({ type: 'subjects', theme })}
            onBack={() => setViewState({ type: 'areas' })}
            areaTitle={viewState.area.title}
          />
        );

      case 'subjects':
        return (
          <SubjectsList
            subjects={viewState.theme.subjects}
            onSubjectClick={handleSubjectView}
            onBack={() => setViewState({ type: 'themes', area: areas.find(a => a.themes.includes(viewState.theme))! })}
            themeTitle={viewState.theme.title}
          />
        );

      case 'article':
        return (
          <ArticleView
            subject={viewState.subject}
            onBack={() => {
              const area = areas.find(a => a.themes.some(t => t.subjects.includes(viewState.subject)));
              const theme = area?.themes.find(t => t.subjects.includes(viewState.subject));
              if (theme) {
                setViewState({ type: 'subjects', theme });
              }
            }}
            onToggleFavorite={handleToggleFavorite}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-netflix-lightGray mb-4">
            Resumos Jurídicos
          </h1>
          <p className="text-xl text-gray-400">
            Seu guia completo para o mundo do Direito
          </p>
        </header>

        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'home' && viewState.type === 'areas' && (
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        )}

        <main>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
