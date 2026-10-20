import React, { useState } from 'react';
import { Subject, Topic, Semester } from '../../types/game';
import materiData from '../../data/materi.json';
import { audio } from '../../utils/audio';
import { speech } from '../../utils/speech';
import { ArrowLeft, BookOpen, Volume2, Gamepad2, ExternalLink, Lightbulb, X } from 'lucide-react';

interface MateriScreenProps {
  subject: Subject;
  onBack: () => void;
  onNavigatePlay: () => void;
}

export const MateriScreen: React.FC<MateriScreenProps> = ({
  subject,
  onBack,
  onNavigatePlay,
}) => {
  const [selectedSemester, setSelectedSemester] = useState<Semester>('ganjil');
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);

  // Filter topics by subject and semester
  const topics = (materiData as Topic[]).filter(
    (t) => t.subjectId === subject.id && t.semester === selectedSemester
  );

  const handleReadAloud = (text: string) => {
    audio.playClick();
    speech.speak(text);
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] p-4 max-w-4xl mx-auto pb-12">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            speech.stop();
            audio.playClick();
            onBack();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        {/* Shortcut direct to game */}
        <button
          onClick={() => {
            speech.stop();
            audio.playClick();
            onNavigatePlay();
          }}
          className="btn-chunky inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-heading font-black shadow-[0_3px_0_#059669]"
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Uji Dirimu: Main Yuk</span>
        </button>
      </div>

      {/* Subject Header */}
      <div className="bg-gradient-to-r from-amber-50/95 via-yellow-50/95 to-emerald-50/95 dark:bg-gradient-to-r dark:from-[#3a2d1d]/95 dark:via-[#423420]/95 dark:to-[#2e3b26]/95 rounded-3xl p-6 shadow-xl border-4 border-amber-400 dark:border-amber-500 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner shrink-0 bg-white/90 dark:bg-[#4d3c26] border-2 border-amber-300 dark:border-amber-600"
            style={{ backgroundColor: `${subject.color}25` }}
          >
            {subject.icon}
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
              🌾 Modul Belajar Kurikulum Merdeka
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-amber-950 dark:text-amber-100">
              Materi {subject.name} (Kelas 4)
            </h2>
          </div>
        </div>

        {/* Semester Toggle */}
        <div className="flex rounded-2xl bg-white/90 dark:bg-[#4d3c26] p-1.5 border-2 border-amber-300 dark:border-amber-600 shadow-sm">
          <button
            onClick={() => {
              audio.playClick();
              setSelectedSemester('ganjil');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-black transition-all cursor-pointer ${
              selectedSemester === 'ganjil'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-amber-900 dark:text-amber-200 hover:text-amber-950'
            }`}
          >
            Semester Ganjil
          </button>
          <button
            onClick={() => {
              audio.playClick();
              setSelectedSemester('genap');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-black transition-all cursor-pointer ${
              selectedSemester === 'genap'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-amber-900 dark:text-amber-200 hover:text-amber-950'
            }`}
          >
            Semester Genap
          </button>
        </div>
      </div>

      {/* Topic Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map((topic) => (
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

        {topics.length === 0 && (
          <div className="col-span-full p-8 text-center bg-white/90 dark:bg-[#3a2d1d]/90 rounded-3xl border-2 border-dashed border-amber-300 text-amber-900 dark:text-amber-200 font-bold">
            <p className="text-sm">
              Materi untuk semester ini sedang disiapkan. Silakan pilih semester lainnya!
            </p>
          </div>
        )}
      </div>

      {/* Reading Detail Modal per Topic */}
      {activeTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#fffef5] via-[#fef9eb] to-[#fef3c7] dark:bg-gradient-to-b dark:from-[#3a2d1d] dark:via-[#423420] dark:to-[#2e2316] rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-400 dark:border-amber-500">
            {/* Close Button */}
            <button
              onClick={() => {
                speech.stop();
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
                    `${activeTopic.title}. ${activeTopic.reading.summary}. Poin penting: ${activeTopic.reading.keyPoints.join('. ')}`
                  )
                }
                className="btn-chunky inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-200 text-xs font-black border border-sky-300 shadow-[0_2px_0_#0284c7]"
              >
                <Volume2 className="w-4 h-4 text-sky-600" />
                <span>Baca Nyaring (Suara Bahasa Indonesia)</span>
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

            {/* Fun Fact / Example Story */}
            {activeTopic.reading.funFact && (
              <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200">
                <div className="font-black flex items-center gap-1 mb-1">
                  <Lightbulb className="w-4 h-4 text-emerald-600" />
                  <span>Tahukah Kamu?</span>
                </div>
                <p className="font-medium">{activeTopic.reading.funFact}</p>
              </div>
            )}

            {activeTopic.reading.exampleStory && (
              <div className="mb-5 p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 text-xs sm:text-sm text-purple-900 dark:text-purple-200">
                <div className="font-black mb-1">📖 Cerita Sehari-hari:</div>
                <p className="font-medium italic">"{activeTopic.reading.exampleStory}"</p>
              </div>
            )}

            {/* External link if any */}
            {activeTopic.reading.externalLink && (
              <div className="mb-5 text-center">
                <a
                  href={activeTopic.reading.externalLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 underline hover:text-sky-800"
                >
                  <span>{activeTopic.reading.externalLink.title}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Bottom Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  speech.stop();
                  setActiveTopic(null);
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-heading font-black text-sm"
              >
                Tutup Materi
              </button>
              <button
                onClick={() => {
                  speech.stop();
                  audio.playClick();
                  onNavigatePlay();
                }}
                className="btn-chunky flex-1 w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-heading font-black text-base shadow-[0_4px_0_#065f46] border border-emerald-300"
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
