type LocalizedText = { id: string; en: string }

interface ExperienceEntry {
  id: number
  period: { start: string; end: string | null }
  role: LocalizedText
  company: LocalizedText
  description: { id: string[]; en: string[] }
  tags: { id: string[]; en: string[] }
}

export const experiences: ExperienceEntry[] = [
  {
    id: 5,
    period: { start: "2026-08", end: null },
    role: { id: "Staf Sales Promotion Boy", en: "Sales Promotion Boy Staff" },
    company: { id: "Lapangan / Outdoor", en: "Field / Outdoor" },
    description: {
      id: [
        "Menyapa pengunjung dengan ramah dan menawarkan produk snack yang dijual.",
        "Memberikan penjelasan terkait varian rasa, keunggulan, komposisi, atau promo harga spesial dari snack tersebut.",
        "Membujuk dan meyakinkan pelanggan untuk membeli produk dalam jumlah lebih banyak atau mencoba varian rasa baru.",
        "Menjawab rasa penasaran konsumen seputar produk dengan ramah dan solutif.",
        "Mendengarkan tanggapan, kritik, atau saran dari konsumen mengenai rasa atau kemasan snack.",
        "Mencatat jumlah penjualan harian, sisa stok, serta respons pasar untuk diserahkan kepada supervisor atau tim.",
      ],
      en: [
        "Greeted visitors warmly and offered the snack products for sale.",
        "Explained flavor variants, product advantages, ingredients, and special price promotions to customers.",
        "Persuaded and convinced customers to purchase products in larger quantities or try new flavor variants.",
        "Addressed customer curiosity about products in a friendly and solution-oriented manner.",
        "Listened to feedback, criticism, and suggestions from consumers regarding flavor or packaging.",
        "Recorded daily sales amounts, remaining stock, and market responses to be submitted to the supervisor or team.",
      ],
    },
    tags: { id: ["Sales Promotion", "Layanan Pelanggan", "Pengetahuan Produk", "Laporan Penjualan"], en: ["Sales Promotion", "Customer Service", "Product Knowledge", "Sales Reporting"] },
  },
  {
    id: 1,
    period: { start: "2026-04", end: "2026-07" },
    role: { id: "Store Associate / Sales Clerk", en: "Store Associate / Sales Clerk" },
    company: { id: "Toko Sinta (SH GROSIR)", en: "Toko Sinta (SH GROSIR)" },
    description: {
      id: [
        "Melayani pelanggan dengan ramah dan membantu pemilihan ukuran, mengambil stok barang dari gudang dengan cepat, serta memberikan rekomendasi produk alternatif saat kehabisan stok.",
        "Melakukan Penataan Visual (Visual Merchandising) profesional dengan merapikan sepatu, sandal, dan tas sesuai ukuran, warna, dan merek.",
        "Menjaga kebersihan dan kerapian area display serta ruang pas agar selalu memenuhi standar premium.",
        "Menjaga kualitas barang pajangan agar tetap bersih tanpa noda/cacat guna menghindari penurunan nilai jual.",
        "Mencapai efisiensi waktu logistik barang dari gudang ke area pajangan secara optimal.",
      ],
      en: [
        "Delivered high-quality customer service by assisting patrons with sizing, retrieving inventory efficiently from the warehouse, and recommending alternative product options during stock outages.",
        "Executed professional Visual Merchandising by organizing shoes, sandals, and bags neatly based on size, color matrices, and brands.",
        "Maintained display floors and fitting room areas to premium cleanliness and appearance standards.",
        "Maintained display stock quality at a pristine level with zero stains/defects, successfully avoiding product markdowns.",
        "Achieved optimal turnaround times and high efficiency in stock logistics from the warehouse to the sales floor.",
      ],
    },
    tags: { id: ["Layanan Pelanggan", "Visual Merchandising", "Logistik Stok", "Retail"], en: ["Customer Service", "Visual Merchandising", "Stock Logistics", "Retail"] },
  },
  {
    id: 2,
    period: { start: "2025-01", end: "2026-03" },
    role: { id: "Kepala Toko", en: "Store Manager" },
    company: { id: "Toko Sinta (SH GROSIR)", en: "Toko Sinta (SH GROSIR)" },
    description: {
      id: [
        "Mengelola operasional harian toko retail dengan fokus pada efisiensi dan kualitas pelayanan",
        "Menangani keluhan pelanggan serta memastikan kepuasan dan loyalitas pelanggan terjaga",
        "Menerapkan disiplin kerja dan memastikan seluruh karyawan mematuhi SOP perusahaan",
        "Memimpin, memotivasi, dan mengevaluasi kinerja staf toko (kasir, pramuniaga)",
      ],
      en: [
        "Managed daily retail store operations with focus on efficiency and service quality",
        "Handled customer complaints and ensured customer satisfaction and loyalty",
        "Enforced work discipline and ensured all employees complied with company SOPs",
        "Led, motivated, and evaluated store staff performance (cashiers, sales associates)",
      ],
    },
    tags: { id: ["Manajemen Retail", "Kepemimpinan", "Layanan Pelanggan", "SOP"], en: ["Retail Management", "Leadership", "Customer Service", "SOP"] },
  },
  {
    id: 3,
    period: { start: "2024-01", end: "2024-12" },
    role: { id: "Pramuniaga", en: "Sales Associate" },
    company: { id: "PT. Hantar Prada Harmoni", en: "PT. Hantar Prada Harmoni" },
    description: {
      id: [
        "Menyambut pelanggan dengan sopan dan memberikan pelayanan terbaik",
        "Memberikan informasi produk yang akurat dan membantu pemilihan produk sesuai kebutuhan",
        "Menangani keluhan pelanggan dengan cepat dan profesional",
      ],
      en: [
        "Greeted customers politely and provided excellent service",
        "Provided accurate product information and assisted with product selection based on customer needs",
        "Handled customer complaints quickly and professionally",
      ],
    },
    tags: { id: ["Layanan Pelanggan", "Pengetahuan Produk", "Komunikasi", "Retail"], en: ["Customer Service", "Product Knowledge", "Communication", "Retail"] },
  },
  {
    id: 4,
    period: { start: "2023-03", end: "2023-04" },
    role: { id: "Sales Promotion Boy (Event Ramadan)", en: "Sales Promotion Boy (Ramadan Event)" },
    company: { id: "Mitra Swalayan Jajag", en: "Mitra Swalayan Jajag" },
    description: {
      id: [
        "Pelayanan dan konsultasi pelanggan secara langsung di area penjualan",
        "Operasional dan penjualan produk selama event Ramadan",
        "Penataan produk (Visual Merchandising) untuk meningkatkan daya tarik display",
        "Menguasai product knowledge secara mendalam untuk memberikan rekomendasi tepat",
        "Membuat laporan penjualan harian untuk monitoring pencapaian target",
      ],
      en: [
        "Provided direct customer service and consultation in the sales area",
        "Managed product operations and sales during the Ramadan event",
        "Arranged product displays (Visual Merchandising) to increase visual appeal",
        "Mastered in-depth product knowledge to provide accurate recommendations",
        "Created daily sales reports for monitoring target achievement",
      ],
    },
    tags: { id: ["Sales Promotion", "Visual Merchandising", "Pengetahuan Produk", "Laporan Penjualan"], en: ["Sales Promotion", "Visual Merchandising", "Product Knowledge", "Reporting"] },
  },
]

export function formatDate(dateStr: string | null, tPresent: string, locale: string = 'en-US'): string {
  if (!dateStr) return tPresent
  const date = new Date(dateStr)
  return date.toLocaleDateString(locale, { month: 'short', year: 'numeric' })
}