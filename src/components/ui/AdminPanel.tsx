'use client'

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  FileText,
  BarChart3,
  Wrench,
  Lock,
  Users,
  Eye,
  Mail,
  Download,
  Upload,
  Trash2,
  Shield,
  Info,
  RotateCcw,
  Save,
  ChevronRight,
  RefreshCw,
  Copy,
  Monitor,
  CheckCircle2,
  AlertCircle,
  Clock,
  Globe,
  Activity,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToastStore } from '@/store/toast-store'

// ─── Types ───────────────────────────────────────────────────────────────────

interface CMSField {
  key: string
  label: string
  type: 'input' | 'textarea'
  defaultValue: string
  currentValue: string
}

interface CMSGroup {
  id: string
  label: string
  icon: string
  fields: CMSField[]
}

interface DashboardData {
  totalVisitors: number
  totalPageViews: number
  contactSubmissions: number
  avgSectionsPerVisit: number
  sectionViews: { section: string; views: number }[]
  recentVisitors: {
    sessionId: string
    timestamp: string
    country: string
    sectionsViewed: string[]
  }[]
  contactSubmissionsList: {
    id: string
    name: string
    email: string
    subject: string
    timestamp: string
  }[]
}

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'zayidan-admin-2024'

// ─── Content Group Definitions ──────────────────────────────────────────────

function buildCMSGroups(): CMSGroup[] {
  return [
    {
      id: 'about',
      label: 'About',
      icon: '👤',
      fields: [
        { key: 'about.bio', label: 'Bio', type: 'textarea', defaultValue: '', currentValue: '' },
        { key: 'about.bio2', label: 'Bio (Extended)', type: 'textarea', defaultValue: '', currentValue: '' },
        { key: 'hero.location', label: 'Location', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'hero.role', label: 'Role / Title', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'hero.tagline', label: 'Tagline', type: 'textarea', defaultValue: '', currentValue: '' },
      ],
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: '📬',
      fields: [
        { key: 'contact.email', label: 'Email Address', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'contact.phone', label: 'Phone Number', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'contact.linkedin', label: 'LinkedIn URL', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'contact.github', label: 'GitHub URL', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'contact.telegram', label: 'Telegram URL', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'contact.instagram', label: 'Instagram URL', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'contact.discord', label: 'Discord URL', type: 'input', defaultValue: '', currentValue: '' },
      ],
    },
    {
      id: 'experience',
      label: 'Experience',
      icon: '💼',
      fields: [
        { key: 'experience.0.role', label: 'Role (Entry 1)', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'experience.0.company', label: 'Company (Entry 1)', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'experience.0.period.start', label: 'Start Date (Entry 1)', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'experience.1.role', label: 'Role (Entry 2)', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'experience.1.company', label: 'Company (Entry 2)', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'experience.1.period.start', label: 'Start Date (Entry 2)', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'experience.2.role', label: 'Role (Entry 3)', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'experience.2.company', label: 'Company (Entry 3)', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'experience.2.period.start', label: 'Start Date (Entry 3)', type: 'input', defaultValue: '', currentValue: '' },
      ],
    },
    {
      id: 'faq',
      label: 'FAQ',
      icon: '❓',
      fields: [
        { key: 'faq.q0', label: 'Question 1', type: 'textarea', defaultValue: '', currentValue: '' },
        { key: 'faq.a0', label: 'Answer 1', type: 'textarea', defaultValue: '', currentValue: '' },
        { key: 'faq.q1', label: 'Question 2', type: 'textarea', defaultValue: '', currentValue: '' },
        { key: 'faq.a1', label: 'Answer 2', type: 'textarea', defaultValue: '', currentValue: '' },
        { key: 'faq.q2', label: 'Question 3', type: 'textarea', defaultValue: '', currentValue: '' },
        { key: 'faq.a2', label: 'Answer 3', type: 'textarea', defaultValue: '', currentValue: '' },
        { key: 'faq.q3', label: 'Question 4', type: 'textarea', defaultValue: '', currentValue: '' },
        { key: 'faq.a3', label: 'Answer 4', type: 'textarea', defaultValue: '', currentValue: '' },
        { key: 'faq.q4', label: 'Question 5', type: 'textarea', defaultValue: '', currentValue: '' },
        { key: 'faq.a4', label: 'Answer 5', type: 'textarea', defaultValue: '', currentValue: '' },
      ],
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: '⚡',
      fields: [
        { key: 'about.skills.hardTitle', label: 'Hard Skills Title', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'about.skills.computer', label: 'Computer Operation', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'about.skills.video', label: 'Video Editing', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'about.skills.design', label: 'Graphic Design', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'about.skills.ai', label: 'AI Prompting', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'about.skills.financial', label: 'Financial Market', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'about.skills.python', label: 'Python', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'about.skills.softwareDev', label: 'Software Dev', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'about.skills.softTitle', label: 'Soft Skills Title', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'about.skills.team', label: 'Teamwork', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'about.skills.leadership', label: 'Leadership', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'about.skills.communication', label: 'Communication', type: 'input', defaultValue: '', currentValue: '' },
      ],
    },
    {
      id: 'stats',
      label: 'Stats',
      icon: '📊',
      fields: [
        { key: 'stats.experience.value', label: 'Experience Value', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'stats.experience.label', label: 'Experience Label', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'stats.hardSkills.value', label: 'Hard Skills Value', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'stats.hardSkills.label', label: 'Hard Skills Label', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'stats.softSkills.value', label: 'Soft Skills Value', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'stats.softSkills.label', label: 'Soft Skills Label', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'stats.clients.value', label: 'Clients Value', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'stats.clients.label', label: 'Clients Label', type: 'input', defaultValue: '', currentValue: '' },
      ],
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: '🏆',
      fields: [
        { key: 'achievements.items.firstSale.title', label: 'First Sale Title', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'achievements.items.firstSale.desc', label: 'First Sale Desc', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'achievements.items.hundredClients.title', label: '100 Clients Title', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'achievements.items.hundredClients.desc', label: '100 Clients Desc', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'achievements.items.topPerformer.title', label: 'Top Performer Title', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'achievements.items.topPerformer.desc', label: 'Top Performer Desc', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'achievements.items.teamLeader.title', label: 'Team Leader Title', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'achievements.items.teamLeader.desc', label: 'Team Leader Desc', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'achievements.items.negotiator.title', label: 'Negotiator Title', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'achievements.items.negotiator.desc', label: 'Negotiator Desc', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'achievements.items.quickLearner.title', label: 'Quick Learner Title', type: 'input', defaultValue: '', currentValue: '' },
        { key: 'achievements.items.quickLearner.desc', label: 'Quick Learner Desc', type: 'input', defaultValue: '', currentValue: '' },
      ],
    },
  ]
}

// ─── Auth Gate ───────────────────────────────────────────────────────────────

function AdminPanelInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const isAdmin = searchParams.get('admin') === 'true'
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [authError, setAuthError] = useState(false)

  const handleAuth = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setAuthError(false)
    } else {
      setAuthError(true)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAuth()
  }

  if (!isAdmin) return null

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center"
        style={{ background: 'rgba(10, 10, 15, 0.92)', backdropFilter: 'blur(8px)' }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="glass border border-[var(--glass-border)] glass-card-advanced rounded-2xl p-8 w-full max-w-md mx-4"
        >
          <div className="flex flex-col items-center gap-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
                boxShadow: 'var(--glow-cyan)',
              }}
            >
              <Lock className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <h2 className="font-display text-xl font-bold text-[var(--text-primary)] mb-1">
                Admin Access
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Enter the admin password to continue
              </p>
            </div>
            <div className="w-full space-y-3">
              <Input
                type="password"
                placeholder="Enter password..."
                value={passwordInput}
                onChange={(e) => { setPasswordInput(e.target.value); setAuthError(false) }}
                onKeyDown={handleKeyDown}
                className="h-11 bg-[var(--dark-surface)] border-[var(--glass-border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] font-mono-custom text-sm"
                autoFocus
              />
              <AnimatePresence>
                {authError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs text-red-400 flex items-center gap-1.5"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    Invalid password. Please try again.
                  </motion.p>
                )}
              </AnimatePresence>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className="flex-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  onClick={() => router.push('/')}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 h-11 font-mono-custom text-sm"
                  style={{
                    background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
                    color: '#0A0A0F',
                    fontWeight: 600,
                  }}
                  onClick={handleAuth}
                >
                  Unlock
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return <AdminPanelContent password={passwordInput} />
}

// ─── Main Admin Panel Content ────────────────────────────────────────────────

function AdminPanelContent({ password }: { password: string }) {
  const router = useRouter()
  const addToast = useToastStore((s) => s.addToast)
  const [activeTab, setActiveTab] = useState('content')
  const [cmsGroups, setCmsGroups] = useState<CMSGroup[]>(buildCMSGroups())
  const [selectedGroup, setSelectedGroup] = useState<string>('about')
  const [savingField, setSavingField] = useState<string | null>(null)
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [analyticsError, setAnalyticsError] = useState<string | null>(null)
  const [copyrightEnabled, setCopyrightEnabled] = useState(false)
  const [importing, setImporting] = useState(false)
  const [clearingAnalytics, setClearingAnalytics] = useState(false)
  const analyticsTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${password}`,
  }

  // ─── CMS Operations ──────────────────────────────────────────────────────

  const fetchCMS = useCallback(async () => {
    try {
      const res = await fetch('/api/cms', { headers: { Authorization: `Bearer ${password}` } })
      if (!res.ok) return
      const json = await res.json()
      // API returns { success, data: [...items], grouped }
      const items: { key: string; value: string }[] = json.data || json || []
      const kvMap: Record<string, string> = {}
      for (const item of items) { kvMap[item.key] = item.value }
      setCmsGroups((prev) =>
        prev.map((group) => ({
          ...group,
          fields: group.fields.map((field) => ({
            ...field,
            currentValue: kvMap[field.key] || '',
          })),
        }))
      )
    } catch {
      // silent fail — defaults remain
    }
  }, [password])

  const saveField = async (groupIdx: number, fieldIdx: number) => {
    const group = cmsGroups[groupIdx]
    const field = group.fields[fieldIdx]
    setSavingField(field.key)
    try {
      const res = await fetch('/api/cms', {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ key: field.key, value: field.currentValue }),
      })
      if (res.ok) {
        addToast(`Saved "${field.label}" successfully`, 'success')
      } else {
        addToast(`Failed to save "${field.label}"`, 'error')
      }
    } catch {
      addToast(`Network error saving "${field.label}"`, 'error')
    } finally {
      setSavingField(null)
    }
  }

  const resetField = async (groupIdx: number, fieldIdx: number) => {
    const field = cmsGroups[groupIdx].fields[fieldIdx]
    setCmsGroups((prev) =>
      prev.map((g, gi) =>
        gi === groupIdx
          ? {
              ...g,
              fields: g.fields.map((f, fi) => (fi === fieldIdx ? { ...f, currentValue: '' } : f)),
            }
          : g
      )
    )
    setSavingField(`reset-${field.key}`)
    try {
      const res = await fetch('/api/cms', {
        method: 'DELETE',
        headers: authHeaders,
        body: JSON.stringify({ key: field.key }),
      })
      if (res.ok) {
        addToast(`Reset "${field.label}" to default`, 'info')
      }
    } catch {
      addToast(`Failed to reset "${field.label}"`, 'error')
    } finally {
      setSavingField(null)
    }
  }

  const updateFieldValue = (groupIdx: number, fieldIdx: number, value: string) => {
    setCmsGroups((prev) =>
      prev.map((g, gi) =>
        gi === groupIdx
          ? {
              ...g,
              fields: g.fields.map((f, fi) => (fi === fieldIdx ? { ...f, currentValue: value } : f)),
            }
          : g
      )
    )
  }

  // ─── Analytics ───────────────────────────────────────────────────────────

  const fetchAnalytics = useCallback(async () => {
    setAnalyticsLoading(true)
    setAnalyticsError(null)
    try {
      const res = await fetch('/api/analytics/dashboard', {
        headers: { Authorization: `Bearer ${password}` },
      })
      if (!res.ok) throw new Error('Failed to fetch analytics')
      const json = await res.json()
      // API wraps in { success, data: {...} }
      const data: DashboardData = json.data || json
      setDashboard({
        totalVisitors: data.totalVisitors ?? 0,
        totalPageViews: data.totalPageViews ?? 0,
        contactSubmissions: data.contactSubmissions ?? 0,
        avgSectionsPerVisit: data.avgSectionsPerVisit ?? 0,
        sectionViews: data.sectionViews ?? [],
        recentVisitors: data.recentVisitors ?? [],
        contactSubmissionsList: data.contactSubmissionsList ?? [],
      })
    } catch {
      setAnalyticsError('Unable to load analytics data')
    } finally {
      setAnalyticsLoading(false)
    }
  }, [password])

  // Auto-refresh analytics every 30s
  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics()
      analyticsTimerRef.current = setInterval(fetchAnalytics, 30000)
    }
    return () => {
      if (analyticsTimerRef.current) clearInterval(analyticsTimerRef.current)
    }
  }, [activeTab, fetchAnalytics])

  // Fetch CMS on mount
  useEffect(() => {
    fetchCMS()
  }, [fetchCMS])

  // ─── Backup Operations ───────────────────────────────────────────────────

  const handleExport = async () => {
    try {
      const res = await fetch('/api/backup', {
        headers: { Authorization: `Bearer ${password}` },
      })
      if (!res.ok) {
        addToast('Export failed', 'error')
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      addToast('Backup exported successfully', 'success')
    } catch {
      addToast('Export failed — network error', 'error')
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      const res = await fetch('/api/backup', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(data),
      })
      if (res.ok) {
        addToast('Backup imported successfully', 'success')
        fetchCMS()
      } else {
        addToast('Import failed — invalid format', 'error')
      }
    } catch {
      addToast('Import failed — invalid JSON file', 'error')
    } finally {
      setImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleClearAnalytics = async () => {
    setClearingAnalytics(true)
    try {
      const res = await fetch('/api/analytics/dashboard', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${password}` },
      })
      if (res.ok) {
        addToast('Analytics data cleared', 'success')
        setDashboard(null)
      } else {
        addToast('Failed to clear analytics', 'error')
      }
    } catch {
      addToast('Failed to clear analytics — network error', 'error')
    } finally {
      setClearingAnalytics(false)
    }
  }

  // ─── Environment Info ────────────────────────────────────────────────────

  const getEnvInfo = (): Record<string, string> => {
    if (typeof window === 'undefined') return {}
    try {
      const cs = getComputedStyle(document.documentElement)
      const ua = navigator.userAgent || ''
      return {
        'Theme': document.documentElement.classList.contains('dark') ? 'Dark (Cyberpunk)' : 'Light',
        'Neon Cyan': cs.getPropertyValue('--neon-cyan').trim(),
        'Neon Magenta': cs.getPropertyValue('--neon-magenta').trim(),
        'Neon Purple': cs.getPropertyValue('--neon-purple').trim(),
        'Glass BG': cs.getPropertyValue('--glass-bg').trim().slice(0, 40) + '...',
        'Browser': ua.split(' ').slice(-2).join(' '),
        'Viewport': `${window.innerWidth}×${window.innerHeight}`,
        'Platform': navigator.userAgentData?.platform || 'Unknown',
      }
    } catch {
      return { 'Theme': 'Unknown' }
    }
  }

  // ─── Close Panel ─────────────────────────────────────────────────────────

  const closePanel = () => {
    router.push('/')
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  const currentGroup = cmsGroups.find((g) => g.id === selectedGroup)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
        style={{ background: 'rgba(10, 10, 15, 0.92)', backdropFilter: 'blur(8px)' }}
        onClick={(e) => { if (e.target === e.currentTarget) closePanel() }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="glass border border-[var(--glass-border)] glass-card-advanced rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden"
          style={{ background: 'var(--dark-surface)' }}
        >
          {/* ─── Top Bar ─────────────────────────────────────────────────── */}
          <div
            className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[var(--glass-border)] shrink-0"
            style={{ background: 'var(--glass-bg)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-magenta))',
                }}
              >
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="font-display text-base sm:text-lg font-bold text-[var(--text-primary)] leading-tight">
                  Admin Panel
                </h1>
                <p className="text-[10px] sm:text-xs text-[var(--text-secondary)] font-mono-custom">
                  ZAYIDAN PORTFOLIO CMS
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                className="text-[10px] px-2 py-0"
                style={{
                  background: 'rgba(0, 245, 255, 0.1)',
                  color: 'var(--neon-cyan)',
                  border: '1px solid rgba(0, 245, 255, 0.2)',
                }}
              >
                <Activity className="w-3 h-3 mr-1" />
                Live
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                onClick={closePanel}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* ─── Tabs Navigation ─────────────────────────────────────────── */}
          <div className="px-4 sm:px-6 pt-4 shrink-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList
                className="w-full h-10 rounded-lg p-1"
                style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                }}
              >
                <TabsTrigger
                  value="content"
                  className="flex-1 gap-2 text-xs sm:text-sm font-mono-custom data-[state=active]:text-[var(--neon-cyan)]"
                  style={{
                    borderRadius: '0.5rem',
                  }}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Content Editor</span>
                  <span className="sm:hidden">CMS</span>
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="flex-1 gap-2 text-xs sm:text-sm font-mono-custom data-[state=active]:text-[var(--neon-cyan)]"
                  style={{ borderRadius: '0.5rem' }}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
                <TabsTrigger
                  value="tools"
                  className="flex-1 gap-2 text-xs sm:text-sm font-mono-custom data-[state=active]:text-[var(--neon-cyan)]"
                  style={{ borderRadius: '0.5rem' }}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  Tools
                </TabsTrigger>
              </TabsList>

              {/* ─── Tab Content ──────────────────────────────────────────── */}
              <div className="mt-4 overflow-hidden flex-1 min-h-0">
                <TabsContent value="content" className="m-0">
                  <ContentEditorTab
                    groups={cmsGroups}
                    selectedGroup={selectedGroup}
                    onSelectGroup={setSelectedGroup}
                    onUpdateField={updateFieldValue}
                    onSaveField={saveField}
                    onResetField={resetField}
                    savingField={savingField}
                    currentGroup={currentGroup}
                  />
                </TabsContent>

                <TabsContent value="analytics" className="m-0">
                  <AnalyticsTab
                    dashboard={dashboard}
                    loading={analyticsLoading}
                    error={analyticsError}
                    onRefresh={fetchAnalytics}
                  />
                </TabsContent>

                <TabsContent value="tools" className="m-0">
                  <ToolsTab
                    copyrightEnabled={copyrightEnabled}
                    onToggleCopyright={setCopyrightEnabled}
                    onExport={handleExport}
                    onImport={handleImport}
                    onClearAnalytics={handleClearAnalytics}
                    importing={importing}
                    clearingAnalytics={clearingAnalytics}
                    fileInputRef={fileInputRef}
                    getEnvInfo={getEnvInfo}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* ─── Bottom Bar ──────────────────────────────────────────────── */}
          <div
            className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-[var(--glass-border)] shrink-0 mt-auto"
            style={{ background: 'var(--glass-bg)' }}
          >
            <div className="flex items-center gap-2 text-[10px] sm:text-xs text-[var(--text-secondary)] font-mono-custom">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Connected to local database
            </div>
            <div className="text-[10px] sm:text-xs text-[var(--text-secondary)] font-mono-custom">
              v1.0.0
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Tab 1: Content Editor ──────────────────────────────────────────────────

function ContentEditorTab({
  groups,
  selectedGroup,
  onSelectGroup,
  onUpdateField,
  onSaveField,
  onResetField,
  savingField,
  currentGroup,
}: {
  groups: CMSGroup[]
  selectedGroup: string
  onSelectGroup: (id: string) => void
  onUpdateField: (gi: number, fi: number, val: string) => void
  onSaveField: (gi: number, fi: number) => Promise<void>
  onResetField: (gi: number, fi: number) => Promise<void>
  savingField: string | null
  currentGroup: CMSGroup | undefined
}) {
  if (!currentGroup) return null

  return (
    <div className="flex flex-col sm:flex-row gap-4 min-h-0" style={{ maxHeight: 'calc(90vh - 200px)' }}>
      {/* ─── Sidebar ─────────────────────────────────────────────────────── */}
      <div className="sm:w-52 shrink-0">
        <div className="rounded-xl p-2 space-y-1" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
          <p className="text-[10px] font-mono-custom text-[var(--text-secondary)] uppercase tracking-widest px-3 py-2">
            Categories
          </p>
          {groups.map((group) => (
            <button
              key={group.id}
              onClick={() => onSelectGroup(group.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-all duration-200 ${
                selectedGroup === group.id
                  ? 'text-[var(--neon-cyan)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
              }`}
              style={
                selectedGroup === group.id
                  ? { background: 'rgba(0, 245, 255, 0.08)', boxShadow: 'inset 0 0 0 1px rgba(0, 245, 255, 0.15)' }
                  : undefined
              }
            >
              <span className="text-base">{group.icon}</span>
              <span className="font-mono-custom text-xs">{group.label}</span>
              {selectedGroup === group.id && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Editor Form ─────────────────────────────────────────────────── */}
      <ScrollArea className="flex-1 min-h-0 pr-1">
        <div className="rounded-xl p-4 sm:p-5 space-y-5" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{currentGroup.icon}</span>
              <div>
                <h3 className="font-display text-sm font-bold text-[var(--text-primary)]">
                  {currentGroup.label}
                </h3>
                <p className="text-[10px] font-mono-custom text-[var(--text-secondary)]">
                  {currentGroup.fields.length} field{currentGroup.fields.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <Badge
              className="text-[10px] px-2 py-0"
              style={{
                background: 'rgba(139, 92, 246, 0.1)',
                color: 'var(--neon-purple)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
              }}
            >
              CMS
            </Badge>
          </div>

          <Separator className="opacity-50" />

          <div className="space-y-4">
            {currentGroup.fields.map((field, fi) => {
              const groupIdx = groups.findIndex((g) => g.id === currentGroup.id)
              const isSaving = savingField === field.key || savingField === `reset-${field.key}`
              const isModified = field.currentValue !== '' && field.currentValue !== field.defaultValue

              return (
                <motion.div
                  key={field.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: fi * 0.03 }}
                  className="space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono-custom text-[var(--text-secondary)] flex items-center gap-2">
                      {field.key}
                      {isModified && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-magenta)]" />
                      )}
                    </label>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        disabled={isSaving || !isModified}
                        onClick={() => onResetField(groupIdx, fi)}
                        title="Reset to default"
                      >
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Reset
                      </Button>
                      <Button
                        size="sm"
                        className="h-6 px-3 text-[10px]"
                        style={{
                          background: isModified ? 'var(--neon-cyan)' : 'var(--glass-border)',
                          color: isModified ? 'var(--dark-base)' : 'var(--text-secondary)',
                        }}
                        disabled={isSaving || !isModified}
                        onClick={() => onSaveField(groupIdx, fi)}
                      >
                        {isSaving ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <Save className="w-3 h-3 mr-1" />
                        )}
                        Save
                      </Button>
                    </div>
                  </div>
                  {field.type === 'textarea' ? (
                    <Textarea
                      value={field.currentValue}
                      onChange={(e) => onUpdateField(groupIdx, fi, e.target.value)}
                      placeholder={field.defaultValue || `Enter ${field.label}...`}
                      rows={3}
                      className="bg-[var(--dark-surface)] border-[var(--glass-border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 font-mono-custom text-xs resize-none"
                    />
                  ) : (
                    <Input
                      value={field.currentValue}
                      onChange={(e) => onUpdateField(groupIdx, fi, e.target.value)}
                      placeholder={field.defaultValue || `Enter ${field.label}...`}
                      className="h-9 bg-[var(--dark-surface)] border-[var(--glass-border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 font-mono-custom text-xs"
                    />
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

// ─── Tab 2: Analytics Dashboard ─────────────────────────────────────────────

function AnalyticsTab({
  dashboard,
  loading,
  error,
  onRefresh,
}: {
  dashboard: DashboardData | null
  loading: boolean
  error: string | null
  onRefresh: () => void
}) {
  const maxSectionViews = dashboard?.sectionViews?.length
    ? Math.max(...dashboard.sectionViews.map((s) => s.views), 1)
    : 1

  return (
    <ScrollArea className="pr-1" style={{ maxHeight: 'calc(90vh - 200px)' }}>
      <div className="space-y-4">
        {/* ─── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-sm font-bold text-[var(--text-primary)]">
              Dashboard Overview
            </h3>
            <p className="text-[10px] font-mono-custom text-[var(--text-secondary)] mt-0.5">
              Auto-refreshes every 30 seconds
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--text-secondary)] hover:text-[var(--neon-cyan)]"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* ─── Error State ────────────────────────────────────────────────── */}
        {error && (
          <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255, 68, 102, 0.08)', border: '1px solid rgba(255, 68, 102, 0.2)' }}>
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-sm text-red-400 font-mono-custom">{error}</p>
          </div>
        )}

        {/* ─── Loading Skeleton ───────────────────────────────────────────── */}
        {loading && !dashboard && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl p-4 animate-pulse" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                <div className="w-8 h-8 rounded-lg mb-3" style={{ background: 'var(--glass-border)' }} />
                <div className="w-16 h-5 rounded mb-1" style={{ background: 'var(--glass-border)' }} />
                <div className="w-24 h-3 rounded" style={{ background: 'var(--glass-border)' }} />
              </div>
            ))}
          </div>
        )}

        {/* ─── Stats Cards ────────────────────────────────────────────────── */}
        {dashboard && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Total Visitors', value: dashboard.totalVisitors, icon: Users, color: 'var(--neon-cyan)' },
                { label: 'Total Page Views', value: dashboard.totalPageViews, icon: Eye, color: 'var(--neon-magenta)' },
                { label: 'Contact Submissions', value: dashboard.contactSubmissions, icon: Mail, color: 'var(--neon-purple)' },
                { label: 'Avg. Sections/Visit', value: typeof dashboard.avgSectionsPerVisit === 'number' ? dashboard.avgSectionsPerVisit.toFixed(1) : '0.0', icon: BarChart3, color: '#00FF88' },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="glass border border-[var(--glass-border)] glass-card-advanced rounded-xl p-4"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: `${stat.color}15`, color: stat.color }}
                  >
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <p className="font-display text-xl font-bold text-[var(--text-primary)] leading-tight">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </p>
                  <p className="text-[10px] font-mono-custom text-[var(--text-secondary)] mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* ─── Section Views Bar Chart ─────────────────────────────────── */}
            {dashboard.sectionViews && dashboard.sectionViews.length > 0 && (
              <div className="rounded-xl p-4 sm:p-5" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                <h4 className="font-display text-xs font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 text-[var(--neon-cyan)]" />
                  Views Per Section
                </h4>
                <div className="space-y-3">
                  {dashboard.sectionViews.map((section, idx) => {
                    const pct = (section.views / maxSectionViews) * 100
                    const colors = ['var(--neon-cyan)', 'var(--neon-magenta)', 'var(--neon-purple)', '#00FF88', '#FF8800']
                    const color = colors[idx % colors.length]
                    return (
                      <div key={section.section} className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono-custom">
                          <span className="text-[var(--text-secondary)]">{section.section}</span>
                          <span className="text-[var(--text-primary)]">{section.views}</span>
                        </div>
                        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--dark-base)' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.4, 0, 0.2, 1] }}
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(90deg, ${color}, ${color}88)`,
                              boxShadow: `0 0 12px ${color}44`,
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ─── Recent Visitors Table ───────────────────────────────────── */}
            {dashboard.recentVisitors && dashboard.recentVisitors.length > 0 && (
              <div className="rounded-xl p-4 sm:p-5" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                <h4 className="font-display text-xs font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[var(--neon-magenta)]" />
                  Recent Visitors
                </h4>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <table className="w-full text-[11px] font-mono-custom">
                    <thead>
                      <tr className="border-b border-[var(--glass-border)]">
                        <th className="text-left py-2 px-3 text-[var(--text-secondary)] font-medium">Session</th>
                        <th className="text-left py-2 px-3 text-[var(--text-secondary)] font-medium">Time</th>
                        <th className="text-left py-2 px-3 text-[var(--text-secondary)] font-medium">Country</th>
                        <th className="text-left py-2 px-3 text-[var(--text-secondary)] font-medium">Sections</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.recentVisitors.map((visitor, idx) => (
                        <motion.tr
                          key={visitor.sessionId}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: idx * 0.04 }}
                          className="border-b border-[var(--glass-border)]/50 last:border-0"
                        >
                          <td className="py-2.5 px-3 text-[var(--text-primary)] flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-[var(--neon-cyan)]" />
                            {visitor.sessionId.slice(0, 8)}...
                          </td>
                          <td className="py-2.5 px-3 text-[var(--text-secondary)]">
                            {new Date(visitor.timestamp).toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="flex items-center gap-1 text-[var(--text-primary)]">
                              <Globe className="w-3 h-3 text-[var(--neon-purple)]" />
                              {visitor.country}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex flex-wrap gap-1">
                              {visitor.sectionsViewed.map((s) => (
                                <Badge
                                  key={s}
                                  className="text-[9px] px-1.5 py-0"
                                  style={{
                                    background: 'rgba(0, 245, 255, 0.08)',
                                    color: 'var(--neon-cyan)',
                                    border: '1px solid rgba(0, 245, 255, 0.15)',
                                  }}
                                >
                                  {s}
                                </Badge>
                              ))}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ─── Contact Submissions ─────────────────────────────────────── */}
            {dashboard.contactSubmissionsList && dashboard.contactSubmissionsList.length > 0 && (
              <div className="rounded-xl p-4 sm:p-5" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                <h4 className="font-display text-xs font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[var(--neon-purple)]" />
                  Contact Submissions
                </h4>
                <div className="space-y-2.5">
                  {dashboard.contactSubmissionsList.map((sub, idx) => (
                    <motion.div
                      key={sub.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.04 }}
                      className="rounded-lg p-3 space-y-1"
                      style={{ background: 'var(--dark-surface)', border: '1px solid var(--glass-border)' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono-custom font-medium text-[var(--text-primary)]">
                          {sub.name}
                        </span>
                        <span className="text-[9px] font-mono-custom text-[var(--text-secondary)]">
                          {new Date(sub.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-mono-custom text-[var(--text-secondary)]">
                        <span>{sub.email}</span>
                        <span className="text-[var(--glass-border)]">|</span>
                        <span>{sub.subject}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── Empty State ─────────────────────────────────────────────── */}
            {!loading && dashboard.sectionViews?.length === 0 && dashboard.recentVisitors?.length === 0 && (
              <div className="rounded-xl p-8 text-center" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                <Activity className="w-10 h-10 text-[var(--text-secondary)]/30 mx-auto mb-3" />
                <p className="text-sm text-[var(--text-secondary)] font-mono-custom">
                  No analytics data yet. Visitors will appear here once the site receives traffic.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </ScrollArea>
  )
}

// ─── Tab 3: Tools ───────────────────────────────────────────────────────────

function ToolsTab({
  copyrightEnabled,
  onToggleCopyright,
  onExport,
  onImport,
  onClearAnalytics,
  importing,
  clearingAnalytics,
  fileInputRef,
  getEnvInfo,
}: {
  copyrightEnabled: boolean
  onToggleCopyright: (v: boolean) => void
  onExport: () => Promise<void>
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClearAnalytics: () => Promise<void>
  importing: boolean
  clearingAnalytics: boolean
  fileInputRef: React.RefObject<HTMLInputElement | null>
  getEnvInfo: () => Record<string, string>
}) {
  const envInfo = getEnvInfo()

  return (
    <ScrollArea className="pr-1" style={{ maxHeight: 'calc(90vh - 200px)' }}>
      <div className="space-y-4">
        {/* ─── Backup & Restore ──────────────────────────────────────────── */}
        <div className="rounded-xl p-4 sm:p-5" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
          <h4 className="font-display text-xs font-bold text-[var(--text-primary)] mb-1 flex items-center gap-2">
            <Download className="w-3.5 h-3.5 text-[var(--neon-cyan)]" />
            Backup & Restore
          </h4>
          <p className="text-[10px] font-mono-custom text-[var(--text-secondary)] mb-4">
            Export and import all CMS content as JSON
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={onExport}
              className="h-9 text-xs font-mono-custom gap-2"
              style={{
                background: 'rgba(0, 245, 255, 0.1)',
                color: 'var(--neon-cyan)',
                border: '1px solid rgba(0, 245, 255, 0.2)',
              }}
            >
              <Download className="w-3.5 h-3.5" />
              Export Backup
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="h-9 text-xs font-mono-custom gap-2"
              style={{
                background: 'rgba(139, 92, 246, 0.1)',
                color: 'var(--neon-purple)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
              }}
            >
              {importing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              Import Backup
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={onImport}
            />
          </div>
        </div>

        {/* ─── Copyright Protection ───────────────────────────────────────── */}
        <div className="rounded-xl p-4 sm:p-5" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-display text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[var(--neon-magenta)]" />
                Copyright Protection
              </h4>
              <p className="text-[10px] font-mono-custom text-[var(--text-secondary)] mt-0.5">
                Enable content protection overlay on the page
              </p>
            </div>
            <Switch checked={copyrightEnabled} onCheckedChange={onToggleCopyright} />
          </div>
          {copyrightEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2"
              style={{ background: 'rgba(0, 245, 255, 0.06)', border: '1px solid rgba(0, 245, 255, 0.1)' }}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--neon-cyan)] shrink-0" />
              <span className="text-[10px] font-mono-custom text-[var(--neon-cyan)]">
                Copyright protection is active
              </span>
            </motion.div>
          )}
        </div>

        {/* ─── Clear Analytics ────────────────────────────────────────────── */}
        <div className="rounded-xl p-4 sm:p-5" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
          <h4 className="font-display text-xs font-bold text-[var(--text-primary)] mb-1 flex items-center gap-2">
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            Danger Zone
          </h4>
          <p className="text-[10px] font-mono-custom text-[var(--text-secondary)] mb-4">
            Permanently clear all analytics data. This action cannot be undone.
          </p>
          <Button
            onClick={onClearAnalytics}
            disabled={clearingAnalytics}
            className="h-9 text-xs font-mono-custom gap-2"
            style={{
              background: 'rgba(255, 68, 102, 0.1)',
              color: '#FF4466',
              border: '1px solid rgba(255, 68, 102, 0.2)',
            }}
          >
            {clearingAnalytics ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
            Clear All Analytics
          </Button>
        </div>

        {/* ─── Environment Info ──────────────────────────────────────────── */}
        <div className="rounded-xl p-4 sm:p-5" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
          <h4 className="font-display text-xs font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-[var(--neon-purple)]" />
            Environment Info
          </h4>
          <div className="space-y-2.5">
            {Object.entries(envInfo).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between text-[11px] font-mono-custom">
                <span className="text-[var(--text-secondary)]">{key}</span>
                <span className="text-[var(--text-primary)] flex items-center gap-1.5 max-w-[60%] text-right truncate">
                  {value}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(value)
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-[var(--neon-cyan)] shrink-0"
                    title="Copy"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </span>
              </div>
            ))}
          </div>
          <Separator className="my-3 opacity-30" />
          <div className="text-[9px] font-mono-custom text-[var(--text-secondary)] flex items-center gap-1.5">
            <Monitor className="w-3 h-3" />
            Portfolio Admin Panel — Built with Next.js 16 + TypeScript
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

// ─── Export with Suspense Boundary ───────────────────────────────────────────

export function AdminPanel() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: 'rgba(10, 10, 15, 0.92)' }}>
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[var(--neon-cyan)] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono-custom text-[var(--text-secondary)]">Loading admin panel...</span>
          </div>
        </div>
      }
    >
      <AdminPanelInner />
    </Suspense>
  )
}

export default AdminPanel