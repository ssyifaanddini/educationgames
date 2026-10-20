/**
 * Kurikulum Merdeka - Pendidikan Pancasila Kelas 4
 * Struktur Semester Ganjil & Genap dengan Bab dan Peta Materi Lengkap
 */

export interface MateriCultureItem {
  category: string;
  name: string;
  origin: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

export interface MateriSubSection {
  number: number;
  title: string;
  introParagraphs?: string[];
  bulletPoints?: { label?: string; text: string }[];
  closingNote?: string;
  cultureItems?: MateriCultureItem[];
  calloutBox?: {
    badge: string;
    heading: string;
    summary: string;
    points: string[];
  };
}

export interface PetaMateriItem {
  code: 'A' | 'B' | 'C' | 'D';
  letter: string;
  title: string;
  subtext: string;
  icon: string;
  questionCount: number;
  readingSummary: string;
  keyPoints: string[];
  funFact?: string;
  exampleStory?: string;
  detailedSections?: MateriSubSection[];
}

export interface PancasilaBab {
  id: string;
  number: number;
  semester: 'ganjil' | 'genap';
  badgeTitle: string; // e.g. "BAB 1: Mengenal Lingkungan Sekitar"
  title: string;
  heroHeadline: string; // "Ayo, Jelajahi Lingkungan Sekitar!"
  heroIntro: string; // "Hai, teman-teman! Setiap orang memiliki identitas yang unik..."
  icon: string;
  color: string;
  accentBg: string;
  petaMateri: PetaMateriItem[];
}

export const PANCASILA_BABS: PancasilaBab[] = [
  // ==========================================
  // SEMESTER GANJIL: BAB 1 & BAB 2
  // ==========================================
  {
    id: 'bab-1',
    number: 1,
    semester: 'ganjil',
    badgeTitle: 'BAB 1: Mengenal Lingkungan Sekitar',
    title: 'Mengenal Lingkungan Sekitar',
    heroHeadline: 'Ayo, Jelajahi Lingkungan Sekitar!',
    heroIntro:
      'Hai, teman-teman! Setiap orang memiliki identitas yang unik. Kita juga tinggal di lingkungan yang memiliki beragam budaya, masyarakat, dan tempat menarik. Yuk, belajar mengenal identitas, menghargai perbedaan, serta memahami lingkungan tempat tinggal kita!',
    icon: '🏘️',
    color: '#0284c7',
    accentBg: 'from-sky-500/10 to-blue-500/10',
    petaMateri: [
      {
        code: 'A',
        letter: 'A',
        title: 'A. Mengenal Identitas',
        subtext: 'Identitas diri, keluarga, teman, dan masyarakat.',
        icon: '🇮🇩',
        questionCount: 15,
        readingSummary:
          'Identitas adalah ciri atau keterangan yang menunjukkan siapa diri seseorang. Setiap orang memiliki identitas yang dapat sama maupun berbeda dengan orang lain.',
        keyPoints: [
          'Identitas diri: keterangan tentang diri sendiri, misalnya nama, tempat asal, bahasa yang digunakan, serta budaya keluarga.',
          'Identitas keluarga: ciri latar belakang keluarga, asal daerah orang tua, bahasa di rumah, dan tradisi keluarga.',
          'Identitas teman: dikenali melalui perkenalan dan interaksi sehari-hari dengan sopan.',
          'Identitas budaya masyarakat: kesenian daerah (Reog Ponorogo), alat musik tradisional (Tifa), pakaian adat, bahasa daerah, dan makanan khas.',
          'Perbedaan identitas adalah bagian keberagaman Indonesia yang harus dikenali dan dihargai.'
        ],
        funFact: 'Indonesia memiliki lebih dari 718 bahasa daerah dan lebih dari 1.300 suku bangsa dari Sabang sampai Merauke!',
        exampleStory:
          'Di kelas 4, Maria dari suku Dani memperkenalkan alat musik Tifa kepada teman-temannya. Andi yang berasal dari Bugis menceritakan pakaian Baju Bodo miliknya. Semuanya bangga memperkenalkan budayanya!',
        detailedSections: [
          {
            number: 1,
            title: '1. Apa itu identitas?',
            introParagraphs: [
              'Identitas adalah ciri atau keterangan yang menunjukkan siapa diri seseorang. Setiap orang memiliki identitas yang dapat sama maupun berbeda dengan orang lain.',
              'Identitas dapat berkaitan dengan nama, tempat asal, bahasa, budaya, suku bangsa, agama atau kepercayaan, serta kebiasaan dalam keluarga.'
            ]
          },
          {
            number: 2,
            title: '2. Identitas diri, keluarga, dan teman',
            bulletPoints: [
              {
                label: 'Identitas diri',
                text: 'keterangan tentang diri sendiri, misalnya nama, tempat asal, bahasa yang digunakan, serta budaya keluarga.'
              },
              {
                label: 'Identitas keluarga',
                text: 'ciri atau latar belakang keluarga, misalnya asal daerah orang tua, bahasa yang digunakan di rumah, dan tradisi keluarga.'
              },
              {
                label: 'Identitas teman',
                text: 'ciri atau latar belakang teman yang dapat kita kenali melalui perkenalan dan interaksi sehari-hari.'
              }
            ],
            closingNote:
              'Kita dapat mengenal identitas teman dengan bertanya secara sopan dan mendengarkan ceritanya.'
          },
          {
            number: 3,
            title: '3. Identitas budaya masyarakat',
            introParagraphs: [
              'Masyarakat Indonesia memiliki beragam identitas budaya. Contohnya meliputi:'
            ],
            cultureItems: [
              {
                category: 'Kesenian Daerah',
                name: 'Reog Ponorogo',
                origin: 'Ponorogo, Jawa Timur',
                description:
                  'Reog Ponorogo merupakan salah satu kesenian tradisional yang berasal dari Ponorogo, Jawa Timur.',
                imageSrc: '/reog-ponorogo.jpg',
                imageAlt: 'Kesenian Tradisional Reog Ponorogo dari Ponorogo, Jawa Timur'
              },
              {
                category: 'Alat Musik Tradisional',
                name: 'Tifa',
                origin: 'Maluku dan Papua',
                description:
                  'Tifa merupakan alat musik tradisional yang dikenal di wilayah Indonesia bagian timur, termasuk Maluku dan Papua.',
                imageSrc: '/alat-musik-tifa.jpg',
                imageAlt: 'Alat Musik Tradisional Tifa dari Maluku dan Papua'
              },
              {
                category: 'Pakaian Adat',
                name: 'Pakaian Adat Kalimantan',
                origin: 'Kalimantan',
                description:
                  'Pakaian adat mencerminkan kekayaan tradisi dan budaya berbagai daerah di Indonesia.',
                imageSrc: '/pakaian-adat-kalimantan.jpg',
                imageAlt: 'Pakaian Adat Tradisional Kalimantan'
              }
            ],
            closingNote:
              'Bahasa daerah, makanan tradisional, tarian, pakaian adat, dan kebiasaan masyarakat juga dapat menjadi bagian dari identitas budaya.'
          },
          {
            number: 4,
            title: '4. Identitas yang berbeda bukan alasan untuk membeda-bedakan',
            introParagraphs: [
              'Teman-teman kita mungkin memiliki bahasa daerah, kebiasaan keluarga, budaya, atau agama dan kepercayaan yang berbeda. Perbedaan tersebut merupakan bagian dari keberagaman masyarakat Indonesia.',
              'Kita perlu mengenali perbedaan agar dapat memahami orang lain dan hidup berdampingan dengan baik.'
            ]
          },
          {
            number: 5,
            title: '5. Ayo ingat!',
            calloutBox: {
              badge: 'Ayo Ingat!',
              heading: 'Ingat, ya! Identitas setiap orang dan kelompok masyarakat dapat berbeda. Perbedaan tersebut merupakan bagian dari keberagaman Indonesia.',
              summary: 'Poin penting yang harus selalu diingat:',
              points: [
                'Setiap orang memiliki identitas.',
                'Identitas masyarakat memiliki beragam bentuk.',
                'Setiap daerah mempunyai budaya dan ciri khas.',
                'Perbedaan identitas perlu dikenali dan dihargai.'
              ]
            }
          }
        ]
      },
      {
        code: 'B',
        letter: 'B',
        title: 'B. Menghargai Perbedaan Identitas',
        subtext: 'Sikap menghormati perbedaan dan hidup rukun.',
        icon: '🤝',
        questionCount: 18,
        readingSummary:
          "Semboyan 'Bhinneka Tunggal Ika' mengajarkan kita bahwa meskipun kita memiliki perbedaan suku, bahasa, agama, dan kebiasaan, kita tetap satu bangsa yang bersatu dan saling menyayangi.",
        keyPoints: [
          'Sikap Toleransi: Menghormati teman yang sedang menjalankan ibadah dengan menjaga ketenangan dan saling mendoakan kebaikan.',
          'Bahasa Persatuan: Menggunakan Bahasa Indonesia yang baik dan santun saat berinteraksi di sekolah agar semua teman saling mengerti tanpa hambatan.',
          'Menolak Perundungan (Bullying): Perbedaan logat bicara, ciri fisik, atau adat budaya bukan alasan untuk mengejek, melainkan keunikan yang harus kita hargai.',
          'Musyawarah Mufakat: Menyelesaikan perbedaan pendapat atau jadwal kegiatan kelas dengan berdiskusi secara damai dan kepala dingin.'
        ],
        funFact:
          'Di banyak daerah di Indonesia, warga lintas agama saling bersilaturahmi dan berbagi kue saat perayaan Idul Fitri, Natal, Nyepi, dan Waisak!',
        exampleStory:
          'Saat jam istirahat, Ajeng membawa bekal kue lemper khas daerahnya. Boris penasaran dan bertanya dengan sopan. Ajeng senang membaginya dan mereka makan bersama dengan gembira.'
      },
      {
        code: 'C',
        letter: 'C',
        title: 'C. Perangkat Desa dan Kelurahan',
        subtext: 'Mengenal perangkat pemerintahan dan tugasnya.',
        icon: '🏛️',
        questionCount: 18,
        readingSummary:
          'Pemerintahan desa dan kelurahan bertugas melayani kebutuhan administrasi, menjaga ketertiban umum, dan menyalurkan program pembangunan bagi kemakmuran warga di wilayahnya.',
        keyPoints: [
          'Kepala Desa vs Lurah: Kepala desa dipilih langsung oleh warga desa melalui Pilkades, sedangkan Lurah adalah Pegawai Negeri Sipil (PNS/ASN) yang diangkat oleh bupati atau wali kota.',
          'Badan Permusyawaratan Desa (BPD): Lembaga desa yang menampung dan menyalurkan aspirasi warga serta membahas rancangan peraturan desa bersama kepala desa.',
          'Sekretaris Desa/Kelurahan: Memimpin urusan tata usaha administrasi kantor, pengarsipan berkas warga, dan penyusunan laporan keuangan.',
          'Kepala Dusun (Kadus) & RT/RW: Membantu kepala desa dalam pelaksanaan tugas kewilayahan di tiap dusun, rukun warga, dan rukun tetangga.'
        ],
        funFact:
          'Kantor desa tertua yang masih berdiri kokoh di Jawa dan Sumatra telah difungsikan lebih dari 100 tahun sebagai pusat rembuk warga!',
        exampleStory:
          'Pak RT mendampingi warga yang ingin mengusulkan perbaikan lampu jalan desa ke kantor balai desa agar dapat dibahas dalam musyawarah rencana pembangunan desa bersama Kepala Desa.'
      },
      {
        code: 'D',
        letter: 'D',
        title: 'D. Mengenal dan Menjelajahi Lingkungan Tempat Tinggal',
        subtext: 'Lingkungan alam, lingkungan buatan, dan wilayah tempat tinggal.',
        icon: '🗺️',
        questionCount: 19,
        readingSummary:
          'Lingkungan tempat tinggal terdiri atas bentang alam alami ciptaan Tuhan dan lingkungan buatan yang didirikan oleh manusia untuk memenuhi kebutuhan hidup sehari-hari.',
        keyPoints: [
          'Lingkungan Alam: Bentang alam alami yang terbentuk tanpa campur tangan manusia seperti sungai, gunung, danau, laut, bukit, dan hutan lindung.',
          'Lingkungan Buatan: Bangunan fasilitas umum yang dirancang dan dibangun manusia seperti sekolah, puskesmas, pasar, jalan raya, jembatan, dan waduk.',
          'Puskesmas: Pusat Kesehatan Masyarakat yang menyediakan layanan berobat, imunisasi balita dan anak, serta penyuluhan pola hidup bersih dan sehat.',
          'Teknik Menjelajah: Mengamati fasilitas sarana umum, mencatat pengamatan dengan tertib, dan mewawancarai narasumber (Ketua RT, RW, atau tokoh tetangga).'
        ],
        funFact:
          'Ruang Terbuka Hijau (RTH) dan pepohonan di tepi jalan desa berfungsi sebagai paru-paru wilayah yang menyerap polusi dan menghasilkan oksigen segar!',
        exampleStory:
          'Lestari dan kelompok belajarnya berjalan menyusuri jalan setapak desa, mencatat sawah bertingkat di tepi sungai, dan berkunjung ke posyandu untuk bertanya cara merawat kesehatan lingkungan.'
      }
    ]
  },
  {
    id: 'bab-2',
    number: 2,
    semester: 'ganjil',
    badgeTitle: 'BAB 2: Aku Anak yang Disiplin',
    title: 'Aku Anak yang Disiplin',
    heroHeadline: 'Aku Anak yang Disiplin, Tertib, dan Bertanggung Jawab!',
    heroIntro:
      'Aturan dan norma dibuat agar hidup kita tertib, aman, dan tenteram. Sebagai anak Indonesia yang hebat, kita wajib mematuhi aturan di rumah, sekolah, dan lingkungan sekitar dengan penuh keikhlasan serta menjalankan kewajiban dengan baik.',
    icon: '⏰',
    color: '#10b981',
    accentBg: 'from-emerald-500/10 to-teal-500/10',
    petaMateri: [
      {
        code: 'A',
        letter: 'A',
        title: 'A. Norma dan Aturan di Sekitarku',
        subtext: 'Mengenal aturan tertulis, tidak tertulis, dan sopan santun.',
        icon: '📜',
        questionCount: 10,
        readingSummary:
          'Norma adalah kaidah atau pedoman bertingkah laku dalam masyarakat agar tercipta keteraturan dan keadilan bersama.',
        keyPoints: [
          'Macam-macam Norma: Norma agama, norma kesusilaan, norma kesopanan, dan norma hukum.',
          'Aturan di Rumah: Membantu orang tua, merapikan tempat tidur, dan membagi waktu belajar serta bermain.',
          'Aturan di Sekolah: Hadir tepat waktu, memakai seragam lengkap, menyimak penjelasan guru, dan menjaga kebersihan kelas.'
        ],
        funFact: 'Sikap antre dengan tertib saat naik bus atau jajan di kantin adalah cerminan anak berkarakter disiplin tinggi!',
        exampleStory:
          'Andi selalu menyiapkan buku pelajaran di tas pada malam hari sebelum tidur, sehingga di pagi hari ia tidak pernah terburu-buru dan datang tepat waktu ke sekolah.'
      },
      {
        code: 'B',
        letter: 'B',
        title: 'B. Hak dan Kewajiban Anak',
        subtext: 'Keseimbangan pemenuhan hak dan pelaksanaan kewajiban.',
        icon: '⚖️',
        questionCount: 10,
        readingSummary:
          'Kewajiban harus didahulukan dan dilaksanakan dengan penuh rasa tanggung jawab sebelum kita menuntut hak yang kita miliki.',
        keyPoints: [
          'Hak Anak di Rumah: Memperoleh kasih sayang orang tua, makanan bergizi, tempat tinggal yang aman, dan perlindungan.',
          'Kewajiban Anak di Rumah: Menghormati orang tua, belajar giat, dan membantu pekerjaan rumah yang ringan.',
          'Hak di Sekolah: Mendapatkan bimbingan ilmu pengetahuan dari guru, fasilitas buku perpustakaan, dan lingkungan belajar yang nyaman.',
          'Kewajiban di Sekolah: Mengerjakan tugas sekolah dengan mandiri, menghormati guru, dan rukun dengan semua teman.'
        ],
        funFact: 'Konvensi Hak-Hak Anak PBB menjamin hak setiap anak di seluruh dunia untuk tumbuh, bermain, dan bersekolah!',
        exampleStory:
          'Lestari selalu membersihkan meja belajarnya setelah selesai mengerjakan PR. Setelah kewajibannya tuntas, ia mendapat hak menikmati waktu bermain bersama adiknya.'
      },
      {
        code: 'C',
        letter: 'C',
        title: 'C. Musyawarah & Kesepakatan Bersama',
        subtext: 'Membuat tata tertib kelas dan menghargai keputusan musyawarah.',
        icon: '🗣️',
        questionCount: 8,
        readingSummary:
          'Musyawarah mufakat adalah cara terbaik untuk mengambil keputusan bersama demi kebaikan seluruh anggota kelompok.',
        keyPoints: [
          'Prinsip Musyawarah: Mendengarkan pendapat teman tanpa memotong pembicaraan dan menerima hasil mufakat dengan lapang dada.',
          'Kesepakatan Kelas: Aturan bersama yang disepakati oleh seluruh siswa dan wali kelas untuk menjaga kenyamanan belajar.',
          'Sanksi Edukatif: Peringatan yang bersifat mendidik bagi siswa yang melanggar kesepakatan agar dapat memperbaiki perilakunya.'
        ],
        funFact: 'Tradisi musyawarah sudah ada sejak zaman nenek moyang di nusantara dengan sebutan rembuk desa, kerapatan adat, atau kombongan!',
        exampleStory:
          'Siswa kelas 4 mengadakan musyawarah untuk menentukan jadwal piket kebersihan kelas. Semua memberikan usul dan menyepakati jadwal dengan adil dan gembira.'
      }
    ]
  },

  // ==========================================
  // SEMESTER GENAP: BAB 3 & BAB 4
  // ==========================================
  {
    id: 'bab-3',
    number: 3,
    semester: 'genap',
    badgeTitle: 'BAB 3: Kerja Sama di lingkunganku',
    title: 'Kerja Sama di Lingkunganku',
    heroHeadline: 'Berat Sama Dipikul, Ringan Sama Dijinjing!',
    heroIntro:
      'Gotong royong adalah jati diri dan kepribadian luhur bangsa Indonesia. Bersama teman, tetangga, dan masyarakat sekitar, kita belajar bekerja sama, tolong-menolong, dan mempererat tali persaudaraan dalam keberagaman.',
    icon: '🤝',
    color: '#f59e0b',
    accentBg: 'from-amber-500/10 to-orange-500/10',
    petaMateri: [
      {
        code: 'A',
        letter: 'A',
        title: 'A. Gotong Royong Ciri Khas Bangsa',
        subtext: 'Makna gotong royong dan tradisi kerja bersama di nusantara.',
        icon: '🌾',
        questionCount: 10,
        readingSummary:
          'Gotong royong berasal dari kata "gotong" (mengangkat bersama) dan "royong" (bersama-sama). Ini adalah modal utama persatuan Indonesia.',
        keyPoints: [
          'Tradisi Gotong Royong: Sambatan di Jawa, Rambu Solo di Toraja, Siadapari di Batak, Gugur Gunung di Yogyakarta.',
          'Nilai Luhur: Kebersamaan, keikhlasan tanpa pamrih, rasa kekeluargaan, dan memperkokoh persatuan bangsa.',
          'Manfaat: Pekerjaan berat terasa lebih ringan, cepat selesai, dan biaya menjadi lebih hemat.'
        ],
        funFact: 'Tradisi "Marrimpa Salo" di Sulawesi Selatan adalah gotong royong ribuan warga menangkap ikan bersama di muara sungai!',
        exampleStory:
          'Warga desa bergotong royong membersihkan saluran air menjelang musim hujan. Anak-anak membantu mengumpulkan sampah daun kering ke dalam karung goni.'
      },
      {
        code: 'B',
        letter: 'B',
        title: 'B. Kerja Sama di Rumah, Sekolah, dan RT/RW',
        subtext: 'Bentuk nyata tolong-menolong dan gotong royong sehari-hari.',
        icon: '🏡',
        questionCount: 10,
        readingSummary:
          'Kerja sama dapat kita praktikkan mulai dari lingkungan terkecil yaitu keluarga, lalu meluas ke lingkungan sekolah dan masyarakat tetangga.',
        keyPoints: [
          'Di Rumah: Bekerja sama membersihkan halaman bersama ayah dan ibu saat akhir pekan.',
          'Di Sekolah: Piket regu harian, kerja kelompok proyek belajar, dan mempersiapkan panggung pentas seni sekolah.',
          'Di RT/RW: Menjaga pos ronda malam, kerja bakti selokan, dan membantu tetangga yang sedang mengadakan hajatan.'
        ],
        funFact: 'Pancasila sila ke-3 (Persatuan Indonesia) menjadi pedoman utama dalam setiap bentuk kerja sama antarwarga bangsa!',
        exampleStory:
          'Boris dan teman kelompoknya berbagi tugas membuat maket rumah adat. Boris membuat kerangka dari stik es krim, Maria mewarnai atapnya, dan Andi menulis keterangannya.'
      },
      {
        code: 'C',
        letter: 'C',
        title: 'C. Merawat Kerukunan dalam Keberagaman',
        subtext: 'Tolong-menolong tanpa membedakan latar belakang suku dan agama.',
        icon: '❤️',
        questionCount: 8,
        readingSummary:
          'Saling tolong-menolong harus dilakukan secara tulus kepada siapa saja yang membutuhkan bantuan tanpa memandang perbedaan agama, suku, maupun asal daerah.',
        keyPoints: [
          'Prinsip Non-Diskriminatif: Menolong teman yang terjatuh di halaman sekolah tanpa memandang asal sukunya.',
          'Menghargai Tetangga: Menjaga ketenangan ketika tetangga sedang beristirahat atau beribadah di rumahnya.',
          'Menciptakan Lingkungan Damai: Saling menyapa dengan senyum ramah saat berpapasan di jalan lingkungan.'
        ],
        funFact: 'Pepatah Indonesia mengatakan: "Bersatu kita teguh, bercerai kita runtuh"!',
        exampleStory:
          'Ketika Pak Hasan tetangga sebelah sakit, warga sekitar bergiliran mengantar obat dan makanan hangat tanpa mempermasalahkan suku asal mereka.'
      }
    ]
  },
  {
    id: 'bab-4',
    number: 4,
    semester: 'genap',
    badgeTitle: 'BAB 4: Pancasila dalam Diriku',
    title: 'Pancasila dalam Diriku',
    heroHeadline: 'Pancasila Dasar Negaraku, Kebanggaan dalam Hatiku!',
    heroIntro:
      'Pancasila bukan hanya untuk dihafal, melainkan untuk diamalkan dalam ucapan dan tindakan kita setiap hari. Mari menjadi Pelajar Pancasila yang beriman, berakhlak mulia, bergotong royong, mandiri, dan berkebinekaan global.',
    icon: '⭐',
    color: '#ec4899',
    accentBg: 'from-pink-500/10 to-rose-500/10',
    petaMateri: [
      {
        code: 'A',
        letter: 'A',
        title: 'A. Makna dan Simbol 5 Sila Pancasila',
        subtext: 'Mengenal Garuda Pancasila dan arti lambang setiap sila.',
        icon: '🦅',
        questionCount: 10,
        readingSummary:
          'Garuda Pancasila adalah lambang negara Indonesia. Di dadanya terdapat perisai berisi 5 simbol sila yang menjadi pedoman hidup bangsa.',
        keyPoints: [
          'Sila 1: Bintang Emas - Ketuhanan Yang Maha Esa (keimanan dan ketakwaan kepada Tuhan).',
          'Sila 2: Rantai Emas - Kemanusiaan yang Adil dan Beradab (persamaan derajat dan kasih sayang sesama manusia).',
          'Sila 3: Pohon Beringin - Persatuan Indonesia (tempat berteduh yang mempersatukan seluruh rakyat).',
          'Sila 4: Kepala Banteng - Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan (musyawarah).',
          'Sila 5: Padi dan Kapas - Keadilan Sosial bagi Seluruh Rakyat Indonesia (kesejahteraan dan kemakmuran bersama).'
        ],
        funFact: 'Jumlah bulu pada sayap garuda adalah 17, ekor 8, pangkal ekor 19, dan leher 45, melambangkan tanggal kemerdekaan 17 Agustus 1945!',
        exampleStory:
          'Andi selalu berdoa dengan khusyuk sebelum mulai belajar sebagai pengamalan sila pertama Pancasila di kelas.'
      },
      {
        code: 'B',
        letter: 'B',
        title: 'B. Pengamalan Pancasila Sehari-hari',
        subtext: 'Penerapan nilai-nilai luhur Pancasila dalam keluarga dan sekolah.',
        icon: '🌟',
        questionCount: 10,
        readingSummary:
          'Mengamalkan Pancasila berarti menerapkan nilai ketuhanan, kemanusiaan, persatuan, kerakyatan, dan keadilan dalam kehidupan nyata.',
        keyPoints: [
          'Pengamalan Sila 1: Berdoa sebelum makan dan belajar, tidak mengganggu teman beribadah.',
          'Pengamalan Sila 2: Menolong teman yang terkena musibah, bertutur kata sopan kepada orang yang lebih tua.',
          'Pengamalan Sila 3: Bangga memakai batik dan sepatu buatan Indonesia, cinta tanah air.',
          'Pengamalan Sila 4: Menghargai hasil musyawarah pemilihan ketua kelas dengan tertib.',
          'Pengamalan Sila 5: Gemar menabung, tidak boros jajan, dan menghargai karya cipta orang lain.'
        ],
        funFact: 'Pancasila lahir dari penggalian nilai-nilai luhur bangsa Indonesia yang telah hidup ribuan tahun sebelum Indonesia merdeka!',
        exampleStory:
          'Ajeng menyisihkan uang sakunya untuk ditabung di celengan dan sebagian disumbangkan bagi korban banjir di desanya (Sila ke-2 dan ke-5).'
      },
      {
        code: 'C',
        letter: 'C',
        title: 'C. Menjadi Pelajar Pancasila Berkarakter',
        subtext: '6 Dimensi Profil Pelajar Pancasila bagi generasi penerus bangsa.',
        icon: '🎖️',
        questionCount: 8,
        readingSummary:
          'Profil Pelajar Pancasila adalah pedoman bagi murid Indonesia agar memiliki kompetensi global sekaligus memegang teguh nilai-nilai luhur Pancasila.',
        keyPoints: [
          'Beriman & Berakhlak Mulia: Menjaga akhlak kepada Tuhan, sesama manusia, dan alam sekitar.',
          'Berkebinekaan Global: Mencintai budaya lokal nusantara sekaligus terbuka pada kemajuan dunia.',
          'Bergotong Royong & Mandiri: Senang bekerja sama dan mampu bertanggung jawab atas proses belajarnya.',
          'Bernalar Kritis & Kreatif: Berani bertanya, menganalisis informasi dengan bijak, dan menghasilkan gagasan orisinal.'
        ],
        funFact: 'Generasi muda yang cerdas dan berkarakter Pancasila adalah kunci menyongsong Indonesia Emas 2045!',
        exampleStory:
          'Maria dan teman-temannya aktif dalam kegiatan menanam pohon di halaman sekolah sebagai wujud cinta lingkungan dan akhlak mulia kepada alam ciptaan Tuhan.'
      }
    ]
  }
];
