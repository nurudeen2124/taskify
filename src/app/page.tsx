'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  LayoutDashboard, CheckSquare, MessageSquare, Activity, Calendar, Settings,
  LogOut, Plus, Search, Edit3, Trash2, Share2, Clock, ChevronRight,
  TrendingUp, Users, MoreHorizontal, Star, Home, Filter, X, Copy, Check,
  FolderOpen, Send, Bell, Pencil, Upload, File, Download, Mail, Eye,
  EyeOff, UserPlus, LogIn, User, Image as ImageIcon, FileText, Paperclip,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from '@/components/ui/tooltip'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Task {
  id: string; title: string; description: string | null; status: string
  priority: string; category: string; progress: number; dueDate: string | null
  createdAt: string; updatedAt: string
}
interface Note {
  id: string; content: string; createdAt: string; updatedAt: string
}
interface FileUpload {
  id: string; name: string; url: string; size: number; type: string; createdAt: string
}
interface SharedMember {
  id: string; email: string; shareLink: string; accepted: boolean; createdAt: string
}
interface AppUser {
  id: string; name: string; email: string
}

// ─── Constants ───────────────────────────────────────────────────────────────
const AVATAR_COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444']
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard' },
  { icon: CheckSquare, label: 'Tasks', key: 'tasks' },
  { icon: MessageSquare, label: 'Messages', key: 'messages' },
  { icon: Activity, label: 'Activity', key: 'activity' },
  { icon: Calendar, label: 'Calendar', key: 'calendar' },
  { icon: Settings, label: 'Options', key: 'settings' },
]

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' }, { value: 'pending', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' }, { value: 'completed', label: 'Completed' },
]
const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' }, { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' }, { value: 'shopping', label: 'Shopping' },
  { value: 'health', label: 'Health' },
]
const PRIORITY_OPTIONS = [
  { value: 'all', label: 'All Priorities' }, { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatTimeAgo(dateStr: string) {
  try {
    const d = new Date(dateStr); const now = new Date()
    const diff = now.getTime() - d.getTime(); const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return 'Just now'; if (minutes < 60) return `${minutes}min ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`; return `${Math.floor(hours / 24)}d ago`
  } catch { return '' }
}
function formatDate(dateStr: string | null) {
  if (!dateStr) return 'No date'
  try { return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }
  catch { return 'Invalid date' }
}
function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`; if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}
function getFileIcon(type: string) {
  if (type.startsWith('image/')) return ImageIcon; if (type.includes('pdf')) return FileText
  if (type.includes('sheet') || type.includes('excel')) return FileText
  return File
}
function getTodayString() {
  return new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
}
function getCategoryColor(c: string) {
  const m: Record<string, string> = { work: 'bg-blue-500/20 text-blue-400 border-blue-500/30', personal: 'bg-purple-500/20 text-purple-400 border-purple-500/30', shopping: 'bg-amber-500/20 text-amber-400 border-amber-500/30', health: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' }
  return m[c] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
}
function getPriorityDot(p: string) {
  const m: Record<string, string> = { high: 'bg-red-400', medium: 'bg-amber-400', low: 'bg-emerald-400' }
  return m[p] || 'bg-gray-400'
}
function getProgressColor(p: number) {
  if (p >= 75) return 'from-emerald-400 to-emerald-500'; if (p >= 40) return 'from-blue-400 to-blue-500'
  if (p >= 10) return 'from-amber-400 to-amber-500'; return 'from-red-400 to-red-500'
}
function getStatusBadge(s: string) {
  const m: Record<string, string> = { pending: 'bg-amber-500/15 text-amber-400 border-amber-500/20', 'in-progress': 'bg-blue-500/15 text-blue-400 border-blue-500/20', completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' }
  return m[s] || 'bg-gray-500/15 text-gray-400 border-gray-500/20'
}
function getStatusLabel(s: string) {
  const m: Record<string, string> = { pending: 'To Do', 'in-progress': 'In Progress', completed: 'Done' }
  return m[s] || s
}

// ─── Starry Background ──────────────────────────────────────────────────────
function StarryBackground() {
  const stars = React.useMemo(() =>
    Array.from({ length: 100 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.3, opacity: Math.random() * 0.7 + 0.1, delay: Math.random() * 5,
    })), [])
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#0c1225] to-[#1a0a2e]" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[100px]" />
      {stars.map((s) => (
        <motion.div key={s.id} className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          animate={{ opacity: [s.opacity * 0.2, s.opacity, s.opacity * 0.2] }}
          transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }} />
      ))}
    </div>
  )
}

// ─── Auth Screen ─────────────────────────────────────────────────────────────
function AuthScreen({ onAuth }: { onAuth: (user: AppUser) => void }) {
  const [isLogin, setIsLogin] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [form, setForm] = React.useState({ name: '', email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isLogin) {
        const res = await fetch('/api/auth/login', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password }),
        })
        if (res.ok) {
          const user = await res.json()
          onAuth({ id: user.id, name: user.name, email: user.email })
          toast.success(`Welcome back, ${user.name}!`)
        } else {
          const data = await res.json()
          toast.error(data.error || 'Invalid email or password')
        }
      } else {
        if (!form.name.trim()) { toast.error('Name is required'); setLoading(false); return }
        if (form.password.length < 4) { toast.error('Password must be at least 4 characters'); setLoading(false); return }
        const res = await fetch('/api/auth/register', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
        })
        if (res.ok) {
          toast.success('Account created! Please sign in.')
          setIsLogin(true)
          setForm({ ...form, name: '' })
        } else {
          const data = await res.json()
          toast.error(data.error || 'Registration failed')
        }
      }
    } catch { toast.error('Something went wrong') }
    finally { setLoading(false) }
  }

  // Demo login shortcut
  const demoLogin = async () => {
    setLoading(true)
    try {
      // Create demo user if not exists
      await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Demo User', email: 'demo@taskify.com', password: 'demo1234' }),
      })
      // Login
      const res = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'demo@taskify.com', password: 'demo1234' }),
      })
      if (res.ok) {
        const user = await res.json()
        onAuth({ id: user.id, name: user.name, email: user.email })
        toast.success('Welcome to Taskify Demo!')
      } else {
        toast.error('Demo login failed')
      }
    } catch { toast.error('Demo login failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 relative">
      <StarryBackground />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/20">
            <Star className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Taskify</h1>
          <p className="text-gray-400 mt-1 text-sm">Smart Task Management</p>
        </div>

        <Card className="bg-[#0B1120]/90 backdrop-blur-xl border-white/10 shadow-2xl">
          <div className="p-6">
            <div className="flex bg-white/5 rounded-xl p-1 mb-6">
              <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${isLogin ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                <LogIn className="w-4 h-4 inline mr-1.5" />Sign In
              </button>
              <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${!isLogin ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                <UserPlus className="w-4 h-4 inline mr-1.5" />Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label className="text-gray-300 text-xs">Full Name</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe"
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50" />
                  </div>
                </div>
              )}
              <div>
                <Label className="text-gray-300 text-xs">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50" required />
                </div>
              </div>
              <div>
                <Label className="text-gray-300 text-xs">Password</Label>
                <div className="relative mt-1">
                  <Input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter password"
                    className="pl-4 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={loading}
                className={`w-full text-white font-medium ${isLogin ? 'bg-blue-500 hover:bg-blue-600' : 'bg-purple-500 hover:bg-purple-600'}`}>
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="relative my-5">
              <Separator className="bg-white/10" />
              <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0B1120] px-3 text-xs text-gray-500">or</span>
            </div>

            <Button onClick={demoLogin} disabled={loading} variant="outline"
              className="w-full border-white/10 text-gray-300 hover:text-white hover:bg-white/5">
              <Star className="w-4 h-4 mr-2 text-amber-400" />Try Demo Account
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

// ─── Main Page Component ─────────────────────────────────────────────────────
export default function TaskifyDashboard() {
  const [mounted, setMounted] = React.useState(false)
  const [currentUser, setCurrentUser] = React.useState<AppUser | null>(null)
  const [activeNav, setActiveNav] = React.useState('dashboard')
  const [tasks, setTasks] = React.useState<Task[]>([])
  const [notes, setNotes] = React.useState<Note[]>([])
  const [files, setFiles] = React.useState<FileUpload[]>([])
  const [shares, setShares] = React.useState<SharedMember[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [categoryFilter, setCategoryFilter] = React.useState('all')
  const [priorityFilter, setPriorityFilter] = React.useState('all')
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)

  // Dialog states
  const [showNewTask, setShowNewTask] = React.useState(false)
  const [showEditTask, setShowEditTask] = React.useState(false)
  const [showShare, setShowShare] = React.useState(false)
  const [showNewNote, setShowNewNote] = React.useState(false)
  const [showUpload, setShowUpload] = React.useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false)
  const [editingTask, setEditingTask] = React.useState<Task | null>(null)
  const [editingNote, setEditingNote] = React.useState<Note | null>(null)

  // Share states
  const [shareEmail, setShareEmail] = React.useState('')
  const [shareLink, setShareLink] = React.useState('')
  const [copied, setCopied] = React.useState(false)

  // Form states
  const [taskForm, setTaskForm] = React.useState({ title: '', description: '', status: 'pending', priority: 'medium', category: 'personal', progress: 0, dueDate: '' })
  const [noteContent, setNoteContent] = React.useState('')
  const [uploading, setUploading] = React.useState(false)

  // Mobile
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // ─── Data Fetching ──────────────────────────────────────────────────────
  const fetchTasks = React.useCallback(async () => {
    try { const r = await fetch('/api/tasks'); if (r.ok) setTasks(await r.json()) }
    catch { toast.error('Failed to fetch tasks') }
  }, [])
  const fetchNotes = React.useCallback(async () => {
    try { const r = await fetch('/api/notes'); if (r.ok) setNotes(await r.json()) }
    catch { toast.error('Failed to fetch notes') }
  }, [])
  const fetchFiles = React.useCallback(async () => {
    try { const r = await fetch('/api/files'); if (r.ok) setFiles(await r.json()) }
    catch { toast.error('Failed to fetch files') }
  }, [])
  const fetchShares = React.useCallback(async () => {
    try { const r = await fetch('/api/share'); if (r.ok) setShares(await r.json()) }
    catch { /* shares not critical */ }
  }, [])

  React.useEffect(() => {
    if (!currentUser) return
    setLoading(true)
    Promise.all([fetchTasks(), fetchNotes(), fetchFiles(), fetchShares()]).finally(() => setLoading(false))
  }, [currentUser, fetchTasks, fetchNotes, fetchFiles, fetchShares])

  // ─── Task CRUD ──────────────────────────────────────────────────────────
  const createTask = async () => {
    if (!taskForm.title.trim()) { toast.error('Title is required'); return }
    try {
      const r = await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(taskForm) })
      if (r.ok) { toast.success('Task created'); setShowNewTask(false); resetTaskForm(); fetchTasks() }
      else { const d = await r.json(); toast.error(d.error || 'Failed') }
    } catch { toast.error('Failed to create task') }
  }
  const updateTask = async () => {
    if (!editingTask || !taskForm.title.trim()) { toast.error('Title is required'); return }
    try {
      const r = await fetch(`/api/tasks/${editingTask.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(taskForm) })
      if (r.ok) { toast.success('Task updated'); setShowEditTask(false); setEditingTask(null); resetTaskForm(); fetchTasks() }
      else { const d = await r.json(); toast.error(d.error || 'Failed') }
    } catch { toast.error('Failed to update task') }
  }
  const deleteTask = async (id: string) => {
    try { const r = await fetch(`/api/tasks/${id}`, { method: 'DELETE' }); if (r.ok) { toast.success('Task deleted'); fetchTasks() } }
    catch { toast.error('Failed to delete task') }
  }
  const toggleTaskComplete = async (task: Task) => {
    const ns = task.status === 'completed' ? 'pending' : 'completed'
    const np = ns === 'completed' ? 100 : task.progress === 100 ? 50 : task.progress
    try { const r = await fetch(`/api/tasks/${task.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: ns, progress: np }) }); if (r.ok) fetchTasks() }
    catch { toast.error('Failed') }
  }

  // ─── Note CRUD ──────────────────────────────────────────────────────────
  const saveNote = async () => {
    if (!noteContent.trim()) { toast.error('Note content required'); return }
    try {
      if (editingNote) {
        const r = await fetch(`/api/notes/${editingNote.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: noteContent }) })
        if (r.ok) { toast.success('Note updated'); fetchNotes() }
      } else {
        const r = await fetch('/api/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: noteContent }) })
        if (r.ok) { toast.success('Note created'); fetchNotes() }
      }
      setShowNewNote(false); setEditingNote(null); setNoteContent('')
    } catch { toast.error('Failed') }
  }
  const deleteNote = async (id: string) => {
    try { const r = await fetch(`/api/notes/${id}`, { method: 'DELETE' }); if (r.ok) { toast.success('Note deleted'); fetchNotes() } }
    catch { toast.error('Failed') }
  }

  // ─── File Upload ────────────────────────────────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    try {
      const formData = new FormData(); formData.append('file', file)
      if (currentUser) formData.append('userId', currentUser.id)
      const r = await fetch('/api/files', { method: 'POST', body: formData })
      if (r.ok) { toast.success(`"${file.name}" uploaded`); fetchFiles(); setShowUpload(false) }
      else { const d = await r.json(); toast.error(d.error || 'Upload failed') }
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }
  const deleteFile = async (id: string) => {
    try { const r = await fetch(`/api/files/${id}`, { method: 'DELETE' }); if (r.ok) { toast.success('File deleted'); fetchFiles() } }
    catch { toast.error('Failed') }
  }

  // ─── Share ──────────────────────────────────────────────────────────────
  const sendShareInvite = async () => {
    if (!shareEmail.trim()) { toast.error('Email is required'); return }
    try {
      const r = await fetch('/api/share', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: shareEmail, userId: currentUser?.id }) })
      if (r.ok) {
        const data = await r.json()
        setShareLink(data.shareLink)
        // Open mailto link for actual email sending
        if (data.mailtoLink) window.open(data.mailtoLink, '_blank')
        toast.success(`Invitation sent to ${shareEmail}`)
        setShareEmail('')
        fetchShares()
      } else { const d = await r.json(); toast.error(d.error || 'Failed') }
    } catch { toast.error('Failed to share') }
  }
  const copyShareLink = async () => {
    if (!shareLink) {
      setShareLink(`${window.location.origin}/shared/${Date.now()}`)
      await new Promise(r => setTimeout(r, 100))
    }
    try { await navigator.clipboard.writeText(shareLink || `${window.location.origin}/shared/${Date.now()}`); setCopied(true); setTimeout(() => setCopied(false), 2000); toast.success('Link copied!') }
    catch { toast.error('Failed to copy') }
  }
  const removeShare = async (id: string) => {
    try { const r = await fetch('/api/share', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); if (r.ok) { toast.success('Share removed'); fetchShares() } }
    catch { toast.error('Failed') }
  }

  // ─── Logout ─────────────────────────────────────────────────────────────
  const handleLogout = () => {
    setCurrentUser(null)
    toast.success('Logged out successfully')
    setShowLogoutConfirm(false)
  }

  // ─── Form Helpers ───────────────────────────────────────────────────────
  const resetTaskForm = () => setTaskForm({ title: '', description: '', status: 'pending', priority: 'medium', category: 'personal', progress: 0, dueDate: '' })
  const openEditTask = (task: Task) => {
    setEditingTask(task); setTaskForm({ title: task.title, description: task.description || '', status: task.status, priority: task.priority, category: task.category, progress: task.progress, dueDate: task.dueDate || '' }); setShowEditTask(true)
  }

  // ─── Filtered Tasks ─────────────────────────────────────────────────────
  const filteredTasks = React.useMemo(() => tasks.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false
    if (searchQuery.trim()) { const q = searchQuery.toLowerCase(); return t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q)) }
    return true
  }), [tasks, statusFilter, categoryFilter, priorityFilter, searchQuery])

  const stats = React.useMemo(() => {
    const total = tasks.length; const completed = tasks.filter(t => t.status === 'completed').length
    const inProgress = tasks.filter(t => t.status === 'in-progress').length
    const avgProgress = total > 0 ? Math.round(tasks.reduce((a, t) => a + t.progress, 0) / total) : 0
    return { total, completed, inProgress, avgProgress }
  }, [tasks])

  if (!mounted) return <div className="min-h-screen bg-[#0F172A] flex items-center justify-center"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" /></div>

  // ─── Not logged in → Auth screen ──────────────────────────────────────
  if (!currentUser) return <AuthScreen onAuth={setCurrentUser} />

  // ─── Quick filters ────────────────────────────────────────────────────
  const quickFilters = [
    { label: 'To Do', key: 'pending', active: statusFilter === 'pending' },
    { label: 'Work', key: 'work', active: categoryFilter === 'work' },
    { label: 'High Priority', key: 'high', active: priorityFilter === 'high' },
  ]
  const toggleQuickFilter = (key: string) => {
    if (['pending', 'in-progress', 'completed'].includes(key)) setStatusFilter(statusFilter === key ? 'all' : key)
    else if (['work', 'personal', 'shopping', 'health'].includes(key)) setCategoryFilter(categoryFilter === key ? 'all' : key)
    else if (['high', 'medium', 'low'].includes(key)) setPriorityFilter(priorityFilter === key ? 'all' : key)
  }

  const userInitials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#0F172A] text-white relative overflow-hidden">
        <StarryBackground />

        {/* ─── Left Sidebar ──────────────────────────────────────────── */}
        {!isMobile && (
          <motion.aside initial={{ x: -200 }} animate={{ x: 0, width: sidebarCollapsed ? 72 : 220 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 z-30 bg-[#0B1120]/90 backdrop-blur-xl border-r border-white/5 flex flex-col">
            <div className="p-5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 text-white" />
              </div>
              {!sidebarCollapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Taskify</motion.span>}
            </div>
            <Separator className="bg-white/5 mx-3" />
            <nav className="flex-1 px-3 py-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <Tooltip key={item.key}><TooltipTrigger asChild>
                  <motion.button whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }} onClick={() => setActiveNav(item.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeNav === item.key ? 'bg-gradient-to-r from-blue-500/15 to-purple-500/10 text-blue-400 shadow-lg shadow-blue-500/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                    <item.icon className="w-5 h-5 shrink-0" />{!sidebarCollapsed && <span>{item.label}</span>}
                  </motion.button>
                </TooltipTrigger>{sidebarCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}</Tooltip>
              ))}
            </nav>
            <Separator className="bg-white/5 mx-3" />
            <div className="p-3 space-y-1">
              {/* User info at bottom */}
              {!sidebarCollapsed && currentUser && (
                <div className="px-3 py-2 mb-2">
                  <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                </div>
              )}
              <Tooltip><TooltipTrigger asChild>
                <motion.button whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }} onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                  <MoreHorizontal className="w-5 h-5 shrink-0" />{!sidebarCollapsed && <span>Collapse</span>}
                </motion.button>
              </TooltipTrigger>{sidebarCollapsed && <TooltipContent side="right">Expand</TooltipContent>}</Tooltip>
              <Tooltip><TooltipTrigger asChild>
                <motion.button whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }} onClick={() => setShowLogoutConfirm(true)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <LogOut className="w-5 h-5 shrink-0" />{!sidebarCollapsed && <span>Logout</span>}
                </motion.button>
              </TooltipTrigger>{sidebarCollapsed && <TooltipContent side="right">Logout</TooltipContent>}</Tooltip>
            </div>
          </motion.aside>
        )}

        {/* ─── Mobile Bottom Nav ──────────────────────────────────────── */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B1120]/95 backdrop-blur-xl border-t border-white/5">
            <nav className="flex justify-around py-2 px-2">
              {NAV_ITEMS.slice(0, 5).map((item) => (
                <button key={item.key} onClick={() => setActiveNav(item.key)}
                  className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all ${activeNav === item.key ? 'text-blue-400' : 'text-gray-500'}`}>
                  <item.icon className="w-5 h-5" /><span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* ─── Main Area ───────────────────────────────────────────────── */}
        <div className={`relative z-10 transition-all duration-300 ${isMobile ? 'ml-0' : sidebarCollapsed ? 'ml-[72px]' : 'ml-[220px]'} ${isMobile ? 'mr-0' : 'mr-[300px]'}`}>
          {/* Header */}
          <header className="sticky top-0 z-20 bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/5">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3">
              <div className="flex items-center gap-2 text-sm">
                <Home className="w-4 h-4 text-gray-400" /><ChevronRight className="w-3 h-3 text-gray-600" />
                <span className="text-gray-400">Dashboard</span><ChevronRight className="w-3 h-3 text-gray-600" />
                <span className="text-gray-300">{getTodayString()}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="sm" onClick={() => { setShareLink(''); setShowShare(true) }} className="text-gray-400 hover:text-white hover:bg-white/5 gap-2">
                    <Users className="w-4 h-4" /><span className="hidden sm:inline">Share</span>
                  </Button>
                </motion.div>
                <div className="relative hidden sm:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-48 lg:w-64 h-9 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50" />
                </div>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5 relative">
                  <Bell className="w-4 h-4" /><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
                </Button>
                <Avatar className="w-8 h-8 border-2 border-purple-500/50 cursor-pointer">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xs font-bold">{userInitials}</AvatarFallback>
                </Avatar>
              </div>
            </div>
            {isMobile && (
              <div className="px-4 pb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full h-9 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50" />
                </div>
              </div>
            )}
          </header>

          {/* Content */}
          <main className="p-4 sm:p-6 pb-24 lg:pb-6">
            {/* Greeting */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Make Things <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Simple!</span></h1>
              <p className="text-gray-400 text-sm">Welcome back, {currentUser.name} — manage and plan your tasks efficiently</p>
            </motion.div>

            {/* Quick Filters + New Task */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {quickFilters.map((f) => (
                <motion.button key={f.key} whileTap={{ scale: 0.95 }} onClick={() => toggleQuickFilter(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${f.active ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'}`}>
                  {f.label}
                </motion.button>
              ))}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px] h-8 bg-white/5 border-white/10 text-white text-xs"><Filter className="w-3 h-3 mr-1 text-gray-400" /><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#1E293B] border-white/10">{STATUS_OPTIONS.map(o => <SelectItem key={o.value} value={o.value} className="text-gray-200">{o.label}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[120px] h-8 bg-white/5 border-white/10 text-white text-xs"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#1E293B] border-white/10">{CATEGORY_OPTIONS.map(o => <SelectItem key={o.value} value={o.value} className="text-gray-200">{o.label}</SelectItem>)}</SelectContent>
              </Select>
              <div className="flex-1" />
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button onClick={() => { resetTaskForm(); setEditingTask(null); setShowNewTask(true) }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white gap-2 shadow-lg shadow-blue-500/20 h-9">
                  <Plus className="w-4 h-4" />New Task
                </Button>
              </motion.div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              {[
                { label: 'Total Tasks', value: stats.total, icon: CheckSquare, color: 'from-blue-500 to-cyan-500' },
                { label: 'Completed', value: stats.completed, icon: Check, color: 'from-emerald-500 to-green-500' },
                { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'from-amber-500 to-orange-500' },
                { label: 'Avg Progress', value: `${stats.avgProgress}%`, icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className="bg-white/[0.03] border-white/5 backdrop-blur-sm hover:bg-white/[0.06] transition-colors group">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-gray-400">{s.label}</p>
                        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity`}>
                          <s.icon className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-white">{s.value}</span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Task List */}
            {loading ? (
              <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-28 rounded-xl bg-white/5 animate-pulse" />)}</div>
            ) : filteredTasks.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4"><CheckSquare className="w-8 h-8 text-gray-600" /></div>
                <p className="text-gray-400 text-lg mb-2">No tasks found</p>
                <p className="text-gray-600 text-sm mb-4">{tasks.length === 0 ? 'Create your first task to get started' : 'Try adjusting your filters'}</p>
                <Button onClick={() => { resetTaskForm(); setEditingTask(null); setShowNewTask(true) }} variant="outline" className="border-white/10 text-gray-300 hover:text-white hover:bg-white/5 gap-2"><Plus className="w-4 h-4" />Create Task</Button>
              </motion.div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {filteredTasks.map((task, index) => (
                    <motion.div key={task.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: index * 0.05 }}>
                      <Card className={`bg-white/[0.03] border-white/5 backdrop-blur-sm hover:bg-white/[0.06] transition-all group cursor-pointer ${task.status === 'completed' ? 'opacity-50' : ''}`}>
                        <div className="p-4 sm:p-5">
                          <div className="flex items-start gap-3">
                            <Checkbox checked={task.status === 'completed'} onCheckedChange={() => toggleTaskComplete(task)}
                              className="mt-1 border-white/20 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h3 className={`font-semibold text-sm sm:text-base ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-white'}`}>{task.title}</h3>
                                <Badge variant="outline" className={`text-[10px] px-2 py-0 ${getCategoryColor(task.category)}`}>{task.category}</Badge>
                                <Badge variant="outline" className={`text-[10px] px-2 py-0 ${getStatusBadge(task.status)}`}>{getStatusLabel(task.status)}</Badge>
                                <span className={`w-2 h-2 rounded-full shrink-0 ${getPriorityDot(task.priority)}`} />
                              </div>
                              {task.description && <p className="text-xs text-gray-500 mb-2 line-clamp-1">{task.description}</p>}
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(task.dueDate)}</span>
                              </div>
                              <div className="flex items-center gap-3 mt-3">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(task.progress)}`} initial={{ width: 0 }} animate={{ width: `${task.progress}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
                                  </div>
                                  <span className="text-xs text-gray-400 font-medium w-8 text-right">{task.progress}%</span>
                                </div>
                                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10" onClick={() => openEditTask(task)}><Edit3 className="w-3.5 h-3.5" /></Button>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-400 hover:bg-red-500/10" onClick={() => deleteTask(task.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10" onClick={() => { setShareLink(''); setShowShare(true) }}><Share2 className="w-3.5 h-3.5" /></Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </main>
        </div>

        {/* ─── Right Sidebar ────────────────────────────────────────── */}
        {!isMobile && (
          <motion.aside initial={{ x: 300 }} animate={{ x: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-30 w-[300px] bg-[#0B1120]/90 backdrop-blur-xl border-l border-white/5">
            <ScrollArea className="h-full">
              <div className="p-5 space-y-5">
                {/* Today Note */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-500/20 flex items-center justify-center"><Pencil className="w-3 h-3 text-blue-400" /></div>Today Note
                    </h3>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10"
                      onClick={() => { setNoteContent(''); setEditingNote(null); setShowNewNote(true) }}><Plus className="w-4 h-4" /></Button>
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {notes.length === 0 ? (
                      <Card className="bg-white/[0.03] border-white/5"><div className="p-4 text-center"><p className="text-xs text-gray-500">No notes yet</p><p className="text-xs text-gray-600 mt-1">Click + to add</p></div></Card>
                    ) : notes.map(note => (
                      <Card key={note.id} className="bg-white/[0.03] border-white/5 group hover:bg-white/[0.06] transition-colors">
                        <div className="p-3">
                          <p className="text-xs text-gray-300 line-clamp-3 mb-2">{note.content}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-gray-500">{formatTimeAgo(note.updatedAt)}</span>
                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10"
                                onClick={() => { setEditingNote(note); setNoteContent(note.content); setShowNewNote(true) }}><Edit3 className="w-3 h-3" /></Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                                onClick={() => deleteNote(note.id)}><Trash2 className="w-3 h-3" /></Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator className="bg-white/5" />

                {/* My Files */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-purple-500/20 flex items-center justify-center"><FolderOpen className="w-3 h-3 text-purple-400" /></div>My Files
                    </h3>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10"
                      onClick={() => setShowUpload(true)}><Plus className="w-4 h-4" /></Button>
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {files.length === 0 ? (
                      <Card className="bg-white/[0.03] border-white/5"><div className="p-4 text-center"><div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3"><FolderOpen className="w-5 h-5 text-gray-500" /></div><p className="text-xs text-gray-500 mb-1">No files uploaded</p><Button variant="outline" size="sm" onClick={() => setShowUpload(true)} className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5 text-xs h-7 mt-2"><Upload className="w-3 h-3 mr-1" />Upload</Button></div></Card>
                    ) : files.map(f => {
                      const FIcon = getFileIcon(f.type)
                      return (
                        <Card key={f.id} className="bg-white/[0.03] border-white/5 group hover:bg-white/[0.06] transition-colors">
                          <div className="p-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0"><FIcon className="w-4 h-4 text-purple-400" /></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-300 truncate">{f.name}</p>
                              <p className="text-[10px] text-gray-500">{formatFileSize(f.size)} · {formatTimeAgo(f.createdAt)}</p>
                            </div>
                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10"
                                asChild><a href={f.url} target="_blank" rel="noopener noreferrer"><Download className="w-3 h-3" /></a></Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                                onClick={() => deleteFile(f.id)}><Trash2 className="w-3 h-3" /></Button>
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </div>

                <Separator className="bg-white/5" />

                {/* Activity */}
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center"><Activity className="w-3 h-3 text-emerald-400" /></div>Activity
                  </h3>
                  <Card className="bg-white/[0.03] border-white/5"><div className="p-4">
                    <div className="flex items-end gap-1 h-16 mb-3">
                      {[40, 65, 30, 80, 55, 70, 45, 90, 60, 35, 75, 50].map((h, i) => (
                        <motion.div key={i} className="flex-1 rounded-t bg-gradient-to-t from-blue-500/60 to-blue-400/30"
                          initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.05, duration: 0.5 }} />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-500">Last 12 days</span>
                  </div></Card>
                </div>

                <Separator className="bg-white/5" />

                {/* Share Tasks */}
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-md bg-pink-500/20 flex items-center justify-center"><Share2 className="w-3 h-3 text-pink-400" /></div>Share Tasks
                  </h3>
                  <Card className="bg-white/[0.03] border-white/5"><div className="p-4">
                    <p className="text-xs text-gray-400 mb-2">Shared with {shares.length} member{shares.length !== 1 ? 's' : ''}</p>
                    {shares.length > 0 && (
                      <div className="flex -space-x-2 mb-3">
                        {shares.slice(0, 4).map((s, i) => (
                          <Avatar key={s.id} className="w-7 h-7 border-2 border-[#0B1120]">
                            <AvatarFallback className="text-[9px] font-bold text-white" style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>{s.email[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    )}
                    <Button onClick={() => { setShareLink(''); setShowShare(true) }}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs h-8">
                      <Share2 className="w-3 h-3 mr-2" />Share Task List
                    </Button>
                  </div></Card>
                </div>
              </div>
            </ScrollArea>
          </motion.aside>
        )}

        {/* ─── Mobile FABs ──────────────────────────────────────────── */}
        {isMobile && (
          <div className="fixed bottom-20 right-4 z-30 flex flex-col gap-2">
            <motion.div whileTap={{ scale: 0.9 }}><Button onClick={() => { setNoteContent(''); setEditingNote(null); setShowNewNote(true) }} size="icon" className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-blue-500/30"><Pencil className="w-5 h-5" /></Button></motion.div>
            <motion.div whileTap={{ scale: 0.9 }}><Button onClick={() => setShowUpload(true)} size="icon" className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30"><Upload className="w-5 h-5" /></Button></motion.div>
            <motion.div whileTap={{ scale: 0.9 }}><Button onClick={() => { setShareLink(''); setShowShare(true) }} size="icon" className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-red-500 shadow-lg shadow-pink-500/30"><Share2 className="w-5 h-5" /></Button></motion.div>
          </div>
        )}

        {/* ─── New/Edit Task Dialog ─────────────────────────────────────── */}
        <Dialog open={showNewTask || showEditTask} onOpenChange={(open) => { if (!open) { setShowNewTask(false); setShowEditTask(false); setEditingTask(null); resetTaskForm() } }}>
          <DialogContent className="bg-[#1E293B] border-white/10 text-white max-w-lg">
            <DialogHeader><DialogTitle className="text-white">{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle><DialogDescription className="text-gray-400">Fill in the details below</DialogDescription></DialogHeader>
            <div className="space-y-4 py-2">
              <div><Label className="text-gray-300 text-xs">Title</Label><Input value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="Task title..." className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50" /></div>
              <div><Label className="text-gray-300 text-xs">Description</Label><Textarea value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} placeholder="Describe the task..." rows={3} className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 resize-none" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-gray-300 text-xs">Status</Label><Select value={taskForm.status} onValueChange={(v) => setTaskForm({ ...taskForm, status: v })}><SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white text-xs"><SelectValue /></SelectTrigger><SelectContent className="bg-[#1E293B] border-white/10"><SelectItem value="pending" className="text-gray-200">To Do</SelectItem><SelectItem value="in-progress" className="text-gray-200">In Progress</SelectItem><SelectItem value="completed" className="text-gray-200">Completed</SelectItem></SelectContent></Select></div>
                <div><Label className="text-gray-300 text-xs">Priority</Label><Select value={taskForm.priority} onValueChange={(v) => setTaskForm({ ...taskForm, priority: v })}><SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white text-xs"><SelectValue /></SelectTrigger><SelectContent className="bg-[#1E293B] border-white/10"><SelectItem value="low" className="text-gray-200">Low</SelectItem><SelectItem value="medium" className="text-gray-200">Medium</SelectItem><SelectItem value="high" className="text-gray-200">High</SelectItem></SelectContent></Select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-gray-300 text-xs">Category</Label><Select value={taskForm.category} onValueChange={(v) => setTaskForm({ ...taskForm, category: v })}><SelectTrigger className="mt-1 bg-white/5 border-white/10 text-white text-xs"><SelectValue /></SelectTrigger><SelectContent className="bg-[#1E293B] border-white/10"><SelectItem value="personal" className="text-gray-200">Personal</SelectItem><SelectItem value="work" className="text-gray-200">Work</SelectItem><SelectItem value="shopping" className="text-gray-200">Shopping</SelectItem><SelectItem value="health" className="text-gray-200">Health</SelectItem></SelectContent></Select></div>
                <div><Label className="text-gray-300 text-xs">Due Date</Label><Input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} className="mt-1 bg-white/5 border-white/10 text-white text-xs focus:border-blue-500/50" /></div>
              </div>
              <div><Label className="text-gray-300 text-xs">Progress: {taskForm.progress}%</Label><input type="range" min="0" max="100" step="5" value={taskForm.progress} onChange={(e) => setTaskForm({ ...taskForm, progress: Number(e.target.value) })} className="mt-1 w-full accent-blue-500" /></div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => { setShowNewTask(false); setShowEditTask(false); setEditingTask(null); resetTaskForm() }} className="text-gray-400 hover:text-white hover:bg-white/5">Cancel</Button>
              <Button onClick={editingTask ? updateTask : createTask} className="bg-blue-500 hover:bg-blue-600 text-white">{editingTask ? 'Update Task' : 'Create Task'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ─── Note Dialog ──────────────────────────────────────────── */}
        <Dialog open={showNewNote} onOpenChange={(open) => { if (!open) { setShowNewNote(false); setEditingNote(null); setNoteContent('') } }}>
          <DialogContent className="bg-[#1E293B] border-white/10 text-white max-w-lg">
            <DialogHeader><DialogTitle className="text-white flex items-center gap-2"><Pencil className="w-4 h-4 text-blue-400" />{editingNote ? 'Edit Note' : 'New Note'}</DialogTitle><DialogDescription className="text-gray-400">Write down your thoughts</DialogDescription></DialogHeader>
            <Textarea value={noteContent} onChange={(e) => setNoteContent(e.target.value)} placeholder="Write your note..." rows={5} className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 resize-none" autoFocus />
            <DialogFooter>
              <Button variant="ghost" onClick={() => { setShowNewNote(false); setEditingNote(null); setNoteContent('') }} className="text-gray-400 hover:text-white hover:bg-white/5">Cancel</Button>
              <Button onClick={saveNote} className="bg-blue-500 hover:bg-blue-600 text-white">{editingNote ? 'Save' : 'Add Note'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ─── File Upload Dialog ───────────────────────────────────── */}
        <Dialog open={showUpload} onOpenChange={setShowUpload}>
          <DialogContent className="bg-[#1E293B] border-white/10 text-white max-w-md">
            <DialogHeader><DialogTitle className="text-white flex items-center gap-2"><Upload className="w-5 h-5 text-purple-400" />Upload File</DialogTitle><DialogDescription className="text-gray-400">Upload documents, images, or other files (max 10MB)</DialogDescription></DialogHeader>
            <div className="space-y-4 py-2">
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:bg-white/5 hover:border-white/20 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {uploading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mb-3" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-500 mb-3" />
                      <p className="text-sm text-gray-400 mb-1">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PDF, Images, Documents, Spreadsheets</p>
                    </>
                  )}
                </div>
                <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.txt,.csv,.json,.doc,.docx,.xls,.xlsx" />
              </label>
              {files.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {files.map(f => (
                    <div key={f.id} className="flex items-center gap-3 bg-white/5 rounded-lg p-2">
                      {f.type.startsWith('image/') ? <ImageIcon className="w-5 h-5 text-purple-400 shrink-0" /> : <Paperclip className="w-5 h-5 text-gray-400 shrink-0" />}
                      <div className="flex-1 min-w-0"><p className="text-xs text-gray-300 truncate">{f.name}</p><p className="text-[10px] text-gray-500">{formatFileSize(f.size)}</p></div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-red-400" onClick={() => deleteFile(f.id)}><X className="w-3 h-3" /></Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <DialogFooter><Button variant="ghost" onClick={() => setShowUpload(false)} className="text-gray-400 hover:text-white hover:bg-white/5">Close</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ─── Share Dialog ──────────────────────────────────────────── */}
        <Dialog open={showShare} onOpenChange={setShowShare}>
          <DialogContent className="bg-[#1E293B] border-white/10 text-white max-w-md">
            <DialogHeader><DialogTitle className="text-white flex items-center gap-2"><Share2 className="w-5 h-5 text-purple-400" />Share Task List</DialogTitle><DialogDescription className="text-gray-400">Share your tasks with team members</DialogDescription></DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label className="text-gray-300 text-xs mb-1.5 block">Invite by email</Label>
                <div className="flex gap-2">
                  <Input value={shareEmail} onChange={(e) => setShareEmail(e.target.value)} placeholder="colleague@example.com" onKeyDown={(e) => e.key === 'Enter' && sendShareInvite()}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50" />
                  <Button onClick={sendShareInvite} className="bg-purple-500 hover:bg-purple-600 text-white shrink-0" size="icon"><Send className="w-4 h-4" /></Button>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">An email will be opened with the share link</p>
              </div>
              <div>
                <Label className="text-gray-300 text-xs mb-1.5 block">Or share via link</Label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-xs text-gray-400 truncate">
                    {shareLink || `${window?.location?.origin || 'http://localhost:3000'}/shared/${Date.now()}`}
                  </div>
                  <Button onClick={copyShareLink} className="shrink-0 bg-blue-500 hover:bg-blue-600 text-white" size="icon">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              {shares.length > 0 && (
                <div className="bg-white/[0.03] rounded-lg p-3 border border-white/5">
                  <p className="text-xs font-medium text-gray-300 mb-2">Shared with ({shares.length})</p>
                  <div className="space-y-2">
                    {shares.map(s => (
                      <div key={s.id} className="flex items-center gap-2">
                        <Avatar className="w-6 h-6"><AvatarFallback className="text-[9px] font-bold text-white" style={{ backgroundColor: AVATAR_COLORS[shares.indexOf(s) % AVATAR_COLORS.length] }}>{s.email[0].toUpperCase()}</AvatarFallback></Avatar>
                        <span className="text-xs text-gray-400 flex-1 truncate">{s.email}</span>
                        <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${s.accepted ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/15 text-amber-400 border-amber-500/20'}`}>{s.accepted ? 'Accepted' : 'Pending'}</Badge>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-500 hover:text-red-400" onClick={() => removeShare(s.id)}><X className="w-3 h-3" /></Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setShowShare(false)} className="text-gray-400 hover:text-white hover:bg-white/5">Close</Button>
              <Button onClick={() => { sendShareInvite(); setShowShare(false) }} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"><Send className="w-4 h-4 mr-2" />Share</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ─── Logout Confirm ─────────────────────────────────────── */}
        <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
          <DialogContent className="bg-[#1E293B] border-white/10 text-white max-w-sm">
            <DialogHeader><DialogTitle className="text-white">Sign Out</DialogTitle><DialogDescription className="text-gray-400">Are you sure you want to sign out of Taskify?</DialogDescription></DialogHeader>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setShowLogoutConfirm(false)} className="text-gray-400 hover:text-white hover:bg-white/5">Cancel</Button>
              <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white"><LogOut className="w-4 h-4 mr-2" />Sign Out</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
