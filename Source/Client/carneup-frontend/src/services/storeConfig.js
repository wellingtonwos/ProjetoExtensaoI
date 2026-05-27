const STORAGE_KEY = 'carneup_store_config'

const DEFAULT_CONFIG = {
  storeName: 'Açougue Bom Pedaço',
  cnpj: '12.345.678/0001-90',
  address: 'Rua das Carnes, 42 - Centro',
  city: 'São Paulo - SP',
  phone: '(11) 3456-7890',
  footerMsg: 'Obrigado pela preferência!',
}

export const loadStoreConfig = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : { ...DEFAULT_CONFIG }
  } catch {
    return { ...DEFAULT_CONFIG }
  }
}

export const saveStoreConfig = (config) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}
