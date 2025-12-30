import React, { useState } from 'react';

interface Mission {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export const Missions: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>([
    { id: 1, title: 'Learn TypeScript', description: 'Master TypeScript basics', completed: false },
    {
      id: 2,
      title: 'Build a React App',
      description: 'Create a functional React application',
      completed: false,
    },
    {
      id: 3,
      title: 'Deploy to Production',
      description: 'Deploy your app to a live server',
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
      <h1>Missions</h1>
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
