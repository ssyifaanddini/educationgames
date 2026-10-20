/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenState, Subject, Player, TimeMode } from './types/game';
import { SUBJECTS } from './data/subjects';
import { Header } from './components/common/Header';
import { GameBackground } from './components/common/GameBackground';
import { CoverScreen } from './components/screens/CoverScreen';
import { MenuScreen } from './components/screens/MenuScreen';
import { TutorialScreen } from './components/screens/TutorialScreen';
import { SubjectPickerScreen } from './components/screens/SubjectPickerScreen';
import { SubjectActionScreen } from './components/screens/SubjectActionScreen';
import { MateriScreen } from './components/screens/MateriScreen';
import { GameSetupScreen } from './components/screens/GameSetupScreen';
import { GameBoardScreen } from './components/screens/GameBoardScreen';
import { PodiumScreen } from './components/screens/PodiumScreen';
import { CertificateScreen } from './components/screens/CertificateScreen';
import { FinalScreen } from './components/screens/FinalScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('cover');
  const [selectedSubject, setSelectedSubject] = useState<Subject>(SUBJECTS[0]);
  const [gamePlayers, setGamePlayers] = useState<Player[]>([]);
  const [timeMode, setTimeMode] = useState<TimeMode>('30m');
  const [enableLuckCards, setEnableLuckCards] = useState<boolean>(true);
  const [materiFilter, setMateriFilter] = useState<string>('all');
  const [playDurationSec, setPlayDurationSec] = useState<number>(0);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('gambreng_dark_mode') === 'true';
  });
  const [schoolName, setSchoolName] = useState<string>(() => {
    return localStorage.getItem('gambreng_school_name') || 'SD Negeri Merdeka 01';
  });
  const [teacherName, setTeacherName] = useState<string>(() => {
    return localStorage.getItem('gambreng_teacher_name') || 'Bapak / Ibu Guru Pembimbing';
  });

  const handleUpdateSchoolAndTeacher = (newSchool: string, newTeacher: string) => {
    setSchoolName(newSchool);
    setTeacherName(newTeacher);
    localStorage.setItem('gambreng_school_name', newSchool);
    localStorage.setItem('gambreng_teacher_name', newTeacher);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('gambreng_dark_mode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Screen Transitions
  const handleStartGameSetup = (players: Player[], mode: TimeMode, luck: boolean, materi: string = 'all') => {
    setGamePlayers(players);
    setTimeMode(mode);
    setEnableLuckCards(luck);
    setMateriFilter(materi);
    setCurrentScreen('game');
  };

  const handleFinishGame = (finalPlayers: Player[], durationSec: number) => {
    setGamePlayers(finalPlayers);
    setPlayDurationSec(durationSec);
    setCurrentScreen('podium');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 relative flex flex-col ${darkMode ? 'dark text-slate-100' : 'text-slate-800'}`}>
      {/* Village & Sky Illustrated Responsive Background */}
      <GameBackground screen={currentScreen} darkMode={darkMode} />

      {/* Persistent Navigation Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        schoolName={schoolName}
        teacherName={teacherName}
        onUpdateSchoolAndTeacher={handleUpdateSchoolAndTeacher}
      />

      {/* Main Screen Content */}
      <main className="relative z-10 flex-1 w-full flex flex-col justify-center">
        <div key={currentScreen} className="animate-screen-enter w-full flex-1 flex flex-col justify-center">
          {currentScreen === 'cover' && (
            <CoverScreen onNext={() => setCurrentScreen('menu')} />
          )}

          {currentScreen === 'menu' && (
            <MenuScreen
              onNavigateTutorial={() => setCurrentScreen('tutorial')}
              onNavigatePlay={() => setCurrentScreen('subject-picker')}
              onNavigateHome={() => setCurrentScreen('cover')}
            />
          )}

          {currentScreen === 'tutorial' && (
            <TutorialScreen
              onStartGame={() => setCurrentScreen('subject-picker')}
              onBackMenu={() => setCurrentScreen('menu')}
            />
          )}

          {currentScreen === 'subject-picker' && (
            <SubjectPickerScreen
              onSelectSubject={(subj) => {
                setSelectedSubject(subj);
                setCurrentScreen('subject-action');
              }}
              onBack={() => setCurrentScreen('menu')}
            />
          )}

          {currentScreen === 'subject-action' && (
            <SubjectActionScreen
              subject={selectedSubject}
              onNavigateMateri={() => setCurrentScreen('materi')}
              onNavigatePlay={() => setCurrentScreen('game-setup')}
              onChangeSubject={() => setCurrentScreen('subject-picker')}
            />
          )}

          {currentScreen === 'materi' && (
            <MateriScreen
              subject={selectedSubject}
              onBack={() => setCurrentScreen('subject-action')}
              onNavigatePlay={(filter?: string) => {
                if (filter) setMateriFilter(filter);
                setCurrentScreen('game-setup');
              }}
            />
          )}

          {currentScreen === 'game-setup' && (
            <GameSetupScreen
              subject={selectedSubject}
              initialMateriFilter={materiFilter}
              onBack={() => setCurrentScreen('subject-action')}
              onStartGame={handleStartGameSetup}
            />
          )}

          {currentScreen === 'game' && (
            <GameBoardScreen
              subject={selectedSubject}
              players={gamePlayers}
              timeMode={timeMode}
              enableLuckCards={enableLuckCards}
              materiFilter={materiFilter}
              onFinishGame={handleFinishGame}
              onNavigateHome={() => setCurrentScreen('cover')}
              darkMode={darkMode}
            />
          )}

          {currentScreen === 'podium' && (
            <PodiumScreen
              players={gamePlayers}
              subject={selectedSubject}
              onNavigateCertificates={() => setCurrentScreen('certificates')}
              onNavigateFinal={() => setCurrentScreen('final')}
              onNavigateHome={() => setCurrentScreen('cover')}
            />
          )}

          {currentScreen === 'certificates' && (
            <CertificateScreen
              players={gamePlayers}
              subject={selectedSubject}
              playDurationSec={playDurationSec}
              schoolName={schoolName}
              teacherName={teacherName}
              onUpdateSchoolAndTeacher={handleUpdateSchoolAndTeacher}
              onBack={() => setCurrentScreen('podium')}
              onNavigateFinal={() => setCurrentScreen('final')}
              onNavigateHome={() => setCurrentScreen('cover')}
            />
          )}

          {currentScreen === 'final' && (
            <FinalScreen
              subject={selectedSubject}
              onPlayAgain={() => setCurrentScreen('game-setup')}
              onChangeSubject={() => setCurrentScreen('subject-picker')}
              onViewMateri={() => setCurrentScreen('materi')}
              onPrintCertificate={() => setCurrentScreen('certificates')}
              onBackHome={() => setCurrentScreen('cover')}
            />
          )}
        </div>
      </main>
    </div>
  );
}
