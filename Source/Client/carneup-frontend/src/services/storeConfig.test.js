import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loadStoreConfig, saveStoreConfig } from './storeConfig'

const DEFAULT_CONFIG = {
  storeName: 'Açougue Bom Pedaço',
  cnpj: '12.345.678/0001-90',
  address: 'Rua das Carnes, 42 - Centro',
  city: 'São Paulo - SP',
  phone: '(11) 3456-7890',
  footerMsg: 'Obrigado pela preferência!',
}

describe('storeConfig', () => {
  let storage

  beforeEach(() => {
    storage = new Map()

    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key) => storage.get(key) ?? null),
      setItem: vi.fn((key, value) => storage.set(key, value)),
    })
  })

  it('carrega a configuracao padrao quando nao existe valor salvo', () => {
    expect(loadStoreConfig()).toEqual(DEFAULT_CONFIG)
    expect(localStorage.getItem).toHaveBeenCalledWith('carneup_store_config')
  })

  it('mescla a configuracao salva com os valores padrao', () => {
    storage.set('carneup_store_config', JSON.stringify({
      storeName: 'Casa das Carnes',
      phone: '(11) 99999-0000',
    }))

    expect(loadStoreConfig()).toEqual({
      ...DEFAULT_CONFIG,
      storeName: 'Casa das Carnes',
      phone: '(11) 99999-0000',
    })
  })

  it('retorna a configuracao padrao quando o valor salvo esta corrompido', () => {
    storage.set('carneup_store_config', '{invalid-json')

    expect(loadStoreConfig()).toEqual(DEFAULT_CONFIG)
  })

  it('salva a configuracao informada no localStorage', () => {
    const config = {
      ...DEFAULT_CONFIG,
      city: 'Curitiba - PR',
    }

    saveStoreConfig(config)

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'carneup_store_config',
      JSON.stringify(config),
    )
  })
})
