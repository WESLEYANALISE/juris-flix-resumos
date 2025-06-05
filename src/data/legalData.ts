
import { LegalArea } from '../types/legal';

export const legalAreas: LegalArea[] = [
  {
    id: 'civil',
    title: 'Direito Civil',
    description: 'Regulamenta as relações entre particulares',
    icon: '⚖️',
    themes: [
      {
        id: 'contratos',
        title: 'Contratos',
        description: 'Teoria geral dos contratos e espécies contratuais',
        subjects: [
          {
            id: 'formacao-contrato',
            title: 'Formação do Contrato',
            summary: 'Elementos essenciais para a formação válida de contratos',
            content: `# Formação do Contrato

## Conceito
A formação do contrato é o processo pelo qual duas ou mais partes chegam a um acordo de vontades, criando obrigações jurídicas entre elas.

## Elementos Essenciais
1. **Capacidade das partes**
2. **Objeto lícito, possível e determinado**
3. **Forma prescrita ou não defesa em lei**

## Fases da Formação
- **Proposta (Policitação)**: Manifestação de vontade dirigida a pessoa determinada
- **Aceitação**: Anuência do oblato aos termos da proposta
- **Acordo de vontades**: Convergência entre proposta e aceitação

## Momento da Formação
O contrato se forma no momento em que o proponente tem conhecimento da aceitação.`,
            isFavorite: false
          }
        ]
      }
    ]
  },
  {
    id: 'penal',
    title: 'Direito Penal',
    description: 'Define crimes e estabelece punições',
    icon: '🚨',
    themes: [
      {
        id: 'crimes-pessoa',
        title: 'Crimes contra a Pessoa',
        description: 'Delitos que afetam a integridade física e moral',
        subjects: [
          {
            id: 'homicidio',
            title: 'Homicídio',
            summary: 'Conceito e modalidades do crime de homicídio',
            content: `# Homicídio

## Conceito
Homicídio é o crime que consiste em matar alguém, previsto no art. 121 do Código Penal.

## Modalidades
- **Homicídio simples**: Forma básica do delito
- **Homicídio qualificado**: Presença de circunstâncias agravantes
- **Homicídio privilegiado**: Presença de circunstâncias atenuantes

## Pena
- Simples: reclusão de 6 a 20 anos
- Qualificado: reclusão de 12 a 30 anos
- Privilegiado: reclusão de 3 a 12 anos`,
            isFavorite: false
          }
        ]
      }
    ]
  },
  {
    id: 'constitucional',
    title: 'Direito Constitucional',
    description: 'Princípios fundamentais do Estado',
    icon: '🏛️',
    themes: []
  },
  {
    id: 'administrativo',
    title: 'Direito Administrativo',
    description: 'Organização e funcionamento da Administração Pública',
    icon: '🏢',
    themes: []
  },
  {
    id: 'trabalhista',
    title: 'Direito Trabalhista',
    description: 'Relações de trabalho e emprego',
    icon: '👥',
    themes: []
  },
  {
    id: 'tributario',
    title: 'Direito Tributário',
    description: 'Sistema tributário nacional',
    icon: '💰',
    themes: []
  },
  {
    id: 'empresarial',
    title: 'Direito Empresarial',
    description: 'Atividade empresarial e societária',
    icon: '🏪',
    themes: []
  },
  {
    id: 'processual-civil',
    title: 'Processo Civil',
    description: 'Procedimentos judiciais cíveis',
    icon: '📋',
    themes: []
  },
  {
    id: 'processual-penal',
    title: 'Processo Penal',
    description: 'Procedimentos judiciais penais',
    icon: '⚖️',
    themes: []
  },
  {
    id: 'internacional',
    title: 'Direito Internacional',
    description: 'Relações jurídicas internacionais',
    icon: '🌍',
    themes: []
  }
];
