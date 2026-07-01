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
    id: 1,
    period: { start: "2025-01", end: null },
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
    id: 2,
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
    id: 3,
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