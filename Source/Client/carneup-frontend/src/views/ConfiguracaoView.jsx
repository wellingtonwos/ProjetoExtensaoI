import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Sidebar } from '../components/Sidebar'
import { toast } from 'react-toastify'
import api from '../services/apiClient'
import ConfirmModal from '../components/ConfirmModal'

const Wrapper = styled.div`
  display: flex; min-height: 100vh; background: var(--bg);
  font-family: 'Work Sans', sans-serif;
`
const Main = styled.main`flex: 1; display: flex; flex-direction: column; min-width: 0;`
const TopBar = styled.div`
  background: var(--sidebar-bg); padding: 14px 28px;
  display: flex; align-items: center; gap: 12px;
  span { color: rgba(255,255,255,0.4); font-size: 20px; }
  h1 { font-family: 'Epilogue',sans-serif; font-size: 16px; font-weight: 900;
       color: #fff; text-transform: uppercase; letter-spacing: 0.05em; margin: 0; }
`
const Content = styled.div`
  padding: 28px; display: flex; flex-direction: column; gap: 24px;
  max-width: 720px;
`
const Card = styled.div`
  background: #fff; border-radius: 14px; border: 1px solid var(--border);
  overflow: hidden;
`
const CardHead = styled.div`
  padding: 16px 22px; border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 10px;
  h2 { font-family: 'Epilogue',sans-serif; font-size: 14px; font-weight: 900;
       text-transform: uppercase; letter-spacing: 0.05em; color: var(--text); margin: 0; }
  span { color: var(--brand); font-size: 18px; }
`
const CardBody = styled.div`padding: 22px;`
const Grid = styled.div`
  display: grid; gap: 16px;
  grid-template-columns: ${p => p.$cols || '1fr'};
`
const Field = styled.div`display: flex; flex-direction: column; gap: 5px;`
const Label = styled.label`
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.12em; color: var(--muted);
`
const Input = styled.input`
  padding: 10px 12px; border: 1px solid var(--border); border-radius: var(--radius);
  font-size: 14px; font-family: 'Work Sans',sans-serif;
  &:focus { outline: none; border-color: var(--brand); }
`
const SaveBtn = styled.button`
  padding: 11px 24px; background: var(--brand); color: #fff;
  border: none; border-radius: var(--radius); font-family: 'Epilogue',sans-serif;
  font-weight: 900; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em;
  cursor: pointer; width: 100%;
  &:hover { background: var(--brand-hover); }
`
const Preview = styled.div`
  background: #1c1917; color: #fff; border-radius: 10px; padding: 20px;
  font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.6;
  white-space: pre;
`

const TextArea = styled.textarea`
  width: 100%; min-height: 180px; padding: 12px; font-size: 14px; border-radius: 8px;
  border: 1px solid var(--border); font-family: 'Work Sans',sans-serif; resize: vertical;
`
const Divider = styled.div`
  border-top: 1px dashed #444; margin: 6px 0;
`

const STORAGE_KEY = 'carneup_store_config'

const DEFAULT_CONFIG = {
  storeName:    'Açougue Bom Pedaço',
  cnpj:         '12.345.678/0001-90',
  address:      'Rua das Carnes, 42 - Centro',
  city:         'São Paulo - SP',
  phone:        '(11) 3456-7890',
  instagram:    '',
  footerMsg:    'Obrigado pela preferência!',
  expiryDays:   7,
}

export const loadStoreConfig = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : { ...DEFAULT_CONFIG }
  } catch { return { ...DEFAULT_CONFIG } }
}

export const ConfiguracaoView = ({ navigate }) => {
  const [form, setForm] = useState(loadStoreConfig)
  const [saved, setSaved] = useState(false)

  const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSave = (e) => {
    e.preventDefault()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
    setSaved(true)
    toast.success('Configurações salvas com sucesso!')
    setTimeout(() => setSaved(false), 3000)
  }

  const onlyDigits = s => (s || '').replace(/\D/g, '')
  const formatCNPJ = (value) => {
    const d = onlyDigits(value).slice(0,14)
    if (!d) return ''
    if (d.length <= 2) return d
    if (d.length <= 5) return d.replace(/^(\d{2})(\d+)/, '$1.$2')
    if (d.length <= 8) return d.replace(/^(\d{2})(\d{3})(\d+)/, '$1.$2.$3')
    if (d.length <= 12) return d.replace(/^(\d{2})(\d{3})(\d{3})(\d+)/, '$1.$2.$3/$4')
    return d.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})/, '$1.$2.$3/$4-$5')
  }
  const formatPhone = (value) => {
    const d = onlyDigits(value).slice(0,11)
    if (!d) return ''
    if (d.length <= 2) return `(${d}`
    if (d.length <= 6) return `(${d.slice(0,2)}) ${d.slice(2)}`
    if (d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`
    return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`
  }
  const center = (str, width = 32) => {
    str = str || ''
    const pad = Math.max(0, width - str.length)
    return ' '.repeat(Math.floor(pad / 2)) + str + ' '.repeat(Math.ceil(pad / 2))
  }
  const line = (label, value, width = 32) => {
    const valStr = String(value || '')
    const avail = width - label.length - 1
    const val = valStr.length > avail ? valStr.slice(0, avail) : valStr.padStart(avail)
    return `${label} ${val}`
  }

  const preview = [
    center(String(form.storeName || '').toUpperCase()),
    form.cnpj ? `CNPJ: ${form.cnpj}` : '',
    form.address || '',
    form.city || '',
    form.phone ? `Tel: ${form.phone}` : '',
    form.instagram ? `Instagram: ${form.instagram}` : '',
    '--------------------------------',
    `DATA: ${new Date().toLocaleString('pt-BR')}`,
    '--------------------------------',
    line('PICANHA 1.200KG', 'R$ 82,80'),
    line('COSTELA  0.800KG', 'R$ 38,40'),
    '- - - - - - - - - - - - - - - -',
    line('SUBTOTAL', 'R$ 121,20'),
    line('TOTAL', 'R$ 121,20'),
    line('PAGAMENTO', 'PIX'),
    '--------------------------------',
    center(form.footerMsg),
  ].filter(Boolean).join('\n')

  // Finance configurations state
  const [financeConfig, setFinanceConfig] = useState({ lucroEsperado: '20.00', taxaDebito: '2.50', taxaCredito: '3.50' })
  const [financeLoading, setFinanceLoading] = useState(false)
  const [savingFinance, setSavingFinance] = useState(false)
  const [financeCreatedAt, setFinanceCreatedAt] = useState(null)
  const [financeConfirmOpen, setFinanceConfirmOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    setFinanceLoading(true)
    api.get('/configuracoes/latest').then(r => {
      if (!mounted) return
      const d = r.data
      if (d) {
        setFinanceConfig({
          lucroEsperado: d.lucroEsperado != null ? String(d.lucroEsperado) : '',
          taxaDebito: d.taxaDebito != null ? String(d.taxaDebito) : '',
          taxaCredito: d.taxaCredito != null ? String(d.taxaCredito) : ''
        })
        setFinanceCreatedAt(d.createdAt || d.criadoEm || d.created_at || null)
      }
    }).catch(() => {
      // ignore
    }).finally(() => { if (mounted) setFinanceLoading(false) })
    return () => { mounted = false }
  }, [])

  const saveFinance = async (e) => {
    e?.preventDefault()
    setSavingFinance(true)
    try {
      await api.post('/configuracoes', {
        lucroEsperado: financeConfig.lucroEsperado === '' ? null : Number(financeConfig.lucroEsperado),
        taxaDebito: financeConfig.taxaDebito === '' ? null : Number(financeConfig.taxaDebito),
        taxaCredito: financeConfig.taxaCredito === '' ? null : Number(financeConfig.taxaCredito),
      })
      const latest = await api.get('/configuracoes/latest').then(r => r.data).catch(() => null)
      if (latest) {
        setFinanceConfig({
          lucroEsperado: latest.lucroEsperado != null ? String(latest.lucroEsperado) : '',
          taxaDebito: latest.taxaDebito != null ? String(latest.taxaDebito) : '',
          taxaCredito: latest.taxaCredito != null ? String(latest.taxaCredito) : '',
        })
        setFinanceCreatedAt(latest.createdAt || latest.criado_em || latest.criadoEm || null)
      }
      toast.success('Configurações financeiras salvas (nova versão)')
    } catch (err) {
      console.error(err)
      toast.error('Erro ao salvar configurações')
    } finally {
      setSavingFinance(false)
    }
  }

  // Termos state
  const [termoConteudo, setTermoConteudo] = useState('')
  const [termoId, setTermoId] = useState(null)
  const [termoCriadoEm, setTermoCriadoEm] = useState(null)
  const [termoLoading, setTermoLoading] = useState(false)
  const [savingTermo, setSavingTermo] = useState(false)
  const [termoConfirmOpen, setTermoConfirmOpen] = useState(false)

  useEffect(() => {
    // load latest termo
    let mounted = true
    setTermoLoading(true)
    api.get('/termos/latest').then(r => {
      if (!mounted) return
      const data = r.data
      if (data) {
        setTermoConteudo(data.conteudo || '')
        setTermoId(data.id || null)
        setTermoCriadoEm(data.criadoEm || data.criado_em || null)
      }
    }).catch(() => {
      // no latest termo
    }).finally(() => { if (mounted) setTermoLoading(false) })
    return () => { mounted = false }
  }, [])

  const saveTermo = async (e) => {
    e?.preventDefault()
    setSavingTermo(true)
    try {
      await api.post('/termos', { conteudo: termoConteudo })
      // refresh latest termo after creation
      const latest = await api.get('/termos/latest').then(r => r.data).catch(() => null)
      if (latest) {
        setTermoId(latest.id || null)
        setTermoCriadoEm(latest.criadoEm || latest.criado_em || null)
        setTermoConteudo(latest.conteudo || termoConteudo)
      }
      toast.success('Termo salvo com sucesso (nova versão)')
    } catch (err) {
      console.error(err)
      toast.error('Erro ao salvar termo')
    } finally {
      setSavingTermo(false)
    }
  }

  return (
    <Wrapper>
      <Sidebar navigate={navigate} activeView='config-loja' />
      <Main>
        <TopBar>
          <span className='material-symbols-outlined'>store</span>
          <h1>Configurações da Loja</h1>
        </TopBar>
        <Content>
          <form onSubmit={handleSave}>
            <Card style={{ marginBottom: 20 }}>
              <CardHead>
                <span className='material-symbols-outlined'>storefront</span>
                <h2>Dados da Loja</h2>
              </CardHead>
              <CardBody>
                <Grid style={{ marginBottom: 14 }}>
                  <Field>
                    <Label>Nome da Loja *</Label>
                    <Input value={form.storeName} onChange={handleChange('storeName')} required placeholder='Ex: Açougue Bom Pedaço' />
                  </Field>
                </Grid>
                <Grid $cols='1fr 1fr 1fr' style={{ marginBottom: 14 }}>
                  <Field>
                    <Label>CNPJ</Label>
                    <Input value={form.cnpj} onChange={e => setForm(f => ({ ...f, cnpj: formatCNPJ(e.target.value) }))} placeholder='00.000.000/0001-00' inputMode='numeric' />
                  </Field>
                  <Field>
                    <Label>Telefone</Label>
                    <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: formatPhone(e.target.value) }))} placeholder='(00) 00000-0000' inputMode='numeric' />
                  </Field>
                  <Field>
                    <Label>Instagram</Label>
                    <Input value={form.instagram} onChange={handleChange('instagram')} placeholder='@seuloja' />
                  </Field>
                </Grid>
                <Grid style={{ marginBottom: 14 }}>
                  <Field>
                    <Label>Endereço</Label>
                    <Input value={form.address} onChange={handleChange('address')} placeholder='Rua, número, bairro' />
                  </Field>
                </Grid>
                <Grid style={{ marginBottom: 14 }}>
                  <Field>
                    <Label>Cidade / UF</Label>
                    <Input value={form.city} onChange={handleChange('city')} placeholder='São Paulo - SP' />
                  </Field>
                </Grid>
                <Grid style={{ marginBottom: 20 }}>
                  <Field>
                    <Label>Mensagem de Rodapé da Nota</Label>
                    <Input value={form.footerMsg} onChange={handleChange('footerMsg')} placeholder='Ex: Obrigado pela preferência!' />
                  </Field>
                </Grid>
                                <Grid style={{ marginBottom: 20 }}>
                                  <Field>
                                    <Label>Dias para alertas de validade</Label>
                                    <Input type='number' min='1' value={form.expiryDays || 7} onChange={e => setForm(f => ({ ...f, expiryDays: Number(e.target.value) }))} />
                                  </Field>
                                </Grid>
                                <SaveBtn type='submit'>{saved ? '✓ Salvo!' : 'Salvar Configurações'}</SaveBtn>
              </CardBody>
            </Card>
          </form>

          <Card style={{ marginBottom: 20 }}>
            <CardHead>
              <span className='material-symbols-outlined'>settings</span>
              <h2>Parâmetros Financeiros</h2>
            </CardHead>
            <CardBody>
              {financeLoading ? <div>Carregando...</div> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <Grid $cols='1fr 1fr 1fr' style={{ marginBottom: 8 }}>
                    <Field>
                      <Label>Lucro Esperado (%)</Label>
                      <Input type='number' min='0' max='100' step='0.01' value={financeConfig.lucroEsperado} onChange={e => setFinanceConfig(f => ({ ...f, lucroEsperado: e.target.value }))} onBlur={e => setFinanceConfig(f => ({ ...f, lucroEsperado: e.target.value === '' ? '' : Number(e.target.value).toFixed(2) }))} placeholder='20.00' />
                    </Field>
                    <Field>
                      <Label>Taxa Débito (%)</Label>
                      <Input type='number' min='0' step='0.01' value={financeConfig.taxaDebito} onChange={e => setFinanceConfig(f => ({ ...f, taxaDebito: e.target.value }))} onBlur={e => setFinanceConfig(f => ({ ...f, taxaDebito: e.target.value === '' ? '' : Number(e.target.value).toFixed(2) }))} placeholder='2.50' />
                    </Field>
                    <Field>
                      <Label>Taxa Crédito (%)</Label>
                      <Input type='number' min='0' step='0.01' value={financeConfig.taxaCredito} onChange={e => setFinanceConfig(f => ({ ...f, taxaCredito: e.target.value }))} onBlur={e => setFinanceConfig(f => ({ ...f, taxaCredito: e.target.value === '' ? '' : Number(e.target.value).toFixed(2) }))} placeholder='3.50' />
                    </Field>
                  </Grid>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                    {financeCreatedAt ? `Última versão criada em: ${financeCreatedAt ? new Date(financeCreatedAt).toLocaleString('pt-BR') : ''}` : 'Nenhuma versão registrada.'}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <SaveBtn onClick={() => setFinanceConfirmOpen(true)} disabled={savingFinance || financeLoading}>
                      {savingFinance ? 'Salvando...' : 'Salvar Parâmetros (nova versão)'}
                    </SaveBtn>
                  </div>
                </div>
              )}
              <ConfirmModal
                open={financeConfirmOpen}
                title='Criar nova versão das configurações financeiras'
                message='Deseja criar uma nova versão destas configurações? Isso salvará os valores como uma nova linha para histórico.'
                onCancel={() => setFinanceConfirmOpen(false)}
                onConfirm={async () => { await saveFinance(); setFinanceConfirmOpen(false) }}
                confirmLabel='Criar versão'
                loading={savingFinance}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHead>
              <span className='material-symbols-outlined'>receipt_long</span>
              <h2>Prévia da Nota (80mm)</h2>
            </CardHead>
            <CardBody>
              <Preview>{preview}</Preview>
            </CardBody>
          </Card>

          <Card>
            <CardHead>
              <span className='material-symbols-outlined'>description</span>
              <h2>Termos e Condições (versão atual)</h2>
            </CardHead>
            <CardBody>
              {termoLoading ? <div>Carregando termos...</div> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                    {termoId ? `Versão ID: ${termoId}` : 'Nenhuma versão disponível'}
                    {termoCriadoEm ? ` — Criado em: ${new Date(termoCriadoEm).toLocaleString('pt-BR')}` : ''}
                  </div>
                  <TextArea value={termoConteudo} onChange={e => setTermoConteudo(e.target.value)} placeholder='Escreva os termos aqui...' />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <SaveBtn onClick={() => setTermoConfirmOpen(true)} disabled={savingTermo}>{savingTermo ? 'Salvando...' : 'Salvar Termo (nova versão)'}</SaveBtn>
                  </div>
                  <ConfirmModal
                    open={termoConfirmOpen}
                    title='Criar nova versão do termo'
                    message='Deseja realmente criar uma nova versão dos Termos e Condições? Isso irá registrar a versão atual com a data e hora.'
                    onCancel={() => setTermoConfirmOpen(false)}
                    onConfirm={async () => { await saveTermo(); setTermoConfirmOpen(false) }}
                    confirmLabel='Criar versão'
                    loading={savingTermo}
                  />
                </div>
              )}
            </CardBody>
          </Card>
        </Content>
      </Main>
    </Wrapper>
  )
}

export default ConfiguracaoView
