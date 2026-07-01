'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, FileText, Eye, Printer, Globe, Briefcase, GraduationCap, Award, Phone, Mail, MapPin, Linkedin, Github } from 'lucide-react'
import { useCvStore } from '@/store/cv-store'
import { useLanguageStore } from '@/store/language-store'
import { useToastStore } from '@/store/toast-store'

export const CvReader: React.FC = () => {
  const { isOpen, setOpen } = useCvStore()
  const { lang, toggleLang, t } = useLanguageStore()
  const { addToast } = useToastStore()
  const [activeTab, setActiveTab] = useState<'interactive' | 'pdf'>('interactive')

  // Prevent background scrolling when CV reader is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handlePrint = () => {
    if (activeTab === 'pdf') {
      addToast(
        lang === 'id' 
          ? 'Gunakan tombol cetak bawaan pada penampil PDF atau unduh file untuk mencetaknya.' 
          : 'Use the built-in print button in the PDF viewer or download the file to print it.',
        'info'
      )
      return
    }
    window.print()
  }

  // File Paths based on language
  const pdfPath = lang === 'en' ? '/CV_ZAYIDAN_MUTTAQIN_EN.pdf' : '/CV_ZAYIDAN_MUTTAQIN.pdf'
  const pdfName = lang === 'en' ? 'CV_ZAYIDAN_MUTTAQIN_EN.pdf' : 'CV_ZAYIDAN_MUTTAQIN.pdf'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-4 md:inset-10 z-50 flex flex-col rounded-2xl bg-zinc-900 border border-[var(--glass-border)] shadow-2xl overflow-hidden glass-strong max-w-5xl mx-auto w-full"
          >
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 md:p-6 border-b border-[var(--glass-border)] bg-zinc-950/50 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--neon-purple)]/10 border border-[var(--neon-purple)]/20 text-[var(--neon-purple)]">
                  <FileText className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display text-lg md:text-xl font-bold text-[var(--text-primary)]">
                    {lang === 'id' ? 'Curriculum Vitae' : 'Curriculum Vitae'}
                  </h3>
                  <p className="text-xs font-mono-custom text-[var(--text-secondary)]">
                    Zayidan Muttaqin &middot; {lang === 'id' ? 'Penjualan, Kepemimpinan, Komunikasi' : 'Sales, Leadership, Communication'}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Segmented Tab */}
                <div className="flex p-0.5 rounded-lg bg-zinc-900/80 border border-[var(--glass-border)] text-xs font-mono-custom">
                  <button
                    onClick={() => setActiveTab('interactive')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                      activeTab === 'interactive'
                        ? 'bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] font-semibold border border-[var(--neon-cyan)]/20'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span className="hidden xs:inline">{lang === 'id' ? 'Interaktif' : 'Interactive'}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('pdf')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                      activeTab === 'pdf'
                        ? 'bg-[var(--neon-magenta)]/10 text-[var(--neon-magenta)] font-semibold border border-[var(--neon-magenta)]/20'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span className="hidden xs:inline">PDF</span>
                  </button>
                </div>

                {/* Print button (interactive view only) */}
                <button
                  onClick={handlePrint}
                  title={lang === 'id' ? 'Cetak CV' : 'Print CV'}
                  className="p-2.5 rounded-lg bg-zinc-900 border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-zinc-700 transition-all"
                >
                  <Printer className="h-4 w-4" />
                </button>

                {/* Language Switcher */}
                <button
                  onClick={() => {
                    toggleLang()
                    addToast(lang === 'id' ? 'Switched to English' : 'Beralih ke Bahasa Indonesia', 'info')
                  }}
                  title={lang === 'id' ? 'Ganti Bahasa' : 'Switch Language'}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 border border-[var(--glass-border)] text-xs font-mono-custom text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
                >
                  <Globe className="h-3.5 w-3.5 text-[var(--neon-cyan)]" />
                  <span className="uppercase font-semibold">{lang}</span>
                </button>

                {/* Download Button */}
                <a
                  href={pdfPath}
                  download={pdfName}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--neon-purple)] text-white text-xs font-mono-custom font-semibold shadow-lg shadow-[var(--neon-purple)]/20 hover:shadow-[var(--neon-purple)]/40 hover:brightness-110 transition-all"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{lang === 'id' ? 'Unduh' : 'Download'}</span>
                </a>

                {/* Close Button */}
                <button
                  onClick={() => setOpen(false)}
                  className="p-2.5 rounded-lg bg-zinc-900 border border-[var(--glass-border)] text-zinc-400 hover:text-white transition-all ml-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto bg-zinc-950/20 print:bg-white custom-scrollbar relative p-4 md:p-8">
              {activeTab === 'interactive' ? (
                /* INTERACTIVE HTML RESUME */
                <div className="max-w-3xl mx-auto bg-zinc-900/40 p-6 md:p-10 rounded-2xl border border-[var(--glass-border)] shadow-xl relative overflow-hidden backdrop-blur-sm print:shadow-none print:border-none print:p-0 print:bg-transparent">
                  {/* Grid background effect */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none print:hidden" />
                  
                  {/* Resume Header */}
                  <div className="text-center md:text-left border-b border-[var(--glass-border)] pb-6 mb-6 print:border-zinc-200">
                    <h1 className="font-display text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tracking-wide mb-1 uppercase print:text-black">
                      Zayidan Muttaqin
                    </h1>
                    <p className="text-sm font-mono-custom text-[var(--neon-cyan)] font-semibold mb-4 print:text-zinc-700 uppercase tracking-widest">
                      {lang === 'id' ? 'Penjualan &bull; Kepemimpinan &bull; Komunikasi' : 'Sales &bull; Leadership &bull; Communication'}
                    </p>
                    
                    {/* Contact Details */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-4 text-xs font-mono-custom text-[var(--text-secondary)] print:text-zinc-600">
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3 text-[var(--neon-magenta)] print:hidden" />
                        <span>+62 812-5264-3578</span>
                      </span>
                      <span className="text-zinc-700 print:text-zinc-300">|</span>
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-3 w-3 text-[var(--neon-magenta)] print:hidden" />
                        <a href="mailto:zayidan34@gmail.com" className="hover:text-[var(--text-primary)] transition-all">zayidan34@gmail.com</a>
                      </span>
                      <span className="text-zinc-700 print:text-zinc-300">|</span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-[var(--neon-magenta)] print:hidden" />
                        <span>Banyuwangi, East Java, Indonesia</span>
                      </span>
                      <span className="text-zinc-700 print:text-zinc-300">|</span>
                      <span className="flex items-center gap-1.5">
                        <Linkedin className="h-3 w-3 text-[var(--neon-cyan)] print:hidden" />
                        <a href="https://linkedin.com/in/zayidan-muttaqin" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--text-primary)] transition-all">linkedin.com/in/zayidan-muttaqin</a>
                      </span>
                    </div>
                  </div>

                  {/* Section: Professional Profile */}
                  <div className="mb-8">
                    <h2 className="flex items-center gap-2 font-display text-sm uppercase tracking-wider font-bold text-[var(--text-primary)] mb-3 border-b border-zinc-800 pb-1.5 print:border-zinc-200 print:text-black">
                      <Award className="h-4 w-4 text-[var(--neon-cyan)] print:hidden" />
                      {lang === 'id' ? 'Profil Profesional' : 'Professional Profile'}
                    </h2>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed text-justify print:text-zinc-800">
                      {lang === 'id' 
                        ? 'Seorang profesional yang sangat disiplin, teliti, dan adaptif dengan fondasi kuat dalam operasional penjualan, kepemimpinan, dan hubungan pelanggan, dipadukan dengan bakat teknis yang terbukti dalam pengembangan perangkat lunak, dasar-dasar Python, dan sistem perdagangan kuantitatif mata uang kripto. Terbukti sukses dalam mengelola lingkungan toko ritel, mengoptimalkan penataan visual produk, dan mendorong tingkat konversi penjualan yang tinggi. Mahir dalam pemecahan masalah teknis secara mandiri maupun kepemimpinan tim kolaboratif, berkomitmen pada efisiensi operasional dan pertumbuhan profesional yang berkelanjutan.'
                        : 'A highly disciplined, detail-oriented, and adaptive professional with a strong foundation in sales operations, leadership, and customer relations, combined with a proven technical aptitude for software development, Python fundamentals, and quantitative cryptocurrency trading systems. Demonstrated success in managing retail store environments, optimizing product visual merchandising, and driving high sales conversion rates. Adept at both independent technical problem-solving and collaborative team leadership, committed to operational efficiency and continuous professional growth.'}
                    </p>
                  </div>

                  {/* Section: Technical Projects */}
                  <div className="mb-8">
                    <h2 className="flex items-center gap-2 font-display text-sm uppercase tracking-wider font-bold text-[var(--text-primary)] mb-4 border-b border-zinc-800 pb-1.5 print:border-zinc-200 print:text-black">
                      <Briefcase className="h-4 w-4 text-[var(--neon-purple)] print:hidden" />
                      {lang === 'id' ? 'Proyek Teknis & Kripto' : 'Technical & Crypto Projects'}
                    </h2>
                    <div className="mb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <h3 className="font-semibold text-sm text-[var(--text-primary)] print:text-black">
                          Zaytrix Quantitative Trading System
                        </h3>
                        <span className="text-xs font-mono-custom text-[var(--neon-purple)] print:text-zinc-600">
                          {lang === 'id' ? 'Juli 2025 – Sekarang' : 'July 2025 – Present'}
                        </span>
                      </div>
                      <p className="text-xs font-mono-custom text-[var(--text-secondary)] mb-3 print:text-zinc-600 italic">
                        {lang === 'id' ? 'Pengembang & Analis Kuantitatif (Proyek Pribadi)' : 'Developer & Quantitative Analyst (Personal Project)'}
                      </p>
                      <ul className="list-disc list-outside pl-4 space-y-1.5 text-xs text-[var(--text-secondary)] print:text-zinc-800">
                        {lang === 'id' ? (
                          <>
                            <li>Merancang, membangun, dan mengoptimalkan sistem trading kuantitatif frekuensi menengah (&quot;Zaytrix&quot;) dengan fokus strategi otomatis pada aset kripto (seperti SUI, BNB) dan Emas (XAUUSD).</li>
                            <li>Mengembangkan skrip eksekusi algoritmik menggunakan Python dan Pine Script, mengintegrasikan sistem keluar hibrida dengan Take Profit (TP) tetap, trailing stop, dan logika breakeven untuk meminimalkan risiko.</li>
                            <li>Melakukan pengujian historis (backtesting) mendalam dan analisis data pasar menggunakan kerangka kerja tingkat lanjut termasuk Smart Money Concepts (SMC) logic, struktur Dow Theory, dan entri area Fibonacci retracement (0.5 - 0.618).</li>
                            <li>Melakukan riset metrik on-chain, tokenomics, pola likuiditas, dan tren pasar di ekosistem keuangan terdesentralisasi (DeFi) dan koin meme untuk memanfaatkan inefisiensi pasar.</li>
                            <li>Memanfaatkan model AI open-source lokal (arsitektur Ollama, LiteLLM, Qwen) untuk mempercepat pengembangan basis kode dan analisis sentimen pasar dasar.</li>
                          </>
                        ) : (
                          <>
                            <li>Designed, built, and optimized a custom mid-frequency quantitative trading system (&quot;Zaytrix&quot;) focusing automated strategies on cryptocurrency assets (such as SUI, BNB) and Gold (XAUUSD).</li>
                            <li>Developed robust algorithmic execution scripts using Python and Pine Script, integrating a hybrid exit engine featuring fixed Take Profit (TP), trailing stops, and breakeven logic to maximize risk mitigation.</li>
                            <li>Conducted thorough backtesting and historical data analysis using advanced market frameworks including Smart Money Concepts (SMC) logic, Dow Theory structural levels, and Fibonacci retracement area entries (0.5 - 0.618).</li>
                            <li>Researched on-chain metrics, tokenomics, liquidity patterns, and market trends within the decentralized finance (DeFi) and memecoin ecosystems to capture market inefficiencies.</li>
                            <li>Leveraged local open-source AI models and tools (Ollama, LiteLLM, Qwen architectures) to accelerate codebase development and perform fundamental sentiment analysis.</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Section: Work Experience */}
                  <div className="mb-8">
                    <h2 className="flex items-center gap-2 font-display text-sm uppercase tracking-wider font-bold text-[var(--text-primary)] mb-4 border-b border-zinc-800 pb-1.5 print:border-zinc-200 print:text-black">
                      <Briefcase className="h-4 w-4 text-[var(--neon-magenta)] print:hidden" />
                      {lang === 'id' ? 'Pengalaman Kerja' : 'Work Experience'}
                    </h2>
                    
                    <div className="space-y-6">
                      {/* Job 1 */}
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <h3 className="font-semibold text-sm text-[var(--text-primary)] print:text-black">
                            Store Associate / Sales Clerk
                          </h3>
                          <span className="text-xs font-mono-custom text-[var(--neon-magenta)] print:text-zinc-600">
                            {lang === 'id' ? 'April 2026 – Sekarang' : 'April 2026 – Present'}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mb-3 print:text-zinc-600 italic">
                          Toko Sinta (SH GROSIR)
                        </p>
                        <ul className="list-disc list-outside pl-4 space-y-1.5 text-xs text-[var(--text-secondary)] print:text-zinc-800">
                          {lang === 'id' ? (
                            <>
                              <li>Melayani pelanggan dengan ramah dan membantu pemilihan ukuran, mengambil stok barang dari gudang dengan cepat, serta memberikan rekomendasi produk alternatif saat kehabisan stok.</li>
                              <li>Melakukan Penataan Visual (Visual Merchandising) profesional dengan merapikan sepatu, sandal, dan tas sesuai ukuran, warna, dan merek.</li>
                              <li>Menjaga kebersihan dan kerapian area display serta ruang pas agar selalu memenuhi standar premium.</li>
                              <li>Menjaga kualitas barang pajangan agar tetap bersih tanpa noda/cacat guna menghindari penurunan nilai jual.</li>
                              <li>Mencapai efisiensi waktu logistik barang dari gudang ke area pajangan secara optimal.</li>
                            </>
                          ) : (
                            <>
                              <li>Delivered high-quality customer service by assisting patrons with sizing, retrieving inventory efficiently from the warehouse, and recommending alternative product options during stock outages.</li>
                              <li>Executed professional Visual Merchandising by organizing shoes, sandals, and bags neatly based on size, color matrices, and brands.</li>
                              <li>Maintained display floors and fitting room areas to premium cleanliness and appearance standards.</li>
                              <li>Maintained display stock quality at a pristine level with zero stains/defects, successfully avoiding product markdowns.</li>
                              <li>Achieved optimal turnaround times and high efficiency in stock logistics from the warehouse to the sales floor.</li>
                            </>
                          )}
                        </ul>
                      </div>

                      {/* Job 2 */}
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <h3 className="font-semibold text-sm text-[var(--text-primary)] print:text-black">
                            {lang === 'id' ? 'Store Manager (Kepala Toko)' : 'Store Manager (Kepala Toko)'}
                          </h3>
                          <span className="text-xs font-mono-custom text-[var(--neon-magenta)] print:text-zinc-600">
                            {lang === 'id' ? 'Januari 2025 – Maret 2026' : 'January 2025 – March 2026'}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mb-3 print:text-zinc-600 italic">
                          Toko Sinta (SH GROSIR)
                        </p>
                        <ul className="list-disc list-outside pl-4 space-y-1.5 text-xs text-[var(--text-secondary)] print:text-zinc-800">
                          {lang === 'id' ? (
                            <>
                              <li>Mengelola operasional toko ritel harian secara penuh, memastikan waktu buka dan tutup toko yang tepat waktu sesuai SOP perusahaan.</li>
                              <li>Mengawasi penataan produk visual, kebersihan area penjualan, serta fasilitas pelayanan pelanggan yang optimal.</li>
                              <li>Memantau perputaran inventaris, mengarahkan siklus pemesanan otomatis, dan memimpin stock opname fisik berkala.</li>
                              <li>Mengendalikan risiko penyusutan barang dan mengaudit kelayakan fungsi seluruh peralatan operasional.</li>
                              <li>Mengadakan modul pelatihan pelayanan dan pengetahuan produk bagi staf toko, kasir, dan pramuniaga.</li>
                              <li>Mengevaluasi kinerja staf secara berkala, menjaga motivasi tim, dan menyelesaikan masalah kedisiplinan operasional.</li>
                              <li>Menangani pertanyaan dan keluhan pelanggan tingkat lanjut secara profesional untuk mempertahankan loyalitas jangka panjang.</li>
                            </>
                          ) : (
                            <>
                              <li>Managed daily retail store operations completely, guaranteeing punctual opening and closing times strictly adhering to company SOPs.</li>
                              <li>Supervised visual product placements, overall cleanliness of the sales floor, and optimal customer facilities.</li>
                              <li>Monitored inventory rotation, directed automated replenishment cycles, and led periodic physical stock counts (stock opname).</li>
                              <li>Controlled shrinkage risk exposures and audited all active operational equipment to ensure full functionality.</li>
                              <li>Conducted targeted product knowledge and service training modules for store personnel, cashiers, and sales clerks.</li>
                              <li>Evaluated staff performance scores regularly, maintaining team motivation and resolving operational discipline matters.</li>
                              <li>Handled advanced or escalated customer inquiries and grievances professionally to preserve long-term loyalty.</li>
                            </>
                          )}
                        </ul>
                      </div>

                      {/* Job 3 */}
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <h3 className="font-semibold text-sm text-[var(--text-primary)] print:text-black">
                            Jewelry Sales Associate
                          </h3>
                          <span className="text-xs font-mono-custom text-[var(--neon-magenta)] print:text-zinc-600">
                            {lang === 'id' ? 'Januari 2024 – Desember 2024' : 'January 2024 – December 2024'}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mb-3 print:text-zinc-600 italic">
                          PT. Hantar Prada Harmoni
                        </p>
                        <ul className="list-disc list-outside pl-4 space-y-1.5 text-xs text-[var(--text-secondary)] print:text-zinc-800">
                          {lang === 'id' ? (
                            <>
                              <li>Menyambut dan melayani klien kelas atas, menawarkan konsultasi berstandar tinggi untuk perhiasan emas dan berlian premium.</li>
                              <li>Memberikan edukasi transparan kepada konsumen terkait kadar emas, perhitungan berat gram, dan spesifikasi barang untuk membangun kepercayaan merek.</li>
                              <li>Menjaga prosedur keamanan ketat dan protokol penanganan persediaan barang bernilai tinggi secara aman.</li>
                              <li>Konsisten melampaui target penjualan bulanan individu dan tim melalui manajemen hubungan berbasis pelanggan.</li>
                            </>
                          ) : (
                            <>
                              <li>Welcomed and engaged high-end clients, offering standard-setting consultation for premium gold and diamond jewelry items.</li>
                              <li>Educated consumers transparently regarding gold carats, grammage calculations, and item specifications to build brand trust.</li>
                              <li>Maintained ironclad security workflows and strict handling protocols for high-value store inventory.</li>
                              <li>Consistently exceeded monthly individual and team sales milestones through client-centric relationship management.</li>
                            </>
                          )}
                        </ul>
                      </div>

                      {/* Job 4 */}
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <h3 className="font-semibold text-sm text-[var(--text-primary)] print:text-black">
                            Sales Promotion Boy (Ramadan Event)
                          </h3>
                          <span className="text-xs font-mono-custom text-[var(--neon-magenta)] print:text-zinc-600">
                            {lang === 'id' ? 'Maret 2023 – April 2023' : 'March 2023 – April 2023'}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mb-3 print:text-zinc-600 italic">
                          CV Maxindo
                        </p>
                        <ul className="list-disc list-outside pl-4 space-y-1.5 text-xs text-[var(--text-secondary)] print:text-zinc-800">
                          {lang === 'id' ? (
                            <>
                              <li>Berinteraksi aktif dengan pengunjung acara dan memberikan edukasi produk strategis untuk mempercepat adopsi konsumen.</li>
                              <li>Memantau aktivitas kompetitor lokal serta tren pembelian waktu nyata untuk menyesuaikan skrip penjualan secara dinamis.</li>
                              <li>Berhasil mencapai dan melampaui target penjualan serta tingkat konversi yang ditetapkan oleh pimpinan perusahaan.</li>
                              <li>Menjaga pembukuan stok 100% akurat, mencapai nol selisih stok selama periode acara berlangsung.</li>
                            </>
                          ) : (
                            <>
                              <li>Engaged event visitors proactively and delivered strategic product education to accelerate consumer adoption.</li>
                              <li>Monitored regional competitor actions and real-time buying trends to adjust conversational sales scripts dynamically.</li>
                              <li>Successfully met and surpassed all designated Sales Targets and Conversion Rates set by corporate leads.</li>
                              <li>Maintain 100% accurate stock bookkeeping, achieving zero stock variance across the entire event lifespan.</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Section: Education */}
                  <div className="mb-8">
                    <h2 className="flex items-center gap-2 font-display text-sm uppercase tracking-wider font-bold text-[var(--text-primary)] mb-4 border-b border-zinc-800 pb-1.5 print:border-zinc-200 print:text-black">
                      <GraduationCap className="h-4 w-4 text-[var(--neon-cyan)] print:hidden" />
                      {lang === 'id' ? 'Pendidikan' : 'Education'}
                    </h2>
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <h3 className="font-semibold text-sm text-[var(--text-primary)] print:text-black">
                          MANBAUL ULUM Vocational High School (SMK Manbaul Ulum Muncar)
                        </h3>
                        <span className="text-xs font-mono-custom text-[var(--neon-cyan)] print:text-zinc-600">
                          2017 – 2020
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] print:text-zinc-700">
                        {lang === 'id' 
                          ? 'Diploma Kejuruan dalam Teknik Kendaraan Ringan (Otomotif)' 
                          : 'Vocational Diploma in Light Vehicle Engineering (Automotive)'}
                      </p>
                      <p className="text-xs font-mono-custom text-[var(--neon-cyan)] mt-1.5 print:text-zinc-600">
                        {lang === 'id' ? 'Nilai Kelulusan Akhir: 82.21 / 100.00' : 'Final Graduation Grade: 82.21 / 100.00'}
                      </p>
                    </div>
                  </div>

                  {/* Section: Skills & Languages */}
                  <div>
                    <h2 className="flex items-center gap-2 font-display text-sm uppercase tracking-wider font-bold text-[var(--text-primary)] mb-4 border-b border-zinc-800 pb-1.5 print:border-zinc-200 print:text-black">
                      <Award className="h-4 w-4 text-[var(--neon-purple)] print:hidden" />
                      {lang === 'id' ? 'Keahlian & Bahasa' : 'Skills & Languages'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[var(--text-secondary)] print:text-zinc-800">
                      <div>
                        <p className="font-bold text-[var(--text-primary)] mb-1 print:text-black uppercase">
                          {lang === 'id' ? 'Teknis & Perangkat Lunak' : 'Technical & Software'}
                        </p>
                        <p className="mb-4 leading-relaxed">
                          Python Programming Fundamentals, Basic Software Development, Algorithmic Trading Systems, Quantitative Data Analysis, AI Prompt Engineering, Device & Laptop Operations.
                        </p>
                        
                        <p className="font-bold text-[var(--text-primary)] mb-1 print:text-black uppercase">
                          {lang === 'id' ? 'Desain & Multimedia' : 'Design & Multimedia'}
                        </p>
                        <p className="leading-relaxed">
                          Visual Merchandising, Video Editing (CapCut), Graphic Design (Canva).
                        </p>
                      </div>

                      <div>
                        <p className="font-bold text-[var(--text-primary)] mb-1 print:text-black uppercase">
                          {lang === 'id' ? 'Profesional & Soft Skills' : 'Professional & Soft Skills'}
                        </p>
                        <p className="mb-4 leading-relaxed">
                          Retail Operations Management, Team Leadership & Motivation, Effective Communication, Negotiation, Complex Problem Solving, Time Management & Efficiency, Customer Relationship Management (CRM).
                        </p>

                        <p className="font-bold text-[var(--text-primary)] mb-1 print:text-black uppercase">
                          {lang === 'id' ? 'Bahasa' : 'Languages'}
                        </p>
                        <p className="leading-relaxed">
                          {lang === 'id' 
                            ? 'Indonesian (Native/Fluent), English (Working Knowledge / Conversational)' 
                            : 'Indonesian (Native/Fluent), English (Working Knowledge / Conversational)'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* EMBEDDED PDF IFRAME */
                <div className="w-full h-full min-h-[500px] md:min-h-[600px] rounded-xl overflow-hidden border border-[var(--glass-border)] bg-zinc-950">
                  <iframe
                    src={`${pdfPath}#toolbar=1&navpanes=0&scrollbar=1`}
                    title="Zayidan Muttaqin CV PDF"
                    className="w-full h-full min-h-[500px] md:min-h-[600px] border-none"
                  />
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
