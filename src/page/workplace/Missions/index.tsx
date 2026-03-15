import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Mission {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export const Missions: React.FC = () => {
  const { t } = useTranslation('page.workplace.missions');
  const [missions, setMissions] = useState<Mission[]>([
    { id: 1, title: t('items.learnTsTitle'), description: t('items.learnTsDesc'), completed: false },
    {
      id: 2,
      title: t('items.buildReactTitle'),
      description: t('items.buildReactDesc'),
      completed: false,
    },
    {
      id: 3,
      title: t('items.deployTitle'),
      description: t('items.deployDesc'),
      completed: false,
    },
  ]);

  const toggleMission = (id: number) => {
    setMissions(
      missions.map((mission) =>
        mission.id === id ? { ...mission, completed: !mission.completed } : mission,
      ),
    );
  };

  return (
    <div className="missions-container">
      <h1>{t('title')}</h1>
      <ul className="missions-list">
        {missions.map((mission) => (
          <li key={mission.id} className={mission.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={mission.completed}
              onChange={() => toggleMission(mission.id)}
            />
            <div>
              <h3>{mission.title}</h3>
              <p>{mission.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Missions;
