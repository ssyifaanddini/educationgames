import React, { useState } from 'react';
import { Volume2, VolumeX, Moon, Sun, Home, GraduationCap, X, Check, School } from 'lucide-react';
import { ScreenState } from '../../types/game';
import { audio } from '../../utils/audio';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface HeaderProps {
  currentScreen: ScreenState;
  onNavigate: (screen: ScreenState) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  schoolName: string;
  teacherName: string;
  onUpdateSchoolAndTeacher: (school: string, teacher: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  darkMode,
  onToggleDarkMode,
  schoolName,
  teacherName,
  onUpdateSchoolAndTeacher,
}) => {
  const [isMuted, setIsMuted] = useState(audio.isMuted);
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [tempSchoolName, setTempSchoolName] = useState(schoolName);
  const [tempTeacherName, setTempTeacherName] = useState(teacherName);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleSoundToggle = () => {
    const muted = audio.toggleMute();
    setIsMuted(muted);
  };

  const handleGoHome = () => {
    audio.playClick();
    onNavigate('cover');
  };

  const handleOpenSchoolModal = () => {
    audio.playClick();
    setTempSchoolName(schoolName);
    setTempTeacherName(teacherName);
    setSaveSuccess(false);
    setShowSchoolModal(true);
  };

  const handleSaveSchoolAndTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    audio.playClick();
    const finalSchool = tempSchoolName.trim() || 'SD Negeri Merdeka 01';
    const finalTeacher = tempTeacherName.trim() || 'Bapak / Ibu Guru Pembimbing';
    onUpdateSchoolAndTeacher(finalSchool, finalTeacher);
    setSaveSuccess(true);
    setTimeout(() => {
      setShowSchoolModal(false);
      setSaveSuccess(false);
    }, 1000);
  };

  const isGameScreen = currentScreen === 'game';
  const isCoverScreen = currentScreen === 'cover';
  const isCertificateScreen = currentScreen === 'certificates';

  return (
    <header className="relative z-40 w-full px-3 sm:px-4 py-2.5 flex items-center justify-between no-print max-w-5xl mx-auto">
      {/* Top Left: Logo & Beranda Button linking to cover */}
      <div className="flex items-center gap-2">
        {!isCoverScreen && !isGameScreen && !isCertificateScreen && (
          <button
            onClick={handleGoHome}
            title="Kembali ke Beranda"
            className="group flex items-center bg-white/95 dark:bg-[#3d2e1c]/95 rounded-2xl p-1.5 px-2.5 shadow-md border-2 border-amber-300 dark:border-amber-500 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            <div className="h-9 w-28 sm:h-11 sm:w-36 flex items-center justify-center">
              {!logoError ? (
                <img
                  src="/logo.png"
                  alt="GAMBRENG"
                  className="max-h-full max-w-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                  onLoad={() => setLogoError(false)}
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (!img.src.includes('src/assets/images')) {
                      img.src = '/src/assets/images/logo.png';
                    } else {
                      setLogoError(true);
                    }
                  }}
                />
              ) : (
                <div className="text-center leading-none">
                  <span className="font-heading font-black text-xs text-amber-700 dark:text-amber-300 block">GAMBRENG</span>
                  <span className="text-[7px] text-amber-800 dark:text-amber-300 font-bold">Beranda</span>
                </div>
              )}
            </div>
          </button>
        )}

        {/* Dedicated "Beranda" Menu button on every page except Cover */}
        {!isCoverScreen && (
          <button
            onClick={handleGoHome}
            title="Kembali ke Beranda"
            className="btn-chunky flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-heading font-black text-xs sm:text-sm border-2 border-amber-500 shadow-[0_3px_0_#d97706] active:translate-y-1 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4 text-amber-950" />
            <span>Beranda</span>
          </button>
        )}

        {/* Menu Sekolah & Guru Button */}
        <button
          onClick={handleOpenSchoolModal}
          title="Pengaturan Menu Sekolah & Nama Guru"
          className="btn-chunky flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-white/95 dark:bg-[#3d2e1c]/95 text-amber-950 dark:text-amber-100 border-2 border-amber-300 dark:border-amber-500 text-xs sm:text-sm font-black shadow-[0_2px_0_rgba(217,119,6,0.15)] hover:bg-amber-50 dark:hover:bg-[#4d3c26] transition-all cursor-pointer"
        >
          <GraduationCap className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="hidden sm:inline max-w-[130px] truncate">{schoolName}</span>
          <span className="sm:hidden">Sekolah</span>
        </button>
      </div>

      {/* Top Right Controls: PWA Install, Audio Toggle, Dark Mode */}
      <div className="flex items-center gap-2">
        {/* PWA Install Button */}
        {!isInstalled && isInstallable && (
          <button
            onClick={install}
            className="btn-chunky flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-black px-3 py-1.5 rounded-xl shadow-[0_3px_0_#059669] border border-emerald-400"
          >
            <span>📲</span>
            <span className="hidden sm:inline">Pasang</span>
          </button>
        )}

        {!isInstalled && isIOS && (
          <button
            onClick={() => setShowIOSModal(true)}
            className="btn-chunky flex items-center gap-1 bg-sky-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-xl shadow-[0_3px_0_#0284c7]"
          >
            <span>📲</span>
            <span>iOS</span>
          </button>
        )}

        {/* Audio Toggle */}
        <button
          onClick={handleSoundToggle}
          title={isMuted ? 'Nyalakan Efek Suara' : 'Matikan Efek Suara'}
          className={`btn-chunky p-2 rounded-xl border-2 transition-all shadow-[0_3px_0_rgba(217,119,6,0.2)] cursor-pointer ${
            isMuted
              ? 'bg-white/90 dark:bg-[#4d3c26] text-amber-800/60 dark:text-amber-300/60 border-amber-200 dark:border-amber-700'
              : 'bg-amber-400 text-amber-950 border-amber-500 shadow-[0_3px_0_#d97706]'
          }`}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 animate-pulse" />}
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          title={darkMode ? 'Ubah ke Mode Siang' : 'Ubah ke Mode Malam'}
          className="btn-chunky p-2 rounded-xl bg-white/90 dark:bg-[#4d3c26] text-amber-950 dark:text-amber-200 border-2 border-amber-300 dark:border-amber-500 shadow-[0_3px_0_rgba(217,119,6,0.2)] hover:scale-105 cursor-pointer"
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5 text-amber-900" />}
        </button>
      </div>

      {/* Modal Menu Sekolah & Guru */}
      {showSchoolModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-gradient-to-b from-[#fffef5] to-[#fef3c7] dark:bg-gradient-to-b dark:from-[#3a2d1d] dark:to-[#2e2316] p-6 shadow-2xl border-4 border-amber-400 dark:border-amber-500 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-amber-200 dark:border-amber-700 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-[#4d3c26] text-amber-700 dark:text-amber-300 flex items-center justify-center text-xl shadow-inner border border-amber-300 dark:border-amber-600">
                  🏫
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-heading font-black text-amber-950 dark:text-amber-100 leading-tight">
                    Pengaturan Sekolah & Guru
                  </h3>
                  <p className="text-xs text-amber-800/80 dark:text-amber-200/90 font-bold">
                    Data ini otomatis tercetak pada sertifikat siswa
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSchoolModal(false)}
                className="p-1.5 rounded-full hover:bg-amber-100 dark:hover:bg-[#4d3c26] text-amber-800 dark:text-amber-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSchoolAndTeacher} className="space-y-4">
              {/* Menu Sekolah: Bisa diisi nama sekolah apa saja */}
              <div>
                <label className="block text-xs font-black text-amber-950 dark:text-amber-100 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <School className="w-4 h-4 text-amber-500" />
                  <span>Nama Sekolah (Bebas diisi apa saja):</span>
                </label>
                <input
                  type="text"
                  required
                  value={tempSchoolName}
                  onChange={(e) => setTempSchoolName(e.target.value)}
                  placeholder="Contoh: SD Negeri Merdeka 01"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-amber-300 dark:border-amber-600 bg-white dark:bg-[#4d3c26] text-sm font-bold text-amber-950 dark:text-amber-100 focus:border-amber-500 focus:outline-none shadow-xs"
                />
              </div>

              {/* Menu Guru: Bisa diisi nama guru apa saja */}
              <div>
                <label className="block text-xs font-black text-amber-950 dark:text-amber-100 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-amber-500" />
                  <span>Nama Guru / Pembimbing (Bebas diisi):</span>
                </label>
                <input
                  type="text"
                  required
                  value={tempTeacherName}
                  onChange={(e) => setTempTeacherName(e.target.value)}
                  placeholder="Contoh: Ibu Siti Rahmawati, S.Pd."
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-amber-300 dark:border-amber-600 bg-white dark:bg-[#4d3c26] text-sm font-bold text-amber-950 dark:text-amber-100 focus:border-amber-500 focus:outline-none shadow-xs"
                />
              </div>

              {/* Pratinjau Teks */}
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-[#4d3c26] border border-amber-200 dark:border-amber-600 text-xs text-amber-950 dark:text-amber-100 font-bold">
                <span className="font-black block text-amber-800 dark:text-amber-300 mb-1">
                  💡 Pratinjau Tanda Tangan Sertifikat:
                </span>
                <p>• Kepala Sekolah: <strong>{tempSchoolName || '-'}</strong></p>
                <p>• Guru Pendamping: <strong>{tempTeacherName || '-'}</strong></p>
              </div>

              {saveSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 text-xs font-black border border-emerald-300 flex items-center gap-1.5 animate-bounce">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Data sekolah & guru berhasil disimpan!</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSchoolModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-amber-100 dark:bg-[#4d3c26] text-amber-900 dark:text-amber-200 text-xs font-black hover:bg-amber-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-chunky w-1/2 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 text-xs font-heading font-black shadow-[0_3px_0_#d97706] border border-amber-500 cursor-pointer"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* iOS Safari Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#fffef5] to-[#fef3c7] dark:bg-gradient-to-b dark:from-[#3a2d1d] dark:to-[#2e2316] p-5 shadow-2xl border-4 border-amber-400 text-amber-950 dark:text-amber-100">
            <h3 className="text-lg font-heading font-black text-amber-950 dark:text-amber-100 text-center">
              Pasang di iPhone / iPad
            </h3>
            <p className="mt-3 text-sm text-amber-900 dark:text-amber-200 leading-relaxed font-bold">
              1. Ketuk tombol <strong>Bagikan (Share)</strong> di bar bawah Safari.<br />
              2. Gulir ke bawah lalu pilih <strong>Tambah ke Layar Utama (Add to Home Screen)</strong>.<br />
              3. Buka GAMBRENG langsung dari layar depan!
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-4 w-full rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-heading font-black py-2.5 text-sm shadow-[0_3px_0_#d97706] border border-amber-500 cursor-pointer"
            >
              Mengerti!
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
