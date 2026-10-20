import React, { useState } from 'react';
import { Subject, Topic, Semester } from '../../types/game';
import materiData from '../../data/materi.json';
import { PANCASILA_BABS, PetaMateriItem } from '../../data/pancasilaCurriculum';
import { audio } from '../../utils/audio';
import { speech } from '../../utils/speech';
import {
  ArrowLeft,
  BookOpen,
  Volume2,
  Gamepad2,
  Sparkles,
  MapPin,
  CheckCircle2,
  Lightbulb,
  X,
  VolumeX,
  Play
} from 'lucide-react';

interface MateriScreenProps {
  subject: Subject;
  onBack: () => void;
  onNavigatePlay: (materiFilter?: string) => void;
}

export const MateriScreen: React.FC<MateriScreenProps> = ({
  subject,
  onBack,
  onNavigatePlay,
}) => {
  const [selectedSemester, setSelectedSemester] = useState<Semester>('ganjil');
  const [activeBabId, setActiveBabId] = useState<string>('bab-1');
  const [activePetaItem, setActivePetaItem] = useState<PetaMateriItem | null>(null);
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const isPancasila = subject.id === 'pancasila';

  // Pancasila bab list for the selected semester
  const pancasilaBabsForSemester = PANCASILA_BABS.filter(
    (b) => b.semester === selectedSemester
  );

  // Active Pancasila Bab object
  const currentPancasilaBab =
    pancasilaBabsForSemester.find((b) => b.id === activeBabId) ||
    pancasilaBabsForSemester[0] ||
    PANCASILA_BABS[0];

  // Topics for other subjects
  const standardTopics = (materiData as Topic[]).filter(
    (t) => t.subjectId === subject.id && t.semester === selectedSemester
  );

  const handleReadAloud = (text: string) => {
    if (isSpeaking) {
      speech.stop();
      setIsSpeaking(false);
      return;
    }
    audio.playClick();
    setIsSpeaking(true);
    speech.speak(text, () => {
      setIsSpeaking(false);
    });
  };

  const handleStopSpeech = () => {
    speech.stop();
    setIsSpeaking(false);
  };

  const handleSemesterChange = (sem: Semester) => {
    audio.playClick();
    handleStopSpeech();
    setSelectedSemester(sem);
    if (sem === 'ganjil') {
      setActiveBabId('bab-1');
    } else {
      setActiveBabId('bab-3');
    }
  };

  const handleSelectBab = (babId: string) => {
    audio.playClick();
    handleStopSpeech();
    setActiveBabId(babId);
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] p-3 sm:p-5 max-w-5xl mx-auto pb-16 select-none">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            handleStopSpeech();
            audio.playClick();
            onBack();
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-slate-800 text-xs font-black text-slate-700 dark:text-slate-200 border-2 border-amber-300 dark:border-amber-600 shadow-sm hover:bg-white cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Kembali</span>
        </button>

        {/* Shortcut direct to game */}
        <button
          onClick={() => {
            handleStopSpeech();
            audio.playClick();
            onNavigatePlay();
          }}
          className="btn-chunky inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs sm:text-sm font-heading font-black shadow-[0_4px_0_#065f46] border border-emerald-300 cursor-pointer"
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Uji Dirimu: Main Yuk!</span>
        </button>
      </div>

      {/* Greeting & Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-amber-950 rounded-3xl p-5 sm:p-6 shadow-xl border-4 border-amber-300 dark:border-amber-500 mb-6">
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/20 rounded-full blur-xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left relative z-10">
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white/90 dark:bg-[#4d3c26] shadow-md flex items-center justify-center text-3xl sm:text-4xl shrink-0 border-2 border-amber-200 dark:border-amber-600">
            {subject.icon}
          </div>
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-amber-950 text-amber-900 dark:text-amber-200 text-xs font-black uppercase tracking-wider mb-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Modul Belajar Kurikulum Merdeka • Kelas 4</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-amber-950 leading-tight">
              Halo, Sahabat GAMBRENG!
            </h1>
            <p className="font-heading font-black text-base sm:text-lg text-amber-900 mt-0.5">
              Selamat datang di menu Materi &ldquo;Ayo Belajar Dulu!&rdquo;
            </p>
            <p className="text-xs sm:text-sm text-amber-950/80 font-bold mt-1 max-w-2xl">
              {isPancasila
                ? 'Mari membaca dan mendalami materi Pendidikan Pancasila sebelum memulai petualangan seru di papan permainan!'
                : `Yuk pelajari konsep-konsep penting mata pelajaran ${subject.name} untuk mengumpulkan poin tertinggi di papan permainan!`}
            </p>
          </div>
        </div>
      </div>

      {/* Semester Selector Bar */}
      <div className="bg-white/90 dark:bg-[#3a2d1d]/95 backdrop-blur-md rounded-2xl p-2 shadow-lg border-2 border-amber-300 dark:border-amber-600 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 px-3 text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">
          <span>📚 Pilih Semester:</span>
        </div>
        <div className="flex w-full sm:w-auto rounded-xl bg-amber-100/70 dark:bg-[#2e2316] p-1 border border-amber-200 dark:border-amber-700">
          <button
            onClick={() => handleSemesterChange('ganjil')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-black transition-all cursor-pointer ${
              selectedSemester === 'ganjil'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                : 'text-amber-900 dark:text-amber-200 hover:text-amber-950 dark:hover:text-white'
            }`}
          >
            Semester Ganjil
          </button>
          <button
            onClick={() => handleSemesterChange('genap')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-black transition-all cursor-pointer ${
              selectedSemester === 'genap'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                : 'text-amber-900 dark:text-amber-200 hover:text-amber-950 dark:hover:text-white'
            }`}
          >
            Semester Genap
          </button>
        </div>
      </div>

      {/* PENDIDIKAN PANCASILA DEDICATED BAB & PETA MATERI VIEW */}
      {isPancasila ? (
        <div className="space-y-6">
          {/* Chapter Selector Cards (BAB 1 & BAB 2 for Ganjil, BAB 3 & BAB 4 for Genap) */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <span>📖</span>
                <span>
                  {selectedSemester === 'ganjil'
                    ? 'Daftar Bab Semester Ganjil:'
                    : 'Daftar Bab Semester Genap:'}
                </span>
              </span>
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                Klik bab di bawah untuk menjelajahi materi
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {pancasilaBabsForSemester.map((bab) => {
                const isSelected = activeBabId === bab.id;
                return (
                  <button
                    key={bab.id}
                    onClick={() => handleSelectBab(bab.id)}
                    className={`btn-chunky relative p-4 rounded-3xl border-3 text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-amber-950 border-amber-500 shadow-[0_6px_0_#b45309] scale-[1.01]'
                        : 'bg-white/95 dark:bg-[#3a2d1d]/95 hover:bg-amber-50 dark:hover:bg-[#443522] text-amber-950 dark:text-amber-100 border-amber-300 dark:border-amber-600 shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0 ${
                          isSelected
                            ? 'bg-white/40 text-amber-950'
                            : 'bg-amber-100 dark:bg-[#4d3c26]'
                        }`}
                      >
                        {bab.icon}
                      </div>
                      <div>
                        <span
                          className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full inline-block mb-1 ${
                            isSelected
                              ? 'bg-amber-950 text-amber-200'
                              : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          Bab {bab.number} • {selectedSemester === 'ganjil' ? 'Semester 1' : 'Semester 2'}
                        </span>
                        <h2 className="font-heading font-black text-base sm:text-lg leading-snug">
                          {bab.badgeTitle}
                        </h2>
                      </div>
                    </div>
                    <div className="shrink-0 pl-2">
                      {isSelected ? (
                        <span className="w-8 h-8 rounded-full bg-amber-950 text-amber-200 flex items-center justify-center font-black text-xs shadow-xs">
                          ✓
                        </span>
                      ) : (
                        <span className="text-xs font-black text-amber-600 dark:text-amber-400 underline">
                          Buka Bab →
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE BAB CONTENT CONTAINER */}
          <div className="bg-gradient-to-b from-white/95 via-amber-50/90 to-yellow-50/95 dark:bg-gradient-to-b dark:from-[#3a2d1d]/95 dark:via-[#423420]/95 dark:to-[#2e2316]/95 rounded-3xl p-5 sm:p-7 shadow-2xl border-4 border-amber-400 dark:border-amber-500">
            {/* Bab Header Banner */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-5 sm:p-6 text-white shadow-lg mb-6 border-2 border-amber-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
                <span className="text-xs font-black uppercase tracking-wider bg-black/20 px-3 py-1 rounded-full text-amber-100">
                  🌾 {currentPancasilaBab.badgeTitle}
                </span>

                {/* Read aloud intro button */}
                <button
                  onClick={() =>
                    handleReadAloud(
                      `${currentPancasilaBab.heroHeadline}. ${currentPancasilaBab.heroIntro}`
                    )
                  }
                  className="btn-chunky inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-black border border-white/30 cursor-pointer"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-4 h-4 text-amber-200 animate-pulse" />
                      <span>Hentikan Suara</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-amber-100" />
                      <span>Dengarkan Pengantar</span>
                    </>
                  )}
                </button>
              </div>

              {/* Exact user requested Title: "Ayo, Jelajahi Lingkungan Sekitar!" for BAB 1 */}
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-white drop-shadow-xs mb-2">
                {currentPancasilaBab.heroHeadline}
              </h2>

              {/* Exact user requested Intro text for BAB 1 */}
              <p className="text-xs sm:text-base text-amber-50 font-bold leading-relaxed max-w-3xl">
                {currentPancasilaBab.heroIntro}
              </p>
            </div>

            {/* PETA MATERI SECTION */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-9 h-9 rounded-2xl bg-amber-400 dark:bg-amber-500 text-amber-950 flex items-center justify-center text-lg font-black shadow-sm">
                  🗺️
                </span>
                <div>
                  <h3 className="font-heading text-xl sm:text-2xl font-black text-amber-950 dark:text-amber-100">
                    Peta Materi
                  </h3>
                  <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
                    Pelajari rincian sub-materi berikut ini secara mendalam:
                  </p>
                </div>
              </div>

              {/* 4 Cards for Peta Materi (A, B, C, D) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentPancasilaBab.petaMateri.map((item) => (
                  <div
                    key={item.code}
                    className="group bg-white/95 dark:bg-[#443522]/95 hover:bg-amber-50/90 dark:hover:bg-[#4d3c26] rounded-3xl p-5 shadow-lg border-3 border-amber-300 dark:border-amber-600 hover:border-amber-500 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header of Card */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 flex items-center justify-center text-lg font-black shadow-xs">
                            {item.icon}
                          </span>
                          <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-900/60 text-amber-950 dark:text-amber-200">
                            Sub-Materi {item.letter}
                          </span>
                        </div>
                        <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300">
                          {item.questionCount} Soal Tersedia
                        </span>
                      </div>

                      {/* Title: Exact e.g. "A. Mengenal Identitas" */}
                      <h4 className="font-heading font-black text-lg sm:text-xl text-amber-950 dark:text-amber-100 mb-1.5 group-hover:text-amber-800 transition-colors">
                        {item.title}
                      </h4>

                      {/* Subtext: Exact e.g. "Identitas diri, keluarga, teman, dan masyarakat." */}
                      <p className="text-xs sm:text-sm font-bold text-amber-800/90 dark:text-amber-200/90 leading-relaxed mb-4">
                        {item.subtext}
                      </p>
                    </div>

                    {/* Actions: Baca Rangkuman Lengkap & Uji Soal */}
                    <div className="flex items-center gap-2 pt-3 border-t border-amber-200 dark:border-amber-700/60">
                      <button
                        onClick={() => {
                          handleStopSpeech();
                          audio.playClick();
                          setActivePetaItem(item);
                        }}
                        className="btn-chunky flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-amber-950 font-heading font-black text-xs sm:text-sm shadow-[0_3px_0_#d97706] cursor-pointer"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Baca Materi Lengkap</span>
                      </button>

                      <button
                        onClick={() => {
                          handleStopSpeech();
                          audio.playClick();
                          onNavigatePlay(item.code);
                        }}
                        title={`Mainkan soal khusus Materi ${item.code}`}
                        className="btn-chunky px-3 py-2.5 rounded-2xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-900 dark:text-emerald-200 font-heading font-black text-xs border border-emerald-300 dark:border-emerald-700 shadow-[0_3px_0_#059669] cursor-pointer flex items-center gap-1"
                      >
                        <Play className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-300 fill-current" />
                        <span>Uji {item.letter}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Bar: Action to Start Game with this Chapter */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-[#4d3c26] border-2 border-amber-300 dark:border-amber-600 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-2xl shrink-0">
                  🎲
                </div>
                <div>
                  <h4 className="font-heading font-black text-sm sm:text-base text-amber-950 dark:text-amber-100">
                    Sudah Paham Materi {currentPancasilaBab.title}?
                  </h4>
                  <p className="text-xs text-amber-800/80 dark:text-amber-300 font-bold">
                    Tantang kemampuanmu menjawab soal-soal berbobot di papan petualangan GAMBRENG!
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  handleStopSpeech();
                  audio.playClick();
                  onNavigatePlay();
                }}
                className="btn-chunky w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-heading font-black text-sm shadow-[0_4px_0_#065f46] border border-emerald-300 cursor-pointer flex items-center justify-center gap-2"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Mulai Mainkan Bab Ini!</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* OTHER SUBJECTS TOPIC GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {standardTopics.map((topic) => (
            <div
              key={topic.id}
              className="bg-gradient-to-br from-white/95 via-amber-50/90 to-yellow-50/95 dark:bg-gradient-to-br dark:from-[#3a2d1d]/95 dark:via-[#443522]/95 dark:to-[#2e2316]/95 rounded-3xl p-5 sm:p-6 shadow-xl border-3 border-amber-300 dark:border-amber-500 hover:border-amber-500 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-2xl p-2 rounded-2xl bg-white/90 dark:bg-[#4d3c26] border border-amber-200 dark:border-amber-600 shadow-xs">
                    {topic.icon}
                  </span>
                  <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300">
                    {topic.semester === 'ganjil' ? 'Semester 1' : 'Semester 2'}
                  </span>
                </div>
                <h3 className="font-heading font-black text-lg sm:text-xl text-amber-950 dark:text-amber-100 mb-2">
                  {topic.title}
                </h3>
                <p className="text-xs sm:text-sm text-amber-800/80 dark:text-amber-200/90 font-bold leading-relaxed mb-4">
                  {topic.summary}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-amber-200 dark:border-amber-700/60">
                <button
                  onClick={() => {
                    handleStopSpeech();
                    audio.playClick();
                    setActiveTopic(topic);
                  }}
                  className="btn-chunky flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-amber-950 font-heading font-black text-xs sm:text-sm shadow-[0_3px_0_#d97706] cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Baca Materi Lengkap</span>
                </button>
              </div>
            </div>
          ))}

          {standardTopics.length === 0 && (
            <div className="col-span-full p-8 text-center bg-white/90 dark:bg-[#3a2d1d]/90 rounded-3xl border-2 border-dashed border-amber-300 text-amber-900 dark:text-amber-200 font-bold">
              <p className="text-sm">
                Materi untuk semester ini sedang disiapkan. Silakan pilih semester lainnya!
              </p>
            </div>
          )}
        </div>
      )}

      {/* READING DETAIL MODAL FOR PANCASILA PETA MATERI ITEM */}
      {activePetaItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#fffef5] via-[#fef9eb] to-[#fef3c7] dark:bg-gradient-to-b dark:from-[#3a2d1d] dark:via-[#423420] dark:to-[#2e2316] rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-400 dark:border-amber-500">
            {/* Close Button */}
            <button
              onClick={() => {
                handleStopSpeech();
                setActivePetaItem(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-amber-100 dark:bg-[#4d3c26] text-amber-800 dark:text-amber-200 hover:bg-amber-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl p-2 rounded-2xl bg-amber-100 dark:bg-[#4d3c26] border border-amber-300 shadow-xs">
                {activePetaItem.icon}
              </span>
              <div>
                <span className="text-xs font-black uppercase text-amber-700 dark:text-amber-300">
                  {currentPancasilaBab.badgeTitle} • Sub-Materi {activePetaItem.letter}
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-black text-amber-950 dark:text-amber-100">
                  {activePetaItem.title}
                </h3>
              </div>
            </div>

            {/* Audio Read-Aloud Button */}
            <div className="mb-4 flex items-center gap-2">
              <button
                onClick={() =>
                  handleReadAloud(
                    `${activePetaItem.title}. ${activePetaItem.readingSummary}. Poin penting: ${activePetaItem.keyPoints.join(
                      '. '
                    )}`
                  )
                }
                className="btn-chunky inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-200 text-xs font-black border border-sky-300 shadow-[0_2px_0_#0284c7] cursor-pointer"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4 text-sky-600 animate-pulse" />
                    <span>Hentikan Suara</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-sky-600" />
                    <span>Baca Nyaring (Suara Bahasa Indonesia)</span>
                  </>
                )}
              </button>
            </div>

            {/* Reading Summary */}
            <div className="bg-white/95 dark:bg-[#4d3c26] p-4 rounded-2xl border-2 border-amber-300 dark:border-amber-600 mb-4 text-sm sm:text-base text-amber-950 dark:text-amber-100 font-bold leading-relaxed shadow-xs">
              {activePetaItem.readingSummary}
            </div>

            {/* Key Points */}
            <div className="mb-5">
              <h4 className="font-heading font-black text-base text-amber-950 dark:text-amber-100 mb-2.5 flex items-center gap-1.5">
                <span>🌾</span>
                <span>Poin-Poin Penting untuk Diingat:</span>
              </h4>
              <ul className="space-y-2">
                {activePetaItem.keyPoints.map((point, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-amber-950 dark:text-amber-100 bg-white/90 dark:bg-[#4a3a25] p-3 rounded-2xl border border-amber-300 dark:border-amber-600/80 font-bold shadow-xs"
                  >
                    <span className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5 shadow-xs">
                      {idx + 1}
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fun Fact */}
            {activePetaItem.funFact && (
              <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200">
                <div className="font-black flex items-center gap-1 mb-1">
                  <Lightbulb className="w-4 h-4 text-emerald-600" />
                  <span>Tahukah Kamu?</span>
                </div>
                <p className="font-medium">{activePetaItem.funFact}</p>
              </div>
            )}

            {/* Example Story */}
            {activePetaItem.exampleStory && (
              <div className="mb-5 p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 text-xs sm:text-sm text-purple-900 dark:text-purple-200">
                <div className="font-black mb-1">📖 Cerita Sehari-hari:</div>
                <p className="font-medium italic">&ldquo;{activePetaItem.exampleStory}&rdquo;</p>
              </div>
            )}

            {/* Bottom Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  handleStopSpeech();
                  setActivePetaItem(null);
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-heading font-black text-sm cursor-pointer"
              >
                Tutup Materi
              </button>
              <button
                onClick={() => {
                  handleStopSpeech();
                  audio.playClick();
                  setActivePetaItem(null);
                  onNavigatePlay(activePetaItem.code);
                }}
                className="btn-chunky flex-1 w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-heading font-black text-base shadow-[0_4px_0_#065f46] border border-emerald-300 cursor-pointer"
              >
                <Gamepad2 className="w-5 h-5" />
                <span>Uji Soal Materi {activePetaItem.letter} di Papan!</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* READING DETAIL MODAL FOR OTHER SUBJECT TOPICS */}
      {activeTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#fffef5] via-[#fef9eb] to-[#fef3c7] dark:bg-gradient-to-b dark:from-[#3a2d1d] dark:via-[#423420] dark:to-[#2e2316] rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-400 dark:border-amber-500">
            {/* Close Button */}
            <button
              onClick={() => {
                handleStopSpeech();
                setActiveTopic(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-amber-100 dark:bg-[#4d3c26] text-amber-800 dark:text-amber-200 hover:bg-amber-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Topic Header */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{activeTopic.icon}</span>
              <div>
                <span className="text-xs font-black uppercase text-amber-700 dark:text-amber-300">
                  {subject.name} - {activeTopic.semester === 'ganjil' ? 'Semester Ganjil' : 'Semester Genap'}
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-black text-amber-950 dark:text-amber-100">
                  {activeTopic.title}
                </h3>
              </div>
            </div>

            {/* Audio Read-Aloud Button */}
            <div className="mb-4 flex items-center gap-2">
              <button
                onClick={() =>
                  handleReadAloud(
                    `${activeTopic.title}. ${activeTopic.reading.summary}. Poin penting: ${activeTopic.reading.keyPoints.join(
                      '. '
                    )}`
                  )
                }
                className="btn-chunky inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-200 text-xs font-black border border-sky-300 shadow-[0_2px_0_#0284c7] cursor-pointer"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4 text-sky-600 animate-pulse" />
                    <span>Hentikan Suara</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-sky-600" />
                    <span>Baca Nyaring (Suara Bahasa Indonesia)</span>
                  </>
                )}
              </button>
            </div>

            {/* Reading Summary */}
            <div className="bg-white/95 dark:bg-[#4d3c26] p-4 rounded-2xl border-2 border-amber-300 dark:border-amber-600 mb-4 text-sm sm:text-base text-amber-950 dark:text-amber-100 font-bold leading-relaxed shadow-xs">
              {activeTopic.reading.summary}
            </div>

            {/* Key Points */}
            <div className="mb-5">
              <h4 className="font-heading font-black text-base text-amber-950 dark:text-amber-100 mb-2.5 flex items-center gap-1.5">
                <span>🌾</span>
                <span>Poin-Poin Penting untuk Diingat:</span>
              </h4>
              <ul className="space-y-2">
                {activeTopic.reading.keyPoints.map((point, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-amber-950 dark:text-amber-100 bg-white/90 dark:bg-[#4a3a25] p-3 rounded-2xl border border-amber-300 dark:border-amber-600/80 font-bold shadow-xs"
                  >
                    <span className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5 shadow-xs">
                      {idx + 1}
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fun Fact */}
            {activeTopic.reading.funFact && (
              <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200">
                <div className="font-black flex items-center gap-1 mb-1">
                  <Lightbulb className="w-4 h-4 text-emerald-600" />
                  <span>Tahukah Kamu?</span>
                </div>
                <p className="font-medium">{activeTopic.reading.funFact}</p>
              </div>
            )}

            {/* Example Story */}
            {activeTopic.reading.exampleStory && (
              <div className="mb-5 p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 text-xs sm:text-sm text-purple-900 dark:text-purple-200">
                <div className="font-black mb-1">📖 Cerita Sehari-hari:</div>
                <p className="font-medium italic">&ldquo;{activeTopic.reading.exampleStory}&rdquo;</p>
              </div>
            )}

            {/* Bottom Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  handleStopSpeech();
                  setActiveTopic(null);
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-heading font-black text-sm cursor-pointer"
              >
                Tutup Materi
              </button>
              <button
                onClick={() => {
                  handleStopSpeech();
                  audio.playClick();
                  setActiveTopic(null);
                  onNavigatePlay();
                }}
                className="btn-chunky flex-1 w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-heading font-black text-base shadow-[0_4px_0_#065f46] border border-emerald-300 cursor-pointer"
              >
                <Gamepad2 className="w-5 h-5" />
                <span>Uji Dirimu: Main Yuk!</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
