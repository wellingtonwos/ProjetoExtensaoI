import { useState, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { Sidebar } from '../components/Sidebar'
import api from '../services/apiClient'
import { getAllClients, updateClient, getClientSales, getClientSpending, getSale, deleteClient } from '../services/salesApi'
import { toast } from 'react-toastify'
import { toTitleCase, titleCaseHandler } from '../services/textUtils'
import PaginationBar from '../components/PaginationBar'

// ── Styles ─────────────────────────────────────────────────────────────────────

const Wrapper = styled.div`
  display: flex; min-height: 100vh;
  background: var(--bg); font-family: 'Work Sans', sans-serif;
`
const Main = styled.main`
  flex: 1; display: flex; flex-direction: column; min-width: 0; overflow-x: hidden;
`
const Header = styled.div`
  background: var(--sidebar-bg); padding: 16px 28px;
  display: flex; align-items: center; gap: 16px;
`
const PageTitle = styled.h1`
  font-family: 'Epilogue', sans-serif; font-size: 18px; font-weight: 900;
  color: #fff; text-transform: uppercase; letter-spacing: 0.05em; margin: 0;
`
const Content = styled.div`
  padding: 24px 28px; display: flex; flex-direction: column; gap: 20px; flex: 1;
`

// Tabs
const Tabs = styled.div`
  display: flex; gap: 4px; background: #fff;
  border-radius: var(--radius-lg); padding: 4px;
  border: 1px solid var(--border); flex-wrap: wrap;
`
const Tab = styled.button`
  display: flex; align-items: center; gap: 6px;
  padding: 8px 16px; border: none; border-radius: var(--radius);
  font-size: 12px; font-weight: 700; cursor: pointer;
  font-family: 'Work Sans', sans-serif; white-space: nowrap;
  background: ${p => p.$a ? 'var(--brand)' : 'transparent'};
  color: ${p => p.$a ? '#fff' : 'var(--text-sub)'};
  transition: all 0.15s;
  &:hover { background: ${p => p.$a ? 'var(--brand-hover)' : 'var(--bg)'}; color: ${p => p.$a ? '#fff' : 'var(--text)'}; }
  span { font-size: 15px; }
`

// Filter bar
const FilterBar = styled.div`
  display: flex; gap: 10px; align-items: flex-end; flex-wrap: wrap;
  background: #fff; border-radius: var(--radius-lg); padding: 16px 20px;
  border: 1px solid var(--border);
`
const FField = styled.div`display: flex; flex-direction: column; gap: 5px;`
const FLabel = styled.label`
  font-size: 9px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.15em; color: var(--muted);
`
const FInput = styled.input`
  padding: 8px 12px; border: 1px solid var(--border); border-radius: var(--radius);
  font-size: 13px; font-family: 'Work Sans', sans-serif; background: var(--bg);
  &:focus { outline: none; border-color: var(--brand); background: #fff; }
`
const FSelect = styled.select`
  padding: 8px 12px; border: 1px solid var(--border); border-radius: var(--radius);
  font-size: 13px; font-family: 'Work Sans', sans-serif; background: var(--bg);
`
const GenBtn = styled.button`
  padding: 9px 20px; background: var(--brand); color: #fff;
  border: none; border-radius: var(--radius); font-family: 'Epilogue', sans-serif;
  font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em;
  cursor: pointer; white-space: nowrap;
  &:hover { background: var(--brand-hover); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`

// Summary cards
const SumGrid = styled.div`
  display: grid; gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
`
const SumCard = styled.div`
  background: #fff; border-radius: var(--radius-lg); padding: 16px 18px;
  border-left: 3px solid ${p => p.$c || 'var(--brand)'};
  border: 1px solid var(--border); border-left-width: 3px;
  p.lbl { font-size: 9px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--muted); margin: 0 0 6px; }
  p.val { font-family: 'Epilogue', sans-serif; font-size: 22px; font-weight: 900; color: var(--text); margin: 0; white-space: normal; word-break: normal; overflow-wrap: break-word; display: block; line-height: 1.05; }
  p.sub { font-size: 10px; color: var(--muted); margin: 3px 0 0; white-space: normal; word-break: normal; overflow-wrap: normal; }
`

// Table
const TableWrap = styled.div`
  background: #fff; border-radius: var(--radius-lg); border: 1px solid var(--border); overflow: hidden;
`
const TableHead = styled.div`
  padding: 14px 20px; border-bottom: 1px solid var(--border);
  display: flex; justify-content: space-between; align-items: center;
  h3 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text); margin: 0; }
  span.cnt { font-size: 11px; color: var(--muted); }
`
const Table = styled.table`
  width: 100%; border-collapse: collapse; font-size: 12px;
  th { text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em;
       color: var(--muted); padding: 10px 16px; border-bottom: 1px solid var(--border); font-weight: 700; }
  td { padding: 10px 16px; border-bottom: 1px solid #f9f8f8; color: var(--text); }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #fafaf9; }
`
const Empty = styled.div`
  padding: 40px; text-align: center; color: var(--muted);
  span { display: block; font-size: 36px; margin-bottom: 8px; }
`
const Loading = styled.div`
  padding: 32px; text-align: center; color: var(--muted); font-size: 13px;
`
const Badge = styled.span`
  display: inline-flex; align-items:center; padding: 2px 8px; border-radius: 999px; font-size: 10px; font-weight: 700;
  white-space: nowrap; overflow: visible; word-break: normal;
  background: ${p => p.$c || '#f0f0f0'}; color: ${p => p.$t || '#374151'};
`
const AlertBadge = styled.span`
  display: inline-flex; align-items: center; gap: 3px;
  padding: 2px 8px; border-radius: 999px; font-size: 10px; font-weight: 700;
  background: ${p => p.$d <= 3 ? '#fef2f2' : p.$d <= 7 ? '#fffbeb' : '#f0fdf4'};
  color: ${p => p.$d <= 3 ? '#b91c1c' : p.$d <= 7 ? '#b45309' : '#15803d'};
`

// ── Helpers ────────────────────────────────────────────────────────────────────

const fmt  = v  => new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(v||0)
const pct  = v  => `${Number(v||0).toFixed(1)}%`
const today = () => new Date().toISOString().slice(0,10)
const daysAgo = n => { const d = new Date(); d.setDate(d.getDate()-n); return d.toISOString().slice(0,10) }
const firstOfMonth = () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0,10) }
const fmtDate = d => {
  if (!d) return '—'
  if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const [y, m, day] = d.split('-')
    return `${day}/${m}/${y}`
  }
  const date = new Date(d)
  return isNaN(date) ? '—' : date.toLocaleDateString('pt-BR')
}
const daysUntil = dateStr => {
  if (!dateStr) return 999
  const [y, m, d] = dateStr.split('-').map(Number)
  const exp   = new Date(y, m - 1, d)
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return Math.round((exp - today) / 86400000)
}

const PAY_COLORS = { PIX:{c:'#f0fdf4',t:'#15803d'}, DINHEIRO:{c:'#fffbeb',t:'#b45309'}, CREDITO:{c:'#eff6ff',t:'#1d4ed8'}, DEBITO:{c:'#faf5ff',t:'#7c3aed'} }

const PAY_LABELS = { PIX:'PIX', DINHEIRO:'Dinheiro', CREDITO:'Crédito', DEBITO:'Débito' }
const PAYMENT_ORDER = ['PIX','DINHEIRO','CREDITO','DEBITO']

const normalizePaymentKeyFromSale = (s) => {
  if (s?.payments && s.payments.length > 0) {
    const methods = Array.from(new Set(s.payments.map(p => String(p.paymentMethod || '').trim().toUpperCase()).filter(Boolean)))
    methods.sort((a,b) => {
      const ia = PAYMENT_ORDER.indexOf(a), ib = PAYMENT_ORDER.indexOf(b)
      if (ia === -1 && ib === -1) return a.localeCompare(b)
      if (ia === -1) return 1
      if (ib === -1) return -1
      return ia - ib
    })
    return methods.join(' + ')
  }
  return String(s.paymentMethod || '').trim().toUpperCase()
}

const TABS = [
  { id:'vendas',   label:'Vendas',          icon:'point_of_sale' },
  { id:'estoque',  label:'Estoque Atual',   icon:'inventory_2' },
  { id:'validade', label:'Validade',        icon:'event_busy' },
  { id:'descartes',label:'Descartes/Perdas',icon:'delete_forever' },
  { id:'compras',  label:'Compras',         icon:'shopping_cart' },
  { id:'cmv',      label:'CMV & Margem',    icon:'trending_up' },
  { id:'clientes', label:'Clientes',        icon:'group' },
]

// ── Client extra styled ─────────────────────────────────────────────────────────
const ClientCard = styled.div`
  background:#fff; border-radius:var(--radius-lg); border:1px solid var(--border);
  padding:18px 20px; cursor:pointer; transition:box-shadow 0.15s;
  &:hover{box-shadow:0 4px 12px rgba(0,0,0,0.08);}
  .top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;}
  .avatar{width:40px;height:40px;border-radius:50%;background:var(--brand);color:#fff;
    display:flex;align-items:center;justify-content:center;font-family:'Epilogue',sans-serif;font-weight:900;font-size:15px;}
  .name{font-weight:700;font-size:14px;color:var(--text);}
  .info{font-size:11px;color:var(--muted);margin-top:2px;}
`
const ClientsGrid = styled.div`
  display:grid;gap:12px;
  grid-template-columns:repeat(auto-fill,minmax(240px,1fr));
`
const EditModalOverlay = styled.div`
  position:fixed;inset:0;background:rgba(0,0,0,0.45);
  display:flex;align-items:center;justify-content:center;z-index:200;
`
const EditModal = styled.div`
  background:#fff;border-radius:16px;width:480px;max-width:calc(100%-32px);
  max-height:90vh;overflow-y:auto;box-shadow:0 24px 48px rgba(0,0,0,0.18);
`
const EMHead = styled.div`
  padding:18px 22px 14px;border-bottom:1px solid var(--border);
  display:flex;justify-content:space-between;align-items:center;
  h2{font-family:'Epilogue',sans-serif;font-size:17px;font-weight:900;color:var(--text);margin:0;}
  button{background:none;border:none;cursor:pointer;color:var(--muted);display:flex;align-items:center;
    &:hover{color:var(--danger);}span{font-size:20px;}}
`
const EMBody = styled.div`padding:18px 22px;`
const EMField = styled.div`
  margin-bottom:14px;
  label{display:block;font-size:10px;font-weight:700;text-transform:uppercase;
    letter-spacing:0.12em;color:var(--muted);margin-bottom:5px;}
  input{width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--radius);
    font-size:13px;font-family:'Work Sans',sans-serif;box-sizing:border-box;
    &:focus{outline:none;border-color:var(--brand);}
  }
  small{font-size:10px;color:var(--muted);margin-top:3px;display:block;}
`
const EMActions = styled.div`display:flex;gap:8px;padding:0 22px 18px;`
const EMCancel = styled.button`
  flex:1;padding:10px;border:1px solid var(--border);border-radius:var(--radius);
  background:#fff;cursor:pointer;font-size:13px;color:var(--text-sub);
  &:hover{background:var(--bg);}
`
const EMDelete = styled.button`
  flex:1;padding:10px;border:none;border-radius:var(--radius);
  background:var(--danger);color:#fff;cursor:pointer;font-size:13px;
  &:hover{background:#b91c1c;}
  &:disabled{opacity:0.6;cursor:not-allowed;}
`

const EMSave = styled.button`
  flex:2;padding:10px;border:none;border-radius:var(--radius);
  background:var(--brand);color:#fff;cursor:pointer;
  font-family:'Epilogue',sans-serif;font-weight:900;font-size:13px;text-transform:uppercase;
  &:hover{background:var(--brand-hover);}
  &:disabled{opacity:0.5;cursor:not-allowed;}
`
const HistoryModal = styled(EditModal)`width:620px;`
const HRow = styled.div`
  padding:12px 16px;border-bottom:1px solid var(--border);
  &:last-child{border-bottom:none;}
  .top{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;}
  .id{font-weight:700;font-size:13px;color:var(--text);}
  .date{font-size:11px;color:var(--muted);}
  .total{font-family:'Epilogue',sans-serif;font-weight:900;font-size:15px;color:var(--brand);}
  .items{font-size:11px;color:var(--text-sub);margin-top:4px;}
`

// ── Component ──────────────────────────────────────────────────────────────────

export const ReportsView = ({ navigate, initialTab }) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'vendas')
  useEffect(() => { if (initialTab) setActiveTab(initialTab) }, [initialTab])
  const [tablePage, setTablePage] = useState(1)
  const PAGE_SIZE = 10

  // Filters
  const [startDate, setStartDate] = useState(firstOfMonth())
  const [endDate,   setEndDate]   = useState(today())
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [expiryDays, setExpiryDays] = useState('30')

  // Data
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  // Clients tab state
  const [clients, setClients]           = useState([])
  const [clientsLoading, setClientsLoading] = useState(false)
  const [clientSearch, setClientSearch] = useState('')
  const [editClient, setEditClient]     = useState(null)   // null = closed
  const [editForm, setEditForm]         = useState({})
  const [editSaving, setEditSaving]     = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [historyClient, setHistoryClient] = useState(null) // null = closed
  const [historyData, setHistoryData]   = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  // Client spending view
  const [clientsSpend, setClientsSpend] = useState([])
  const [clientsSpendLoading, setClientsSpendLoading] = useState(false)
  const [showClientSpend, setShowClientSpend] = useState(false)
  // Sale detail modal
  const [saleDetail, setSaleDetail] = useState(null) // null = closed
  const [saleLoading, setSaleLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true); setError(''); setData(null)
    try {
      if (activeTab === 'vendas' || activeTab === 'cmv') {
        const r = await api.get(`/sales?startDate=${startDate}&endDate=${endDate}`)
        setData(r.data || [])
      } else if (activeTab === 'estoque' || activeTab === 'validade') {
        const r = await api.get('/products/purchases')
        setData(r.data || [])
      } else if (activeTab === 'descartes') {
        const r = await api.get('/discards')
        setData(r.data || [])
      } else if (activeTab === 'compras') {
        const r = await api.get('/purchases?page=0')
        setData(r.data?.content || r.data || [])
      }
    } catch { setError('Erro ao buscar dados. Verifique se o backend está rodando.') }
    setLoading(false)
  }, [activeTab, startDate, endDate])

  // Reseta página ao trocar aba ou quando novos dados chegam
  useEffect(() => { setTablePage(1) }, [activeTab, data])

  // Auto-load estoque, validade, descartes on tab change
  useEffect(() => {
    if (['estoque','validade','descartes','compras'].includes(activeTab)) load()
    else if (activeTab !== 'clientes') setData(null)
  }, [activeTab]) // eslint-disable-line

  // Load clients when tab selected
  useEffect(() => {
    if (activeTab !== 'clientes') return
    setClientsLoading(true)
    getAllClients()
      .then(setClients)
      .catch(() => toast.error('Erro ao carregar clientes.'))
      .finally(() => setClientsLoading(false))
  }, [activeTab])

  // Client handlers
  const openEdit = (c) => { setEditClient(c); setEditForm({ nickname: c.nickname, telefone: c.telefone||'', aniversario: c.aniversario||'' }) }

  const handleEditNicknameChange = titleCaseHandler((val) => setEditForm(f => ({ ...f, nickname: val })))

  const formatPhoneDisplay = (raw) => {
    if (!raw) return ''
    const digits = String(raw).replace(/\D/g,'')
    if (digits.length <= 2) return `(${digits}`
    if (digits.length <= 6) return `(${digits.slice(0,2)}) ${digits.slice(2)}`
    if (digits.length <= 10) return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`
    return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7,11)}`
  }

  const phoneIsValid = (raw) => {
    if (!raw) return true
    const d = String(raw).replace(/\D/g,'')
    return d.length === 10 || d.length === 11
  }

  const handleEditPhoneChange = (e) => {
    const digits = String(e.target.value || '').replace(/\D/g,'')
    setEditForm(f => ({ ...f, telefone: digits }))
  }

  const isBirthdayUnder18 = (rawDate) => {
    if (!rawDate) return false
    try {
      const parts = rawDate.split('-')
      if (parts.length < 3) return false
      const y = Number(parts[0]), m = Number(parts[1]) - 1, d = Number(parts[2])
      const b = new Date(y,m,d)
      const today = new Date()
      let age = today.getFullYear() - b.getFullYear()
      const mDiff = today.getMonth() - b.getMonth()
      if (mDiff < 0 || (mDiff === 0 && today.getDate() < b.getDate())) age--
      return age < 18
    } catch { return false }
  }
  const handleEditSave = async (e) => {
    e.preventDefault()
    if (!editForm.nickname?.trim()) return
    if (editForm.telefone && !phoneIsValid(editForm.telefone)) { toast.error('Telefone inválido'); return }
    if (isBirthdayUnder18(editForm.aniversario)) { toast.error('Cliente deve ser maior de 18 anos'); return }
    setEditSaving(true)
    try {
      await updateClient(editClient.id, { nickname: editForm.nickname.trim(), telefone: editForm.telefone||null, aniversario: editForm.aniversario||null })
      toast.success('Cliente atualizado!')
      setClients(prev => prev.map(c => c.id === editClient.id ? { ...c, ...editForm, nickname: editForm.nickname.trim() } : c))
      setEditClient(null)
    } catch { toast.error('Erro ao atualizar cliente.') }
    finally { setEditSaving(false) }
  }

  const handleDeleteClient = async () => {
    if (!editClient) return
    const ok = window.confirm('Tem certeza que deseja apagar (anonymizar) este cliente? Isso não pode ser desfeito.')
    if (!ok) return
    setDeleteLoading(true)
    try {
      await deleteClient(editClient.id)
      toast.success('Cliente apagado/anonymizado.')
      setClients(prev => prev.filter(c => c.id !== editClient.id))
      setEditClient(null)
    } catch (e) {
      toast.error('Erro ao apagar cliente.')
    } finally {
      setDeleteLoading(false)
    }
  }
  const openHistory = async (c) => {
    setHistoryClient(c); setHistoryLoading(true); setHistoryData([])
    try {
      const raw = await getClientSales(c.id)
      const processed = (raw || []).map(s => {
        const dt = parseSaleDate(s)
        return { ...s, saleDateObj: dt, saleDateDisplay: formatDateTime(dt) }
      })
      setHistoryData(processed)
    } catch { toast.error('Erro ao carregar histórico.') }
    finally { setHistoryLoading(false) }
  }

  const openSale = async (id) => {
    setSaleDetail(null); setSaleLoading(true)
    try {
      const raw = await getSale(id)
      const dt = parseSaleDate(raw)

      // Build payment summary (sum amounts per method when available)
      let paymentSummary = []
      try {
        const payments = raw?.payments || []
        const map = {}
        payments.forEach(p => {
          const key = String(p.paymentMethod || p.method || p.type || '').trim().toUpperCase() || 'OUTRO'
          const amt = Number(p.amount ?? p.value ?? p.paidAmount ?? p.total ?? p.valor ?? 0)
          map[key] = (map[key] || 0) + (isNaN(amt) ? 0 : amt)
        })
        // fallback: if no payments array but sale has paymentMethod
        if (Object.keys(map).length === 0 && raw?.paymentMethod) {
          const key = String(raw.paymentMethod).trim().toUpperCase()
          const amt = Number(raw.totalValue ?? ((raw.totalPrice || 0) + (raw.surchargeTotal || 0)))
          map[key] = (map[key] || 0) + (isNaN(amt) ? 0 : amt)
        }
        paymentSummary = Object.entries(map).map(([method, amount]) => ({ method, amount }))
      } catch (e) { paymentSummary = [] }

      const hasCredit = paymentSummary.some(p => p.method.includes('CREDITO') || p.method.includes('CREDIT'))
      setSaleDetail({ ...raw, saleDateObj: dt, saleDateDisplay: formatDateTime(dt), paymentSummary, hasCreditSurcharge: hasCredit && (raw?.surchargeTotal || 0) > 0 })
    } catch { toast.error('Erro ao carregar venda.') }
    finally { setSaleLoading(false) }
  }

  // ── Render helpers ─────────────────────────────────────────────────────────

  const reloadClients = () => {
    setClientsLoading(true)
    getAllClients()
      .then(setClients)
      .catch(() => toast.error('Erro ao carregar clientes.'))
      .finally(() => setClientsLoading(false))
  }

  const handleShowClientSpend = async () => {
    if (showClientSpend) { setShowClientSpend(false); setClientsSpend([]); return }
    setClientsSpendLoading(true)
    try {
      const list = await getClientSpending(startDate, endDate)
      setClientsSpend(list || [])
      setShowClientSpend(true)
    } catch {
      toast.error('Erro ao carregar gastos por cliente.')
    } finally {
      setClientsSpendLoading(false)
    }
  }

  const parseSaleDate = (s) => {
    const raw = s?.saleDate ?? s?.dataVenda ?? s?.data_venda ?? s?.sale_date ?? null
    if (!raw) return null
    const d = new Date(raw)
    return isNaN(d.getTime()) ? null : d
  }

  const pad2 = (n) => String(n).padStart(2, '0')

  const formatDateTime = (d) => {
    if (!d) return '—'
    return `${pad2(d.getDate())}/${pad2(d.getMonth()+1)}/${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`
  }

  const timeToMinutes = (t) => {
    if (!t) return null
    const parts = String(t).split(':')
    if (parts.length < 2) return null
    return Number(parts[0]) * 60 + Number(parts[1])
  }

  const isWithinTimeRange = (dateObj, startTime, endTime) => {
    if (!dateObj) return true
    if (!startTime && !endTime) return true
    const mins = dateObj.getHours() * 60 + dateObj.getMinutes()
    const s = timeToMinutes(startTime)
    const e = timeToMinutes(endTime)
    if (s != null && e != null) {
      if (s <= e) return mins >= s && mins <= e
      return mins >= s || mins <= e
    }
    if (s != null) return mins >= s
    if (e != null) return mins <= e
    return true
  }

  const renderFilters = () => {
    if (activeTab === 'clientes') return (
      <FilterBar>
        <FField style={{ flex: 1 }}>
          <FLabel>Buscar cliente</FLabel>
          <FInput
            placeholder='Nome ou telefone...'
            value={clientSearch}
            onChange={e => setClientSearch(e.target.value)}
          />
        </FField>
        <FField>
          <FLabel>Data Inicial</FLabel>
          <FInput type='date' value={startDate} onChange={e => setStartDate(e.target.value)} />
        </FField>
        <FField>
          <FLabel>Data Final</FLabel>
          <FInput type='date' value={endDate} onChange={e => setEndDate(e.target.value)} />
        </FField>
        <FField>
          <FLabel>Hora Inicial</FLabel>
          <FInput type='time' value={startTime} onChange={e => setStartTime(e.target.value)} />
        </FField>
        <FField>
          <FLabel>Hora Final</FLabel>
          <FInput type='time' value={endTime} onChange={e => setEndTime(e.target.value)} />
        </FField>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <GenBtn onClick={reloadClients} disabled={clientsLoading}>
            {clientsLoading ? 'Carregando...' : 'Atualizar Lista'}
          </GenBtn>
          <GenBtn onClick={handleShowClientSpend} disabled={clientsSpendLoading}>
            {clientsSpendLoading ? 'Carregando...' : (showClientSpend ? 'Voltar à lista' : 'Clientes por gasto')}
          </GenBtn>
        </div>
      </FilterBar>
    )
    if (['estoque','validade','descartes'].includes(activeTab)) {
      if (activeTab === 'validade') return (
        <FilterBar>
          <FField>
            <FLabel>Vencimento nos próximos</FLabel>
            <FSelect value={expiryDays} onChange={e => setExpiryDays(e.target.value)}>
              <option value='7'>7 dias</option>
              <option value='15'>15 dias</option>
              <option value='30'>30 dias</option>
              <option value='60'>60 dias</option>
            </FSelect>
          </FField>
          <GenBtn onClick={load} disabled={loading}>Atualizar</GenBtn>
        </FilterBar>
      )
      return null
    }
    return (
      <FilterBar>
        <FField>
          <FLabel>Data Inicial</FLabel>
          <FInput type='date' value={startDate} onChange={e => setStartDate(e.target.value)} />
        </FField>
        <FField>
          <FLabel>Data Final</FLabel>
          <FInput type='date' value={endDate} onChange={e => setEndDate(e.target.value)} />
        </FField>
        <FField>
          <FLabel>Hora Inicial</FLabel>
          <FInput type='time' value={startTime} onChange={e => setStartTime(e.target.value)} />
        </FField>
        <FField>
          <FLabel>Hora Final</FLabel>
          <FInput type='time' value={endTime} onChange={e => setEndTime(e.target.value)} />
        </FField>
        <GenBtn onClick={load} disabled={loading}>{loading ? 'Carregando...' : 'Gerar Relatório'}</GenBtn>
      </FilterBar>
    )
  }

  const renderContent = () => {
    // Clientes tem fluxo próprio — verificar antes do guard de `data`
    if (activeTab === 'clientes') {
      if (showClientSpend) {
        return renderClientsSpend(clientsSpend)
      }
      const filtered = clients.filter(c =>
        !clientSearch || c.nickname?.toLowerCase().includes(clientSearch.toLowerCase()) ||
        c.telefone?.includes(clientSearch)
      )
      return renderClientsList(filtered)
    }

    if (loading) return <Loading>Carregando dados...</Loading>
    if (error) return <Empty><span className='material-symbols-outlined'>error</span>{error}</Empty>
    if (!data) return <Empty><span className='material-symbols-outlined'>bar_chart</span>Selecione um período e clique em Gerar Relatório.</Empty>

    // ── VENDAS ──────────────────────────────────────────────────────────────────
    if (activeTab === 'vendas') {
      const salesRaw = data || []
      const sales = salesRaw.map(s => {
        const dt = parseSaleDate(s)
        return { ...s, saleDateObj: dt, saleDateDisplay: formatDateTime(dt) }
      }).filter(s => isWithinTimeRange(s.saleDateObj, startTime, endTime))
      const revenue = sales.reduce((a,s) => a + ((s.totalPrice||0) + (s.surchargeTotal||0)), 0)
      const cost    = sales.reduce((a,s) => a+(s.totalCost||0), 0)
      const profit  = revenue - cost
      const margin  = revenue > 0 ? (profit/revenue)*100 : 0
      const avg     = sales.length > 0 ? revenue/sales.length : 0

      const byPayment = sales.reduce((acc, s) => {
          const key = normalizePaymentKeyFromSale(s)
          acc[key] = (acc[key] || 0) + 1
          return acc
        }, {})

      return (
        <>
          <SumGrid>
            <SumCard $c='var(--brand)'><p className='lbl'>Faturamento</p><p className='val'>{fmt(revenue)}</p><p className='sub'>{sales.length} vendas</p></SumCard>
            <SumCard $c='var(--warning)'><p className='lbl'>Custo (CMV)</p><p className='val'>{fmt(cost)}</p><p className='sub'>Mercadoria vendida</p></SumCard>
            <SumCard $c='var(--success)'><p className='lbl'>Lucro Bruto</p><p className='val'>{fmt(profit)}</p><p className='sub'>Margem: {pct(margin)}</p></SumCard>
            <SumCard $c='var(--info)'><p className='lbl'>Ticket Médio</p><p className='val'>{fmt(avg)}</p><p className='sub'>Por venda</p></SumCard>
          </SumGrid>

          {Object.keys(byPayment).length > 0 && (
            <SumGrid>
              {Object.entries(byPayment).map(([m,c]) => {
                const parts = String(m).split(/\s*\+\s*/).map(p => p.trim()).filter(Boolean)
                return (
                  <SumCard key={m} $c='#e7e5e4'>
                    <p className='lbl'>Pagamento</p>
                    <p className='val' style={{ fontSize:16 }}>
                      {parts.map((t, idx) => (
                        <span key={idx} style={{ display: 'inline-block', whiteSpace: 'nowrap', marginRight: 8 }}>{PAY_LABELS[t] || t}{idx < parts.length - 1 && <span style={{ marginLeft: 6, marginRight: 6 }}>+</span>}</span>
                      ))}
                    </p>
                    <p className='sub'>{c} venda{c!==1?'s':''} · {pct((c/sales.length)*100)}</p>
                  </SumCard>
                )
              })}
            </SumGrid>
          )}

          <TableWrap>
            <TableHead><h3>Detalhamento</h3><span className='cnt'>{sales.length} registros</span></TableHead>
            {sales.length === 0 && <Empty><span className='material-symbols-outlined'>receipt_long</span>Nenhuma venda no período.</Empty>}
            {sales.length > 0 && <Table><thead><tr>
                            <th>#</th><th>Data</th><th>Vendedor</th><th>Pagamento</th><th style={{textAlign:'right'}}>Acréscimo</th>
                <th style={{textAlign:'right'}}>Custo</th>
                <th style={{textAlign:'right'}}>Faturamento</th>
                <th style={{textAlign:'right'}}>Margem</th>
              </tr></thead>
              <tbody>{sales.slice((tablePage-1)*PAGE_SIZE, tablePage*PAGE_SIZE).map(s => {
                            const r=(s.totalPrice||0) + (s.surchargeTotal||0), c=s.totalCost||0
                const m=r>0?((r-c)/r*100):0
                            return (<tr key={s.id} style={{cursor:'pointer'}} onClick={() => openSale(s.id)}>
                              <td style={{color:'var(--muted)'}}>#{s.id}</td>
                              <td>{s.saleDateDisplay}</td>
                              <td>{s.salesmanName||'—'}</td>
                              <td>
                                {s.payments && s.payments.length > 0 ? (
                                  s.payments.map((p, i) => {
                                    const pc = PAY_COLORS[p.paymentMethod] || {}
                                    return <Badge key={i} $c={pc.c} $t={pc.t} style={{marginRight:6}}>{p.paymentMethod}</Badge>
                                  })
                                ) : (
                                  (() => { const pc = PAY_COLORS[s.paymentMethod]||{}; return <Badge $c={pc.c} $t={pc.t}>{s.paymentMethod}</Badge> })()
                                )}
                              </td>
                              <td style={{textAlign:'right'}}>{fmt(s.surchargeTotal || 0)}</td>
                              <td style={{textAlign:'right'}}>{fmt(c)}</td>
                              <td style={{textAlign:'right',fontWeight:700}}>{fmt(r)}</td>
                              <td style={{textAlign:'right',color:m>=20?'var(--success)':m>=10?'var(--warning)':'var(--danger)'}}>{pct(m)}</td>
                            </tr>)
                          })}</tbody></Table>}
            {sales.length > 0 && <PaginationBar page={tablePage} totalPages={Math.ceil(sales.length/PAGE_SIZE)} totalItems={sales.length} onPageChange={setTablePage} />}
          </TableWrap>
        </>
      )
    }

    // ── ESTOQUE ─────────────────────────────────────────────────────────────────
    if (activeTab === 'estoque') {
      const products = data
      const total = products.reduce((a,p) => a + (p.purchases||[]).reduce((b,l) => b+Number(l.quantity||0), 0), 0)
      const lowStock = products.filter(p => (p.purchases||[]).reduce((a,l)=>a+Number(l.quantity||0),0) < 5)
      return (
        <>
          <SumGrid>
            <SumCard $c='var(--brand)'><p className='lbl'>Produtos em Estoque</p><p className='val'>{products.length}</p><p className='sub'>Com ao menos 1 lote</p></SumCard>
            <SumCard $c='var(--danger)'><p className='lbl'>Estoque Baixo (&lt;5)</p><p className='val'>{lowStock.length}</p><p className='sub'>Precisam reposição</p></SumCard>
          </SumGrid>
          <TableWrap>
            <TableHead><h3>Estoque por Produto</h3><span className='cnt'>{products.length} produtos</span></TableHead>
            {products.length === 0 && <Empty><span className='material-symbols-outlined'>inventory_2</span>Nenhum produto com estoque.</Empty>}
            {products.length > 0 && <Table><thead><tr><th>Produto</th><th>Código</th><th>Marca</th><th>Unid.</th><th>Lotes</th><th style={{textAlign:'right'}}>Qtd. Total</th><th>Status</th></tr></thead>
              <tbody>{products.slice((tablePage-1)*PAGE_SIZE, tablePage*PAGE_SIZE).map(p => {
                const qty = (p.purchases||[]).reduce((a,l)=>a+Number(l.quantity||0),0)
                return (<tr key={p.id}>
                  <td style={{fontWeight:700}}>{p.product_name}</td>
                  <td style={{color:'var(--muted)'}}>{p.code}</td>
                  <td>{p.brand_name||'—'}</td>
                  <td><Badge $c='#f5f5f4' $t='var(--text-sub)'>{p.unitMeasurement}</Badge></td>
                  <td style={{textAlign:'center'}}>{(p.purchases||[]).length}</td>
                  <td style={{textAlign:'right',fontWeight:700}}>{qty.toFixed(3).replace(/\.?0+$/,'')}</td>
                  <td>
                    {qty<=0 ? <Badge $c='#fef2f2' $t='var(--danger)'>Sem Estoque</Badge>
                      : qty<5 ? <Badge $c='#fffbeb' $t='var(--warning)'>Baixo</Badge>
                      : <Badge $c='#f0fdf4' $t='var(--success)'>OK</Badge>}
                  </td>
                </tr>)
              })}</tbody></Table>}
            {products.length > 0 && <PaginationBar page={tablePage} totalPages={Math.ceil(products.length/PAGE_SIZE)} totalItems={products.length} onPageChange={setTablePage} />}
          </TableWrap>
        </>
      )
    }

    // ── VALIDADE ────────────────────────────────────────────────────────────────
    if (activeTab === 'validade') {
      const maxDays = parseInt(expiryDays)
      const lots = []
      data.forEach(p => {
        (p.purchases||[]).forEach(l => {
          if (!l.expiring_date) return
          const d = daysUntil(l.expiring_date)
          if (d <= maxDays) lots.push({ ...l, productName: p.product_name, code: p.code, unit: p.unitMeasurement, daysLeft: d })
        })
      })
      lots.sort((a,b) => a.daysLeft - b.daysLeft)
      const expired   = lots.filter(l => l.daysLeft <= 0)
      const critical  = lots.filter(l => l.daysLeft > 0 && l.daysLeft <= 3)
      const attention = lots.filter(l => l.daysLeft > 3 && l.daysLeft <= 7)
      return (
        <>
          <SumGrid>
            <SumCard $c='var(--danger)'><p className='lbl'>Vencidos</p><p className='val'>{expired.length}</p><p className='sub'>Lotes expirados</p></SumCard>
            <SumCard $c='#dc2626'><p className='lbl'>Crítico (≤3 dias)</p><p className='val'>{critical.length}</p><p className='sub'>Atenção imediata</p></SumCard>
            <SumCard $c='var(--warning)'><p className='lbl'>Atenção (4-7 dias)</p><p className='val'>{attention.length}</p><p className='sub'>Monitorar</p></SumCard>
            <SumCard $c='var(--success)'><p className='lbl'>No Prazo</p><p className='val'>{lots.length - expired.length - critical.length - attention.length}</p><p className='sub'>Vence em {expiryDays}+ dias</p></SumCard>
          </SumGrid>
          <TableWrap>
            <TableHead><h3>Lotes por Validade</h3><span className='cnt'>{lots.length} lotes</span></TableHead>
            {lots.length === 0 && <Empty><span className='material-symbols-outlined'>event_available</span>Nenhum lote vencendo nos próximos {expiryDays} dias.</Empty>}
            {lots.length > 0 && <Table><thead><tr><th>Produto</th><th>Código</th><th>Lote #</th><th>Validade</th><th style={{textAlign:'right'}}>Qtd</th><th>Situação</th></tr></thead>
              <tbody>{lots.slice((tablePage-1)*PAGE_SIZE, tablePage*PAGE_SIZE).map((l,i) => (
                <tr key={i}>
                  <td style={{fontWeight:700}}>{l.productName}</td>
                  <td style={{color:'var(--muted)'}}>{l.code}</td>
                  <td style={{color:'var(--muted)'}}>#{l.purchase_id}</td>
                  <td>{l.expiring_date}</td>
                  <td style={{textAlign:'right'}}>{Number(l.quantity||0).toFixed(3).replace(/\.?0+$/,'')} {l.unit}</td>
                  <td>
                    <AlertBadge $d={l.daysLeft}>
                      {l.daysLeft <= 0 ? '⚠ Vencido' : `${l.daysLeft}d restante${l.daysLeft!==1?'s':''}`}
                    </AlertBadge>
                  </td>
                </tr>
              ))}</tbody></Table>}
            {lots.length > 0 && <PaginationBar page={tablePage} totalPages={Math.ceil(lots.length/PAGE_SIZE)} totalItems={lots.length} onPageChange={setTablePage} />}
          </TableWrap>
        </>
      )
    }

    // ── DESCARTES ───────────────────────────────────────────────────────────────
    if (activeTab === 'descartes') {
      const MOTIVO_LABELS = { VENCIMENTO:'Vencimento', DANO:'Dano/Avaria', ROUBO:'Roubo', PERDA_PESO:'Perda de Peso', CONSUMO_PESSOAL:'Consumo Pessoal', OUTRO:'Outro' }
      const byType = data.reduce((acc,d) => { acc[d.type]=(acc[d.type]||0)+1; return acc },{})
      return (
        <>
          <SumGrid>
            <SumCard $c='var(--danger)'><p className='lbl'>Total de Descartes</p><p className='val'>{data.length}</p><p className='sub'>Registros de perda</p></SumCard>
            {Object.entries(byType).map(([t,c]) => (
              <SumCard key={t} $c='#e7e5e4'><p className='lbl'>{MOTIVO_LABELS[t]||t}</p><p className='val'>{c}</p><p className='sub'>registros</p></SumCard>
            ))}
          </SumGrid>
          <TableWrap>
            <TableHead><h3>Histórico de Descartes</h3><span className='cnt'>{data.length} registros</span></TableHead>
            {data.length === 0 && <Empty><span className='material-symbols-outlined'>delete_forever</span>Nenhum descarte registrado.</Empty>}
            {data.length > 0 && <Table><thead><tr><th>#</th><th>Data</th><th>Motivo</th><th>Produtos Descartados</th></tr></thead>
              <tbody>{data.slice((tablePage-1)*PAGE_SIZE, tablePage*PAGE_SIZE).map(d => (
                <tr key={d.id}>
                  <td style={{color:'var(--muted)'}}>#{d.id}</td>
                  <td>{d.date}</td>
                  <td><Badge $c='#fef2f2' $t='var(--danger)'>{MOTIVO_LABELS[d.type]||d.type}</Badge></td>
                  <td>{(d.items||[]).map((it,i) => (
                    <span key={i} style={{display:'block',fontSize:11}}>
                      {it.productName} — {Number(it.quantity||0).toFixed(3).replace(/\.?0+$/,'')} {it.unitMeasurement}
                    </span>
                  ))}</td>
                </tr>
              ))}</tbody></Table>}
            {data.length > 0 && <PaginationBar page={tablePage} totalPages={Math.ceil(data.length/PAGE_SIZE)} totalItems={data.length} onPageChange={setTablePage} />}
          </TableWrap>
        </>
      )
    }

    // ── COMPRAS ─────────────────────────────────────────────────────────────────
    if (activeTab === 'compras') {
      const totalInvested = data.reduce((a,c) => a+Number(c.totalValue||0), 0)
      return (
        <>
          <SumGrid>
            <SumCard $c='var(--info)'><p className='lbl'>Total Investido</p><p className='val'>{fmt(totalInvested)}</p><p className='sub'>{data.length} compras registradas</p></SumCard>
          </SumGrid>
          <TableWrap>
            <TableHead><h3>Histórico de Compras</h3><span className='cnt'>{data.length} registros</span></TableHead>
            {data.length === 0 && <Empty><span className='material-symbols-outlined'>shopping_cart</span>Nenhuma compra registrada.</Empty>}
            {data.length > 0 && <Table><thead><tr><th>#</th><th>Data</th><th>Itens</th><th style={{textAlign:'right'}}>Total</th></tr></thead>
              <tbody>{data.slice((tablePage-1)*PAGE_SIZE, tablePage*PAGE_SIZE).map(c => (
                <tr key={c.id}>
                  <td style={{color:'var(--muted)'}}>#{c.id}</td>
                  <td>{c.date}</td>
                  <td style={{color:'var(--muted)',fontSize:11}}>{(c.items||[]).length} produto{(c.items||[]).length!==1?'s':''}</td>
                  <td style={{textAlign:'right',fontWeight:700}}>{fmt(c.totalValue)}</td>
                </tr>
              ))}</tbody></Table>}
            {data.length > 0 && <PaginationBar page={tablePage} totalPages={Math.ceil(data.length/PAGE_SIZE)} totalItems={data.length} onPageChange={setTablePage} />}
          </TableWrap>
        </>
      )
    }

    // ── CMV & MARGEM ─────────────────────────────────────────────────────────────
    if (activeTab === 'cmv') {
      const sales = data
      if (sales.length === 0) return <Empty><span className='material-symbols-outlined'>trending_up</span>Nenhuma venda no período selecionado.</Empty>

      const revenue = sales.reduce((a,s) => a+(s.totalPrice||0), 0)
      const cost    = sales.reduce((a,s) => a+(s.totalCost||0), 0)
      const profit  = revenue - cost
      const cmvPct  = revenue > 0 ? (cost/revenue)*100 : 0
      const margin  = revenue > 0 ? (profit/revenue)*100 : 0

      const discountSales   = sales.filter(s => s.hasDiscount)
      const discountRevenue = discountSales.reduce((a,s) => a+(s.totalPrice||0), 0)

      return (
        <>
          <SumGrid>
            <SumCard $c='var(--brand)'><p className='lbl'>Faturamento Bruto</p><p className='val'>{fmt(revenue)}</p><p className='sub'>{sales.length} vendas</p></SumCard>
            <SumCard $c='var(--warning)'><p className='lbl'>CMV (Custo)</p><p className='val'>{fmt(cost)}</p><p className='sub'>{pct(cmvPct)} do faturamento</p></SumCard>
            <SumCard $c='var(--success)'><p className='lbl'>Lucro Bruto</p><p className='val'>{fmt(profit)}</p><p className='sub'>Margem: {pct(margin)}</p></SumCard>
            <SumCard $c='#7c3aed'><p className='lbl'>Vendas c/ Desconto</p><p className='val'>{discountSales.length}</p><p className='sub'>{fmt(discountRevenue)} faturados</p></SumCard>
          </SumGrid>

          {/* CMV guide */}
          <TableWrap>
            <TableHead><h3>Interpretação dos Indicadores</h3></TableHead>
            <Table><thead><tr><th>Indicador</th><th>Seu valor</th><th>Referência setor</th><th>Situação</th></tr></thead>
            <tbody>
              <tr>
                <td style={{fontWeight:700}}>CMV %</td>
                <td>{pct(cmvPct)}</td><td>60% — 75%</td>
                <td><Badge $c={cmvPct<=75?'#f0fdf4':'#fef2f2'} $t={cmvPct<=75?'var(--success)':'var(--danger)'}>{cmvPct<=75?'Dentro do esperado':'Alto — revisar custos'}</Badge></td>
              </tr>
              <tr>
                <td style={{fontWeight:700}}>Margem Bruta</td>
                <td>{pct(margin)}</td><td>25% — 40%</td>
                <td><Badge $c={margin>=20?'#f0fdf4':'#fffbeb'} $t={margin>=20?'var(--success)':'var(--warning)'}>{margin>=20?'Saudável':margin>=10?'Atenção':'Crítico'}</Badge></td>
              </tr>
              <tr>
                <td style={{fontWeight:700}}>Ticket Médio</td>
                <td>{fmt(revenue/sales.length)}</td><td>—</td>
                <td><Badge $c='#eff6ff' $t='var(--info)'>Referência interna</Badge></td>
              </tr>
            </tbody></Table>
          </TableWrap>
        </>
      )
    }

    return null
  }

  const renderClientsSpend = (list) => (
    <>
      <SumGrid>
        <SumCard $c='var(--brand)'><p className='lbl'>Clientes</p><p className='val'>{list.length}</p><p className='sub'>Ordenado por gasto</p></SumCard>
      </SumGrid>

      {clientsSpendLoading ? <Loading>Carregando clientes por gasto...</Loading> : (
        <TableWrap>
          <TableHead>
            <h3>Clientes por gasto</h3>
            <span className='cnt'>{list.length} cliente{list.length!==1?'s':''}</span>
          </TableHead>
          {list.length === 0
            ? <Empty><span className='material-symbols-outlined'>group_off</span>Nenhum registro encontrado.</Empty>
            : (
              <Table>
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Telefone</th>
                    <th style={{textAlign:'right'}}>Total Gasto</th>
                  </tr>
                </thead>
                <tbody>
                  {list.slice((tablePage-1)*PAGE_SIZE, tablePage*PAGE_SIZE).map(c => {
                    const initials = c.nickname?.trim().split(' ').slice(0,2).map(w=>w[0]?.toUpperCase()).join('') || '?'
                    const clientObj = clients.find(x => x.id === c.clienteId) || {}
                    return (
                      <tr key={c.clienteId}>
                        <td>
                          <div style={{display:'flex',alignItems:'center',gap:10}}>
                            <div style={{width:32,height:32,borderRadius:'50%',background:'var(--brand)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Epilogue',fontWeight:900,fontSize:12,flexShrink:0}}>
                              {initials}
                            </div>
                            <span style={{fontWeight:700}}>{c.nickname || clientObj.nickname || '—'}</span>
                          </div>
                        </td>
                        <td>{clientObj.telefone || <span style={{color:'var(--muted)'}}>—</span>}</td>
                        <td style={{textAlign:'right',fontWeight:700}}>{fmt(Number(c.totalSpent || 0))}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            )}
          {list.length > 0 && <PaginationBar page={tablePage} totalPages={Math.ceil(list.length/PAGE_SIZE)} totalItems={list.length} onPageChange={setTablePage} />}
        </TableWrap>
      )}
    </>
  )

  // ── Renderiza lista de clientes (formato tabela) ───────────────────────────────
  const renderClientsList = (filtered) => (
    <>
      <SumGrid>
        <SumCard $c='var(--brand)'><p className='lbl'>Clientes Cadastrados</p><p className='val'>{clients.length}</p><p className='sub'>Total na base</p></SumCard>
      </SumGrid>

      {clientsLoading ? <Loading>Carregando clientes...</Loading> : (
        <TableWrap>
          <TableHead>
            <h3>Lista de Clientes</h3>
            <span className='cnt'>{filtered.length} encontrado{filtered.length !== 1 ? 's' : ''}</span>
          </TableHead>
          {filtered.length === 0
            ? <Empty><span className='material-symbols-outlined'>group_off</span>Nenhum cliente encontrado.</Empty>
            : (
              <Table>
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Telefone</th>
                    <th>Aniversário</th>
                    <th>Cadastrado em</th>
                    <th style={{textAlign:'right'}}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => {
                    const initials = c.nickname?.trim().split(' ').slice(0,2).map(w=>w[0]?.toUpperCase()).join('') || '?'
                    const dtCad = c.dataCadastro ? new Date(c.dataCadastro).toLocaleDateString('pt-BR') : '—'
                    return (
                      <tr key={c.id}>
                        <td>
                          <div style={{display:'flex',alignItems:'center',gap:10}}>
                            <div style={{width:32,height:32,borderRadius:'50%',background:'var(--brand)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Epilogue',fontWeight:900,fontSize:12,flexShrink:0}}>
                              {initials}
                            </div>
                            <span style={{fontWeight:700}}>{c.nickname}</span>
                          </div>
                        </td>
                        <td>{c.telefone || <span style={{color:'var(--muted)'}}>—</span>}</td>
                        <td>{c.aniversario ? fmtDate(c.aniversario) : <span style={{color:'var(--muted)'}}>—</span>}</td>
                        <td style={{color:'var(--muted)'}}>{dtCad}</td>
                        <td style={{textAlign:'right'}}>
                          <div style={{display:'flex',gap:6,justifyContent:'flex-end'}}>
                            <button onClick={() => navigate('cliente-historico', { clientId: c.id })}
                              style={{background:'none',border:'1px solid var(--border)',borderRadius:6,padding:'5px 10px',cursor:'pointer',fontSize:11,color:'var(--brand)',fontWeight:700}}>
                              Histórico
                            </button>
                            <button onClick={() => openEdit(c)}
                              style={{background:'var(--brand)',border:'none',borderRadius:6,padding:'5px 10px',cursor:'pointer',fontSize:11,color:'#fff',fontWeight:700}}>
                              Editar
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            )}
        </TableWrap>
      )}
    </>
  )

  return (
    <>
    <Wrapper>
      <Sidebar navigate={navigate} activeView='reports' />
      <Main>
        <Header>
          <span className='material-symbols-outlined' style={{color:'rgba(255,255,255,0.4)',fontSize:20}}>bar_chart</span>
          <PageTitle>Relatórios & Clientes</PageTitle>
        </Header>

        <Content>
          <Tabs>
            {TABS.map(t => (
              <Tab key={t.id} $a={activeTab === t.id} onClick={() => setActiveTab(t.id)}>
                <span className='material-symbols-outlined' style={{fontSize:15}}>{t.icon}</span>
                {t.label}
              </Tab>
            ))}
          </Tabs>

          {renderFilters()}
          {renderContent()}
        </Content>
      </Main>
    </Wrapper>

    {/* ── MODAL EDITAR CLIENTE ── */}
    {editClient && (
      <EditModalOverlay onClick={() => setEditClient(null)}>
        <EditModal onClick={e => e.stopPropagation()}>
          <EMHead>
            <h2>Editar Cliente</h2>
            <button onClick={() => setEditClient(null)}><span className='material-symbols-outlined'>close</span></button>
          </EMHead>
          <form onSubmit={handleEditSave}>
            <EMBody>
              <EMField>
                <label>Apelido / Nome *</label>
                <input autoFocus value={editForm.nickname} onChange={handleEditNicknameChange} required />
              </EMField>
              <EMField>
                <label>Telefone</label>
                <input value={formatPhoneDisplay(editForm.telefone)} onChange={handleEditPhoneChange} placeholder='(11) 99999-9999' />
                {editForm.telefone && !phoneIsValid(editForm.telefone) && <small style={{color:'#dc2626'}}>Telefone inválido</small>}
              </EMField>
              <EMField>
                <label>Aniversário</label>
                <input type='date' value={editForm.aniversario} onChange={e => setEditForm(f=>({...f,aniversario:e.target.value}))} />
                {editForm.aniversario && isBirthdayUnder18(editForm.aniversario) && <small style={{color:'#dc2626'}}>Cliente deve ser maior de 18 anos</small>}
                <small>Todos os campos exceto o apelido são opcionais.</small>
              </EMField>
            </EMBody>
            <EMActions>
              <EMDelete type='button' onClick={handleDeleteClient} disabled={deleteLoading}>{deleteLoading ? 'Apagando...' : 'Apagar Cliente'}</EMDelete>
              <EMCancel type='button' onClick={() => setEditClient(null)}>Cancelar</EMCancel>
              <EMSave type='submit' disabled={editSaving || !editForm.nickname?.trim() || (editForm.telefone && !phoneIsValid(editForm.telefone)) || isBirthdayUnder18(editForm.aniversario)}>{editSaving?'Salvando...':'Salvar Alterações'}</EMSave>
            </EMActions>
          </form>
        </EditModal>
      </EditModalOverlay>
    )}

    {/* ── MODAL HISTÓRICO DO CLIENTE ── */}
    {historyClient && (
      <EditModalOverlay onClick={() => setHistoryClient(null)}>
        <HistoryModal onClick={e => e.stopPropagation()}>
          <EMHead>
            <h2>Histórico — {historyClient.nickname}</h2>
            <button onClick={() => setHistoryClient(null)}><span className='material-symbols-outlined'>close</span></button>
          </EMHead>
          <div style={{padding:'0 0 8px'}}>
            {historyLoading && <Loading>Carregando histórico...</Loading>}
            {!historyLoading && historyData.length === 0 && (
              <Empty><span className='material-symbols-outlined'>receipt_long</span>Nenhuma compra registrada para este cliente.</Empty>
            )}
            {historyData.map(s => {
              const pc = PAY_COLORS[s.paymentMethod]||{}
              return (
                <HRow key={s.id}>
                  <div className='top'>
                    <div>
                      <span className='id'>Venda #{s.id}</span>
                      <span className='date' style={{marginLeft:10}}>📅 {s.saleDateDisplay || s.dataVenda || s.saleDate}</span>
                    </div>
                    <span className='total'>{fmt(s.totalValue)}</span>
                  </div>
                  <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:4}}>
                    <Badge $c={pc.c} $t={pc.t}>{s.paymentMethod}</Badge>
                    {s.hasDiscount && <Badge $c='#fffbeb' $t='#b45309'>5% OFF</Badge>}
                  </div>
                  <div className='items'>
                    {(s.items||[]).map((it,i)=>(
                      <span key={i} style={{display:'block'}}>
                        • {it.productName} — {Number(it.quantity).toFixed(3).replace(/\.?0+$/,'')} × {fmt(it.precoUnitarioVenda)}
                      </span>
                    ))}
                  </div>
                </HRow>
              )
            })}
          </div>
        </HistoryModal>
      </EditModalOverlay>
    )}

    {/* ── MODAL VENDA ── */}
    {saleDetail && (
      <EditModalOverlay onClick={() => setSaleDetail(null)}>
        <HistoryModal onClick={e => e.stopPropagation()}>
          <EMHead>
            <h2>Venda — #{saleDetail.id}</h2>
            <button onClick={() => setSaleDetail(null)}><span className='material-symbols-outlined'>close</span></button>
          </EMHead>
          <div style={{padding:'0 0 8px'}}>
            {saleLoading && <Loading>Carregando venda...</Loading>}
            {!saleLoading && (
              <div style={{border:'1px solid var(--border)', borderRadius:10, overflow:'hidden'}}>
                <div style={{padding:'10px 14px', background:'var(--bg)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <div style={{display:'flex', alignItems:'center', gap:10}}>
                    <span style={{fontWeight:700, fontSize:13, color:'var(--text)'}}>Venda #{saleDetail.id}</span>
                    {saleDetail.payments && saleDetail.payments.length > 0 ? (
                      saleDetail.payments.map((p, idx) => (
                        <Badge key={idx} $c={PAY_COLORS[String(p.paymentMethod || '').toUpperCase()]?.c} $t={PAY_COLORS[String(p.paymentMethod || '').toUpperCase()]?.t} style={{ marginRight:6 }}>{p.paymentMethod}</Badge>
                      ))
                    ) : (
                      <Badge $c={PAY_COLORS[String(saleDetail.paymentMethod || '').toUpperCase()]?.c} $t={PAY_COLORS[String(saleDetail.paymentMethod || '').toUpperCase()]?.t}>{saleDetail.paymentMethod}</Badge>
                    )}
                    {saleDetail.hasDiscount && <Badge $c='#fffbeb' $t='#b45309' style={{ background:'#fffbeb', color:'#b45309', marginLeft:6 }}>5% OFF</Badge>}
                    {saleDetail.surchargeTotal > 0 && <span style={{marginLeft:8,fontSize:12,color:'#1d4ed8'}}>+{fmt(saleDetail.surchargeTotal)} (taxa)</span>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{fontFamily:"'Epilogue',sans-serif",fontWeight:900,fontSize:16,color:'var(--brand)'}}>{fmt(Number(saleDetail.totalValue || 0) + Number(saleDetail.surchargeTotal || 0))}</div>
                    <div style={{fontSize:11,color:'var(--muted)'}}>{saleDetail.saleDateDisplay || saleDetail.dataVenda || saleDetail.saleDate}</div>
                  </div>
                </div>
                <div style={{padding:'8px 14px 12px'}}>
                  {(saleDetail.items || []).map((it, i) => (
                    <div key={i} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'5px 0', borderBottom:'1px solid #f9f8f8', fontSize:12}}>
                      <div>
                        <div style={{ color:'var(--text)', fontWeight:600 }}>{it.productName}</div>
                        <div style={{ color:'var(--muted)', marginTop:1, fontSize:11 }}>{Number(it.quantity).toFixed(3).replace(/\.?0+$/,'')} × {fmt(it.precoUnitarioVenda)}</div>
                      </div>
                      <span style={{ fontWeight:700 }}>{fmt(Number(it.quantity || 0) * Number(it.precoUnitarioVenda || 0))}</span>
                    </div>
                  ))}

                  {saleDetail.payments && saleDetail.payments.length > 0 && (
                    <div style={{marginTop:8}}>
                      {saleDetail.payments.map((p, i) => (
                        <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',fontSize:13}}>
                          <div>{p.paymentMethod}{p.parcelas ? ` • ${p.parcelas}x` : ''}</div>
                          <div>{fmt(Number(p.valorPago != null ? p.valorPago : p.valor || p.amount || p.paidAmount || p.value || 0))}{p.acrescimoValor ? ` (+${fmt(p.acrescimoValor)})` : ''}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </HistoryModal>
      </EditModalOverlay>
    )}
    </>
  )
}

export default ReportsView
