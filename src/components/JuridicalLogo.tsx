import React from 'react';
import { Scale, Gavel, BookOpen, TrendingUp, Users, Award } from 'lucide-react';
import { useResumos } from '../hooks/useResumos';
const JuridicalLogo: React.FC = () => {
  const {
    resumos,
    getAreas
  } = useResumos();
  const areas = getAreas();
  const totalResumos = resumos.length;
  const totalAreas = areas.length;
  return;
};
export default JuridicalLogo;