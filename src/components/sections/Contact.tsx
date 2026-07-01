'use client'

import { useState, useEffect, useRef, useCallback, type FormEvent } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useLanguageStore } from '@/store/language-store'
import { useToastStore } from '@/store/toast-store'
import { useCvStore } from '@/store/cv-store'
import { Mail, Phone, Linkedin, Github, Send, CheckCircle, AlertCircle, Loader2, MapPin, FileDown, Check, Copy, Share2, ExternalLink, X, MessageCircle, Instagram, Gamepad2, QrCode } from 'lucide-react'
import { TiltCard } from '@/components/ui/TiltCard'
import { ScrambleText } from '@/components/ui/ScrambleText'
import QRCode from 'qrcode'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

function buildShareOptions(shareUrl: string, copyLinkLabel: string, shareText: string) {
  return [
    { key: 'telegram', icon: '💬', label: 'Telegram', url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}` },
    { key: 'whatsapp', icon: '📱', label: 'WhatsApp', url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}` },
    { key: 'twitter', icon: '𝕏', label: 'Twitter / X', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}` },
    { key: 'copyLink', icon: null as string | null, label: copyLinkLabel, url: '' },
  ] as const
}

const VCARD_TEXT = `BEGIN:VCARD
VERSION:3.0
FN:Zayidan Muttaqin
TEL:+6281252643578
EMAIL:zayidan34@gmail.com
URL:https://github.com/Zayidan123
ADR:;;Banyuwangi;;;Indonesia
END:VCARD`

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
const hasValidKey = Boolean(MAPS_API_KEY) && MAPS_API_KEY !== 'YOUR_API_KEY' && MAPS_API_KEY.trim() !== '';

export function Contact() {
  const { t, lang } = useLanguageStore()
  const { addToast } = useToastStore()
  const { setOpen: setCvOpen } = useCvStore()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [formStatus, setFormStatus] = useState<FormStatus>('idle')
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [shareOpen, setShareOpen] = useState(false)
  const shareDropdownRef = useRef<HTMLDivElement>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [showMapModal, setShowMapModal] = useState(false)

  // Generate QR code for vCard
  useEffect(() => {
    QRCode.toDataURL(VCARD_TEXT, {
      width: 120,
      margin: 1,
      color: { dark: '#00F5FF', light: '#05051000' },
    }).then((url: string) => {
      setQrDataUrl(url)
    }).catch(() => {
      // fallback: generate with default colors
      QRCode.toDataURL(VCARD_TEXT, { width: 120, margin: 1 }).then((url: string) => {
        setQrDataUrl(url)
      }).catch(() => { /* ignore */ })
    })
  }, [])

  const getShareUrl = () => { if (typeof window !== 'undefined') return window.location.href; return '' }
  const getShareOptions = useCallback(() => buildShareOptions(getShareUrl(), t('contact.copyLink'), t('contact.shareText')), [t])

  const handleCopy = (value: string, field: string) => {
    try { if (navigator.clipboard?.writeText) navigator.clipboard.writeText(value); else document.execCommand('copy') } catch { /* */ }
    setCopiedField(field); addToast(t('contact.copied'), 'success'); setTimeout(() => setCopiedField(null), 1500)
  }

  const handleShare = async () => {
    if (navigator.share) { try { await navigator.share({ title: 'Zayidan Muttaqin', text: t('contact.shareText'), url: getShareUrl() }); return } catch { } }
    setShareOpen(prev => !prev)
  }

  const handleShareOption = async (option: ReturnType<typeof buildShareOptions>[number]) => {
    if (option.key === 'copyLink') {
      try { await navigator.clipboard.writeText(getShareUrl()); addToast(t('contact.copied'), 'success') } catch { }
    } else { window.open(option.url, '_blank', 'noopener,noreferrer') }
    setShareOpen(false)
  }

  useEffect(() => {
    if (!shareOpen) return
    const handler = (e: MouseEvent) => { if (shareDropdownRef.current && !shareDropdownRef.current.contains(e.target as Node) && !(e.target as HTMLElement).closest('.share-profile-btn')) setShareOpen(false) }
    document.addEventListener('mousedown', handler); return () => document.removeEventListener('mousedown', handler)
  }, [shareOpen])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setFormStatus('loading')
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (r.ok) {
        setFormStatus('success'); setFormData({ name: '', email: '', subject: '', message: '' }); addToast(t('contact.success'), 'success')
      } else if (r.status === 429) {
        setFormStatus('error'); addToast(t('contact.rateLimitError'), 'error')
      } else {
        const err = await r.json().catch(() => ({}))
        setFormStatus('error'); addToast(err.error || t('contact.error'), 'error')
      }
    } catch {
      setFormStatus('error'); addToast(t('contact.error'), 'error')
    }
  }

  const contactInfo = [
    { key: 'email', icon: Mail, label: t('contact.emailLabel'), value: 'zayidan34@gmail.com', href: 'mailto:zayidan34@gmail.com', color: 'var(--neon-cyan)', copyable: true, copyValue: 'zayidan34@gmail.com' },
    { key: 'phone', icon: Phone, label: t('contact.phoneLabel'), value: '+62 812-5264-3578', href: 'tel:+6281252643578', color: 'var(--neon-magenta)', copyable: true, copyValue: '+62 812-5264-3578' },
    { key: 'location', icon: MapPin, label: t('contact.locationLabel'), value: t('hero.location'), href: '#', color: 'var(--neon-purple)', copyable: false },
    { key: 'linkedin', icon: Linkedin, label: t('contact.linkedin'), value: 'linkedin.com/in/zayidan-muttaqin', href: 'https://www.linkedin.com/in/zayidan-muttaqin/', color: 'var(--neon-cyan)', copyable: false },
    { key: 'github', icon: Github, label: t('contact.github'), value: 'github.com/Zayidan123', href: 'https://github.com/Zayidan123', color: 'var(--neon-cyan)', copyable: false },
    { key: 'telegram', icon: MessageCircle, label: t('contact.telegram'), value: 't.me/ZayM1122', href: 'https://t.me/ZayM1122', color: 'var(--neon-cyan)', copyable: false },
    { key: 'instagram', icon: Instagram, label: t('contact.instagram'), value: 'instagram.com/zayidan1122', href: 'https://www.instagram.com/zayidan1122?igsh=NW43eHZ0bXFtMzhz', color: 'var(--neon-magenta)', copyable: false },
    { key: 'discord', icon: Gamepad2, label: t('contact.discord'), value: t('contact.discordServer'), href: 'https://discord.gg/4hv4vKAccC', color: 'var(--neon-purple)', copyable: false },
    { key: 'share', icon: Share2, label: t('contact.share'), value: '', href: '#', color: 'var(--neon-cyan)', copyable: false, isShare: true },
    { key: 'cv', icon: FileDown, label: t('contact.cvLabel'), value: lang === 'en' ? 'CV_ZAYIDAN_MUTTAQIN_EN.pdf' : 'CV_ZAYIDAN_MUTTAQIN.pdf', href: lang === 'en' ? '/CV_ZAYIDAN_MUTTAQIN_EN.pdf' : '/CV_ZAYIDAN_MUTTAQIN.pdf', color: 'var(--neon-purple)', copyable: false, download: true },
  ] as const

  return (
    <section id="contact" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-12 sm:mb-16">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2"><ScrambleText text={t('contact.title')} /></h2>
          <div className="section-title-line" />
          <p className="mt-4 text-sm sm:text-base text-[var(--text-secondary)] max-w-xl">{t('contact.subtitle')}</p>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-2 space-y-4 relative">
            {contactInfo.map((item) => {
              const Icon = item.key === 'email' && copiedField === 'email' ? Check : item.key === 'phone' && copiedField === 'phone' ? Check : item.icon
              return (
                <a key={item.key} href={item.isShare || item.key === 'cv' ? undefined : item.href} download={item.key === 'cv' ? undefined : ('download' in item && item.download ? true : undefined)} target={item.href?.startsWith('http') ? '_blank' : undefined} rel={item.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  onClick={(e) => { if (item.copyable) { e.preventDefault(); handleCopy(item.copyValue!, item.key) } else if (item.isShare) { e.preventDefault(); handleShare() } else if (item.key === 'cv') { e.preventDefault(); setCvOpen(true) } }}
                  className={`flex items-start gap-4 p-4 rounded-xl glass border border-[var(--glass-border)] glass-card-advanced transition-all duration-300 group${item.isShare ? ' share-profile-btn cursor-pointer' : ''}`}
                  style={{ '--hover-glow': item.color } as React.CSSProperties}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${item.color}33` }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border" style={{ color: item.color, borderColor: `${item.color}33`, backgroundColor: `${item.color}0D` }}><Icon className="h-5 w-5" /></div>
                  <div><p className="text-xs text-[var(--text-secondary)] mb-0.5">{item.label}</p><p className="text-sm font-mono-custom font-medium" style={{ color: item.color }}>{item.value || t('contact.share')}</p></div>
                  {item.isShare && <ExternalLink className="h-4 w-4 text-[var(--text-secondary)]/40 ml-auto mt-1 shrink-0" />}
                  {item.copyable && copiedField !== item.key && <Copy className="h-4 w-4 text-[var(--text-secondary)]/40 ml-auto mt-1 shrink-0" />}
                </a>
              )
            })}

            {/* QR Code Card */}
            {qrDataUrl && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="flex items-center gap-4 p-4 rounded-xl glass border border-[var(--glass-border)] glass-card-advanced transition-all duration-300 group"
                style={{ '--hover-glow': 'var(--neon-cyan)' } as React.CSSProperties}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px var(--neon-cyan)33' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border" style={{ color: 'var(--neon-cyan)', borderColor: 'rgba(0,245,255,0.2)', backgroundColor: 'rgba(0,245,255,0.05)' }}>
                  <QrCode className="h-5 w-5" />
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <Image
                    src={qrDataUrl}
                    alt="vCard QR Code"
                    width={120}
                    height={120}
                    unoptimized
                    className="rounded-lg mb-2"
                  />
                  <p className="text-[10px] font-mono-custom text-[var(--text-secondary)] tracking-wider">{t('contact.scanToSave')}</p>
                </div>
              </motion.div>
            )}

            {shareOpen && (
              <div ref={shareDropdownRef} className="relative z-50">
                <motion.div initial={{ opacity: 0, scale: 0.95, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 8 }} transition={{ duration: 0.2 }} className="p-2 rounded-xl glass border border-[var(--glass-border)] bg-[var(--dark-base)]/95 backdrop-blur-xl shadow-[0_0_30px_rgba(0,240,255,0.1)] min-w-[200px]">
                  <div className="flex items-center justify-between px-2 py-1.5 mb-1"><span className="text-[10px] font-mono-custom text-[var(--text-secondary)] tracking-wider uppercase">{t('contact.shareTo')}</span><button onClick={() => setShareOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"><X className="h-3 w-3" /></button></div>
                  {getShareOptions().map((opt) => (
                    <button key={opt.key} onClick={() => handleShareOption(opt)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)] transition-all group/opt">
                      <span className="text-base shrink-0 w-6 text-center">{opt.icon || '🔗'}</span><span className="text-xs font-mono-custom">{opt.label}</span>
                      {opt.key !== 'copyLink' ? <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover/opt:opacity-100 text-[var(--text-secondary)]/50" /> : <Copy className="h-3 w-3 ml-auto opacity-0 group-hover/opt:opacity-100 text-[var(--text-secondary)]/50" />}
                    </button>
                  ))}
                </motion.div>
              </div>
            )}
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} className="lg:col-span-3 space-y-6">
            <TiltCard maxTilt={4}><div className="relative p-6 sm:p-8 rounded-xl glass border border-[var(--glass-border)] glass-noise">
              <div className="absolute -top-px -left-px w-5 h-5 border-t-2 border-l-2 border-[var(--neon-cyan)]" /><div className="absolute -top-px -right-px w-5 h-5 border-t-2 border-r-2 border-[var(--neon-magenta)]" /><div className="absolute -bottom-px -left-px w-5 h-5 border-b-2 border-l-2 border-[var(--neon-magenta)]" /><div className="absolute -bottom-px -right-px w-5 h-5 border-b-2 border-r-2 border-[var(--neon-cyan)]" />
              {formStatus === 'success' ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-500/10 border border-green-500/30 shadow-[0_0_20px_rgba(0,255,136,0.2)]"><CheckCircle className="h-8 w-8 text-green-400" /></div>
                  <p className="text-sm text-green-400 text-center font-medium">{t('contact.success')}</p>
                  <button onClick={() => setFormStatus('idle')} className="text-xs text-[var(--neon-cyan)] hover:underline">{t('contact.sendAnother')}</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div><label className="block text-xs font-mono-custom text-[var(--text-secondary)] mb-1.5 tracking-wider uppercase">{t('contact.name')}</label><input type="text" required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg bg-transparent border border-[var(--glass-border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/40 transition-all focus:outline-none focus:border-[var(--neon-cyan)] focus:shadow-[var(--glow-cyan)]" placeholder={t('contact.namePlaceholder')} /></div>
                    <div><label className="block text-xs font-mono-custom text-[var(--text-secondary)] mb-1.5 tracking-wider uppercase">{t('contact.email')}</label><input type="email" required value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg bg-transparent border border-[var(--glass-border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/40 transition-all focus:outline-none focus:border-[var(--neon-cyan)] focus:shadow-[var(--glow-cyan)]" placeholder={t('contact.emailPlaceholder')} /></div>
                  </div>
                  <div><label className="block text-xs font-mono-custom text-[var(--text-secondary)] mb-1.5 tracking-wider uppercase">{t('contact.subject')}</label><input type="text" required value={formData.subject} onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg bg-transparent border border-[var(--glass-border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/40 transition-all focus:outline-none focus:border-[var(--neon-cyan)] focus:shadow-[var(--glow-cyan)]" placeholder={t('contact.subjectPlaceholder')} /></div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5"><label className="block text-xs font-mono-custom text-[var(--text-secondary)] tracking-wider uppercase">{t('contact.message')}</label><span className={`text-[10px] font-mono-custom ${formData.message.length > 500 ? 'text-red-400' : formData.message.length > 300 ? 'text-yellow-400' : 'text-[var(--text-secondary)]/40'}`}>{formData.message.length}/500</span></div>
                    <textarea required rows={5} maxLength={500} value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg bg-transparent border border-[var(--glass-border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/40 transition-all focus:outline-none focus:border-[var(--neon-cyan)] focus:shadow-[var(--glow-cyan)] resize-none" placeholder={t('contact.messagePlaceholder')} />
                  </div>
                  {formStatus === 'error' && <div className="flex items-center gap-2 text-xs text-red-400"><AlertCircle className="h-4 w-4" /><span>{t('contact.error')}</span></div>}
                  <button type="submit" disabled={formStatus === 'loading'} className="w-full sm:w-auto ripple-effect inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-display text-sm tracking-wider uppercase border border-[var(--neon-cyan)] text-[var(--neon-cyan)] transition-all hover:shadow-[var(--glow-cyan)] hover:bg-[var(--neon-cyan)] hover:text-[var(--dark-base)] disabled:opacity-50 disabled:cursor-not-allowed">
                    {formStatus === 'loading' ? <><Loader2 className="h-4 w-4 animate-spin" />{t('contact.sending')}</> : <><Send className="h-4 w-4" />{t('contact.send')}</>}
                  </button>
                </form>
              )}
            </div></TiltCard>

            {/* Feature 1: Interactive Location Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="map-card relative p-4 sm:p-5 rounded-xl glass border border-[var(--glass-border)] overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,245,255,0.15)] hover:border-[var(--neon-cyan)]/30"
            >
              <h3 className="font-display text-xs sm:text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2 w-full">
                <MapPin className="h-4 w-4 text-[var(--neon-cyan)]" />
                {t('contact.mapTitle')}
              </h3>
              <div 
                className="rounded-lg overflow-hidden relative group cursor-pointer" 
                style={{ height: '200px' }}
                onClick={() => setShowMapModal(true)}
              >
                <iframe
                  title="Kedungasri, Tegaldlimo, Banyuwangi Location"
                  src={
                    hasValidKey
                      ? `https://www.google.com/maps/embed/v1/place?key=${MAPS_API_KEY}&q=dusun+pondokasem+rt+026+rw+005+desa+kedungasri,+kecamatan+tegaldlimo+kabupaten+banyuwangi+jawa+timur+indonesia`
                      : 'https://maps.google.com/maps?q=dusun+pondokasem+desa+kedungasri+tegaldlimo+banyuwangi&t=&z=14&ie=UTF8&iwloc=&output=embed'
                  }
                  style={{ width: '100%', height: '100%', border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="pointer-events-none"
                />
                {/* Visual Glass Overlay with pulse indicator */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
                  <div className="bg-zinc-950/90 border border-[var(--neon-cyan)] px-4 py-2 rounded-lg flex items-center gap-2 shadow-[var(--glow-cyan)] transform scale-95 group-hover:scale-100 transition-all duration-300">
                    <ExternalLink className="h-4 w-4 text-[var(--neon-cyan)] animate-pulse" />
                    <span className="text-xs font-mono-custom text-[var(--neon-cyan)] font-bold tracking-wider uppercase">
                      {lang === 'id' ? 'Buka di Maps?' : 'Open in Maps?'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Map Confirmation Modal */}
      <AnimatePresence>
        {showMapModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMapModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md p-6 rounded-xl bg-zinc-950/95 border border-[var(--neon-cyan)]/30 shadow-[0_0_50px_rgba(0,245,255,0.15)] z-10 overflow-hidden"
            >
              {/* Cyberpunk Decorative Accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[var(--neon-cyan)]" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[var(--neon-cyan)]" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[var(--neon-magenta)]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[var(--neon-magenta)]" />

              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-lg bg-[var(--neon-cyan)]/10 border border-[var(--neon-cyan)]/20 text-[var(--neon-cyan)] shrink-0">
                  <MapPin className="h-6 w-6 animate-bounce" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-display font-bold text-[var(--text-primary)] tracking-wide uppercase">
                    {lang === 'id' ? 'Buka di Maps?' : 'Open in Maps?'}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                    {lang === 'id'
                      ? 'Apakah Anda ingin membuka alamat ini di Google Maps?'
                      : 'Do you want to open this address in Google Maps?'}
                  </p>
                  {/* Specific Address Badge */}
                  <div className="mt-3 p-2.5 rounded-md bg-zinc-900/50 border border-zinc-800 text-[11px] font-mono-custom text-[var(--text-primary)]/80 leading-relaxed">
                    dusun pondokasem rt 026 rw 005 desa kedungasri, kecamatan tegaldlimo kabupaten banyuwangi jawa timur indonesia
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowMapModal(false)}
                  className="px-4 py-2 text-xs font-mono-custom font-semibold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors border border-transparent rounded-md"
                >
                  {lang === 'id' ? 'Batal' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMapModal(false)
                    window.open(
                      'https://www.google.com/maps/search/?api=1&query=dusun+pondokasem+rt+026+rw+005+desa+kedungasri,+kecamatan+tegaldlimo+kabupaten+banyuwangi+jawa+timur+indonesia',
                      '_blank',
                      'noopener,noreferrer'
                    )
                  }}
                  className="px-5 py-2.5 bg-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/80 text-[var(--dark-base)] font-mono-custom font-bold text-xs uppercase tracking-wider rounded-md transition-all shadow-[var(--glow-cyan)] hover:shadow-none"
                >
                  {lang === 'id' ? 'Iya' : 'Yes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}