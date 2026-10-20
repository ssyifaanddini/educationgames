import React, { useState, useRef } from 'react';
import { Player, Subject } from '../../types/game';
import { CharacterAvatar } from '../common/CharacterAvatar';
import {
  downloadElementAsPNG,
  downloadElementAsPDF,
  downloadAllCertificatesPDF,
} from '../../utils/certificate';
import { audio } from '../../utils/audio';
import {
  Download,
  Printer,
  FileText,
  Files,
  Award,
  ArrowLeft,
  Edit3,
  X,
  ExternalLink,
  Home,
} from 'lucide-react';

interface CertificateScreenProps {
  players: Player[];
  subject: Subject;
  playDurationSec: number;
  schoolName: string;
  teacherName: string;
  onUpdateSchoolAndTeacher: (school: string, teacher: string) => void;
  onBack: () => void;
  onNavigateFinal: () => void;
  onNavigateHome?: () => void;
}

export const CertificateScreen: React.FC<CertificateScreenProps> = ({
  players,
  subject,
  playDurationSec,
  schoolName,
  teacherName,
  onUpdateSchoolAndTeacher,
  onBack,
  onNavigateFinal,
  onNavigateHome,
}) => {
  const [selectedPlayerIdx, setSelectedPlayerIdx] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [blockedImageUrl, setBlockedImageUrl] = useState<string | null>(null);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string>('');

  const singleCertificateRef = useRef<HTMLDivElement>(null);
  const allCertificatesContainerRef = useRef<HTMLDivElement>(null);

  const selectedPlayer = players[selectedPlayerIdx] || players[0];

  // Duration in minutes
  const durationMinutes = Math.max(1, Math.round(playDurationSec / 60));
  const currentDateStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Category Badge helper
  const getBadgeName = (idx: number, player: Player) => {
    if (idx === 0) return 'Penjelajah Tercepat';
    if (player.score >= 4 || idx === 1) return 'Kolektor Bintang';
    if (player.challengesCompleted > 0 || idx === 2) return 'Paling Tangguh';
    return 'Kompak Abis';
  };

  const badgeName = getBadgeName(selectedPlayerIdx, selectedPlayer);

  // Real PNG Download
  const handleDownloadPNG = async () => {
    if (!singleCertificateRef.current) return;
    audio.playClick();
    setIsDownloading(true);
    setDownloadSuccessMessage('');

    const success = await downloadElementAsPNG(
      singleCertificateRef.current,
      selectedPlayer.nickname,
      (dataUrl) => {
        setBlockedImageUrl(dataUrl);
      }
    );

    setIsDownloading(false);
    if (success) {
      setDownloadSuccessMessage(`Sertifikat ${selectedPlayer.nickname} (PNG) berhasil diunduh!`);
      setTimeout(() => setDownloadSuccessMessage(''), 4000);
    }
  };

  // Real PDF Download
  const handleDownloadPDF = async () => {
    if (!singleCertificateRef.current) return;
    audio.playClick();
    setIsDownloading(true);
    setDownloadSuccessMessage('');

    const success = await downloadElementAsPDF(
      singleCertificateRef.current,
      selectedPlayer.nickname,
      (dataUrl) => {
        setBlockedImageUrl(dataUrl);
      }
    );

    setIsDownloading(false);
    if (success) {
      setDownloadSuccessMessage(`Sertifikat ${selectedPlayer.nickname} (PDF) berhasil diunduh!`);
      setTimeout(() => setDownloadSuccessMessage(''), 4000);
    }
  };

  // Real All Certificates PDF Download
  const handleDownloadAllPDF = async () => {
    if (!allCertificatesContainerRef.current) return;
    audio.playClick();
    setIsDownloading(true);
    setDownloadSuccessMessage('');

    const elements = Array.from(
      allCertificatesContainerRef.current.children
    ) as HTMLElement[];

    const success = await downloadAllCertificatesPDF(
      elements,
      players,
      (dataUrl) => {
        setBlockedImageUrl(dataUrl);
      }
    );

    setIsDownloading(false);
    if (success) {
      setDownloadSuccessMessage('Seluruh sertifikat peserta berhasil digabung menjadi 1 PDF!');
      setTimeout(() => setDownloadSuccessMessage(''), 4000);
    }
  };

  // Print
  const handlePrint = () => {
    audio.playClick();
    window.print();
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] p-3 sm:p-5 max-w-5xl mx-auto pb-12 select-none">
      {/* Top Bar Navigation (Hidden in print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              audio.playClick();
              onBack();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Podium</span>
          </button>

          {onNavigateHome && (
            <button
              onClick={() => {
                audio.playClick();
                onNavigateHome();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 text-xs font-black border border-amber-500 shadow-sm"
            >
              <Home className="w-4 h-4" />
              <span>Beranda</span>
            </button>
          )}
        </div>

        <button
          onClick={() => {
            audio.playClick();
            onNavigateFinal();
          }}
          className="btn-chunky inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 text-xs sm:text-sm font-heading font-black shadow-[0_3px_0_#d97706]"
        >
          <span>Halaman Akhir →</span>
        </button>
      </div>

      {/* Configurable School & Teacher Name Inputs (Hidden in print) */}
      <div className="no-print bg-white/95 dark:bg-[#3d2e1c]/95 rounded-2xl p-4 shadow-md border-2 border-amber-300 dark:border-amber-500/80 mb-4">
        <div className="flex items-center gap-2 mb-2 text-xs font-black text-amber-950 dark:text-amber-100">
          <Edit3 className="w-4 h-4 text-amber-500" />
          <span>Pengaturan Nama Sekolah & Guru (Bisa disesuaikan langsung):</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-amber-800 dark:text-amber-300 mb-0.5">Nama Sekolah:</label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => onUpdateSchoolAndTeacher(e.target.value, teacherName)}
              className="w-full px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-600 bg-amber-50/50 dark:bg-[#4d3c26] text-xs font-bold text-amber-950 dark:text-amber-100 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-amber-800 dark:text-amber-300 mb-0.5">Nama Guru / Pembimbing:</label>
            <input
              type="text"
              value={teacherName}
              onChange={(e) => onUpdateSchoolAndTeacher(schoolName, e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-600 bg-amber-50/50 dark:bg-[#4d3c26] text-xs font-bold text-amber-950 dark:text-amber-100 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Player Switcher Tabs (Hidden in print) */}
      <div className="no-print flex items-center gap-2 overflow-x-auto pb-2 mb-4">
        {players.map((p, idx) => {
          const isSelected = idx === selectedPlayerIdx;
          return (
            <button
              key={p.id}
              onClick={() => {
                audio.playClick();
                setSelectedPlayerIdx(idx);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-2xl border-2 transition-all shrink-0 ${
                isSelected
                  ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-md font-black'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 font-bold'
              }`}
            >
              <CharacterAvatar fileName={p.fileName} name={p.nickname} size="sm" ringColor={p.color} />
              <span className="text-xs">{p.nickname}</span>
              <span className="text-[10px] opacity-75">
                (#{idx + 1})
              </span>
            </button>
          );
        })}
      </div>

      {/* Download Action Buttons (Hidden in print) */}
      <div className="no-print flex flex-wrap items-center gap-2.5 mb-5">
        <button
          onClick={handleDownloadPNG}
          disabled={isDownloading}
          className="btn-chunky flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-heading font-black text-xs sm:text-sm shadow-[0_3px_0_#059669]"
        >
          <Download className="w-4 h-4" />
          <span>Unduh Gambar (PNG)</span>
        </button>

        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="btn-chunky flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-heading font-black text-xs sm:text-sm shadow-[0_3px_0_#0284c7]"
        >
          <FileText className="w-4 h-4" />
          <span>Unduh PDF</span>
        </button>

        {players.length > 1 && (
          <button
            onClick={handleDownloadAllPDF}
            disabled={isDownloading}
            className="btn-chunky flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-heading font-black text-xs sm:text-sm shadow-[0_3px_0_#7e22ce]"
          >
            <Files className="w-4 h-4" />
            <span>Unduh Semua Sertifikat (PDF)</span>
          </button>
        )}

        <button
          onClick={handlePrint}
          className="btn-chunky flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-heading font-black text-xs sm:text-sm shadow-[0_3px_0_#1e293b]"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak</span>
        </button>
      </div>

      {/* Success Notification */}
      {downloadSuccessMessage && (
        <div className="no-print mb-4 p-3 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-black border border-emerald-300 animate-bounce">
          ✓ {downloadSuccessMessage}
        </div>
      )}

      {/* FIXED A4 LANDSCAPE CERTIFICATE LAYOUT (Plain white background, ratio ~ 1.414) */}
      <div className="w-full flex justify-center overflow-x-auto pb-4">
        <div
          ref={singleCertificateRef}
          id="certificate-print-area"
          style={{ width: '840px', minHeight: '594px' }}
          className="bg-white text-slate-800 p-8 rounded-2xl shadow-2xl border-8 border-double border-amber-500 relative flex flex-col justify-between shrink-0 font-sans"
        >
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 text-amber-500 text-2xl">✤</div>
          <div className="absolute top-2 right-2 text-amber-500 text-2xl">✤</div>
          <div className="absolute bottom-2 left-2 text-amber-500 text-2xl">✤</div>
          <div className="absolute bottom-2 right-2 text-amber-500 text-2xl">✤</div>

          {/* 1. TOP CENTER: Logo on light rounded panel */}
          <div className="flex flex-col items-center">
            <div className="bg-amber-50/90 rounded-2xl px-6 py-2 border-2 border-amber-300 shadow-sm flex items-center justify-center">
              <img
                src="/logo.png"
                alt="GAMBRENG"
                className="h-16 max-w-xs object-contain"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (!img.src.includes('src/assets/images')) {
                    img.src = '/src/assets/images/logo.png';
                  } else {
                    img.style.display = 'none';
                  }
                }}
              />
            </div>
            <span className="font-heading font-black text-xs tracking-widest uppercase text-amber-800 mt-2">
              Kurikulum Merdeka • Kelas 4 Sekolah Dasar
            </span>
            <h1 className="font-heading font-black text-3xl tracking-wide text-slate-900 mt-1 uppercase border-b-2 border-amber-400 pb-1 px-8">
              Sertifikat Penghargaan
            </h1>
          </div>

          {/* 2. BODY: Award statement, player avatar & nickname */}
          <div className="flex flex-col items-center my-4 text-center">
            <p className="text-sm font-semibold text-slate-600 mb-2">
              Diberikan dengan penuh rasa bangga dan apresiasi kepada:
            </p>

            <div className="flex items-center gap-4 my-2">
              {/* Circular crop of character */}
              <CharacterAvatar
                fileName={selectedPlayer.fileName}
                name={selectedPlayer.nickname}
                size="xl"
                ringColor={selectedPlayer.color}
                className="border-4 border-amber-400 shadow-md"
              />
              <div className="text-left">
                <h2 className="font-heading font-black text-4xl text-amber-600 leading-tight">
                  {selectedPlayer.nickname}
                </h2>
                <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black border border-amber-300 mt-1">
                  {selectedPlayerIdx < 3 ? `Juara ${selectedPlayerIdx + 1}` : 'Sahabat Belajar Hebat'} • {badgeName}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 max-w-xl font-medium leading-relaxed mt-2">
              Atas keberhasilan, keaktifan, dan sportivitas yang luar biasa dalam menyelesaikan petualangan
              papan belajar digital mata pelajaran <strong>{subject.name}</strong> dengan perolehan skor akhir{' '}
              <strong className="text-amber-700">{selectedPlayer.score} Poin</strong>.
            </p>
          </div>

          {/* 3. DETAILS STRIP: Subject, Date, Duration */}
          <div className="grid grid-cols-3 gap-2 py-2 px-4 rounded-xl bg-amber-50/80 border border-amber-200 text-center text-xs font-bold text-slate-700">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Mata Pelajaran</span>
              <span>{subject.name}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Durasi Belajar</span>
              <span>{durationMinutes} Menit</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Tanggal</span>
              <span>{currentDateStr}</span>
            </div>
          </div>

          {/* 4. BOTTOM SIGNATURES: School & Teacher Name */}
          <div className="flex items-end justify-between pt-4 px-6 text-center text-xs">
            <div className="w-56">
              <span className="text-[10px] text-slate-500 uppercase block">Mengetahui,</span>
              <span className="font-bold text-slate-700">{schoolName}</span>
              <div className="h-12 border-b border-slate-400 my-1" />
              <span className="font-black text-slate-800">Kepala Sekolah</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-4 border-amber-400 bg-amber-100/50 flex flex-col items-center justify-center text-amber-700 shadow-inner">
                <span className="text-lg">★</span>
                <span className="text-[7px] font-black uppercase tracking-tighter">GAMBRENG</span>
              </div>
            </div>

            <div className="w-56">
              <span className="text-[10px] text-slate-500 uppercase block">Guru Pendamping,</span>
              <span className="font-bold text-slate-700">{subject.name}</span>
              <div className="h-12 border-b border-slate-400 my-1" />
              <span className="font-black text-slate-800">{teacherName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Off-screen Container for generating All Certificates PDF */}
      <div
        ref={allCertificatesContainerRef}
        className="fixed -left-[9999px] top-0 pointer-events-none opacity-0 select-none no-print"
        aria-hidden="true"
      >
        {players.map((p, idx) => (
          <div
            key={p.id}
            style={{ width: '840px', minHeight: '594px' }}
            className="bg-white text-slate-800 p-8 rounded-2xl border-8 border-double border-amber-500 flex flex-col justify-between font-sans relative"
          >
            {/* Top Center Logo */}
            <div className="flex flex-col items-center">
              <div className="bg-amber-50 rounded-2xl px-6 py-2 border-2 border-amber-300">
                <img
                  src="/logo.png"
                  alt="GAMBRENG"
                  className="h-16 max-w-xs object-contain"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (!img.src.includes('src/assets/images')) {
                      img.src = '/src/assets/images/logo.png';
                    } else {
                      img.style.display = 'none';
                    }
                  }}
                />
              </div>
              <span className="font-heading font-black text-xs tracking-widest uppercase text-amber-800 mt-2">
                Kurikulum Merdeka • Kelas 4 Sekolah Dasar
              </span>
              <h1 className="font-heading font-black text-3xl tracking-wide text-slate-900 mt-1 uppercase border-b-2 border-amber-400 pb-1 px-8">
                Sertifikat Penghargaan
              </h1>
            </div>

            {/* Body */}
            <div className="flex flex-col items-center my-4 text-center">
              <p className="text-sm font-semibold text-slate-600 mb-2">
                Diberikan dengan penuh rasa bangga dan apresiasi kepada:
              </p>
              <div className="flex items-center gap-4 my-2">
                <CharacterAvatar
                  fileName={p.fileName}
                  name={p.nickname}
                  size="xl"
                  ringColor={p.color}
                  className="border-4 border-amber-400 shadow-md"
                />
                <div className="text-left">
                  <h2 className="font-heading font-black text-4xl text-amber-600 leading-tight">
                    {p.nickname}
                  </h2>
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black border border-amber-300 mt-1">
                    {idx < 3 ? `Juara ${idx + 1}` : 'Sahabat Belajar Hebat'} • {getBadgeName(idx, p)}
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 max-w-xl font-medium leading-relaxed mt-2">
                Atas keberhasilan, keaktifan, dan sportivitas yang luar biasa dalam menyelesaikan petualangan
                papan belajar digital mata pelajaran <strong>{subject.name}</strong> dengan perolehan skor akhir{' '}
                <strong className="text-amber-700">{p.score} Poin</strong>.
              </p>
            </div>

            {/* Details */}
            <div className="grid grid-cols-3 gap-2 py-2 px-4 rounded-xl bg-amber-50 border border-amber-200 text-center text-xs font-bold text-slate-700">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Mata Pelajaran</span>
                <span>{subject.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Durasi Belajar</span>
                <span>{durationMinutes} Menit</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Tanggal</span>
                <span>{currentDateStr}</span>
              </div>
            </div>

            {/* Signatures */}
            <div className="flex items-end justify-between pt-4 px-6 text-center text-xs">
              <div className="w-56">
                <span className="text-[10px] text-slate-500 uppercase block">Mengetahui,</span>
                <span className="font-bold text-slate-700">{schoolName}</span>
                <div className="h-12 border-b border-slate-400 my-1" />
                <span className="font-black text-slate-800">Kepala Sekolah</span>
              </div>

              <div className="w-56">
                <span className="text-[10px] text-slate-500 uppercase block">Guru Pendamping,</span>
                <span className="font-bold text-slate-700">{subject.name}</span>
                <div className="h-12 border-b border-slate-400 my-1" />
                <span className="font-black text-slate-800">{teacherName}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fallback Modal when browser blocks download in iframe */}
      {blockedImageUrl && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-gradient-to-b from-[#fffef5] to-[#fef3c7] dark:bg-gradient-to-b dark:from-[#3a2d1d] dark:to-[#2e2316] rounded-3xl p-6 shadow-2xl border-4 border-amber-400 text-center">
            <button
              onClick={() => setBlockedImageUrl(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-amber-100 dark:bg-[#4d3c26] text-amber-800 dark:text-amber-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-heading font-black text-xl text-amber-950 dark:text-amber-100 mb-2">
              Simpan Sertifikat
            </h3>
            <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200 font-bold mb-4">
              💡 <em>Tekan lama gambar di bawah untuk menyimpan ke galerimu!</em>
            </p>
            <div className="w-full max-h-[60vh] overflow-y-auto rounded-xl border-2 border-amber-200 dark:border-amber-700 mb-4 p-1">
              <img src={blockedImageUrl} alt="Sertifikat" className="w-full h-auto rounded-lg" />
            </div>
            <button
              onClick={() => setBlockedImageUrl(null)}
              className="btn-chunky w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-heading font-black text-sm border-2 border-amber-500 shadow-[0_3px_0_#d97706] cursor-pointer"
            >
              Tutup Pratinjau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
