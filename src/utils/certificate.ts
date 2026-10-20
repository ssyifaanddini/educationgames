import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { Player, Subject } from '../types/game';

export interface CertificateMeta {
  schoolName: string;
  teacherName: string;
  dateStr: string;
  durationText: string;
  subject: Subject;
}

export const downloadElementAsPNG = async (
  element: HTMLElement,
  nickname: string,
  onBlocked?: (dataUrl: string) => void
): Promise<boolean> => {
  try {
    const dataUrl = await toPng(element, {
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      cacheBust: true,
    });

    const fileName = `Sertifikat-${nickname.trim().replace(/\s+/g, '_')}.png`;

    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;

    // Check if click triggers download
    let clickSuccess = false;
    try {
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      clickSuccess = true;
    } catch {
      clickSuccess = false;
    }

    if (!clickSuccess && onBlocked) {
      onBlocked(dataUrl);
    }
    return true;
  } catch (err) {
    console.error('Gagal membuat gambar sertifikat:', err);
    return false;
  }
};

export const downloadElementAsPDF = async (
  element: HTMLElement,
  nickname: string,
  onBlocked?: (dataUrl: string) => void
): Promise<boolean> => {
  try {
    const imgData = await toPng(element, {
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      cacheBust: true,
    });

    // A4 landscape: 297mm x 210mm
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    const fileName = `Sertifikat-${nickname.trim().replace(/\s+/g, '_')}.pdf`;

    try {
      pdf.save(fileName);
    } catch {
      if (onBlocked) {
        onBlocked(imgData);
      }
    }
    return true;
  } catch (err) {
    console.error('Gagal membuat PDF sertifikat:', err);
    return false;
  }
};

export const downloadAllCertificatesPDF = async (
  containerElements: HTMLElement[],
  players: Player[],
  onBlocked?: (dataUrl: string) => void
): Promise<boolean> => {
  try {
    if (containerElements.length === 0) return false;

    // A4 landscape: 297mm x 210mm
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < containerElements.length; i++) {
      const el = containerElements[i];
      if (i > 0) {
        pdf.addPage('a4', 'landscape');
      }

      const imgData = await toPng(el, {
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        cacheBust: true,
      });

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    }

    const fileName = `Semua_Sertifikat_GAMBRENG.pdf`;
    try {
      pdf.save(fileName);
    } catch {
      if (containerElements[0]) {
        const firstImg = await toPng(containerElements[0], { pixelRatio: 2 });
        if (onBlocked) {
          onBlocked(firstImg);
        }
      }
    }
    return true;
  } catch (err) {
    console.error('Gagal membuat multi-page PDF:', err);
    return false;
  }
};
