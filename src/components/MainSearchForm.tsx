'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'

export default function MainSearchForm() {
  const router = useRouter()
  const { primaryColor } = useTheme()
  const [searchType, setSearchType] = useState<'venda' | 'aluguel' | ''>('')
  const [propertyType, setPropertyType] = useState('')
  const [location, setLocation] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [types, setTypes] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [neighborhoods, setNeighborhoods] = useState<string[]>([])
  const [filteredLocations, setFilteredLocations] = useState<string[]>([])
  const [showTypeSuggestions, setShowTypeSuggestions] = useState(false)
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false)
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
  const [showBedroomsSuggestions, setShowBedroomsSuggestions] = useState(false)
  const [headerTitle, setHeaderTitle] = useState('')
  const [headerSubtitle, setHeaderSubtitle] = useState('')

  const bedroomOptions = [
    { value: '1', label: '1 quarto' },
    { value: '2', label: '2 quartos' },
    { value: '3', label: '3 quartos' },
    { value: '4', label: '4+ quartos' }
  ]

  // Carregar configurações (título e subtítulo)
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        if (response.ok) {
          const data = await response.json()
          if (data?.settings?.headerTitle) {
            setHeaderTitle(data.settings.headerTitle)
          }
          if (data?.settings?.headerSubtitle) {
            setHeaderSubtitle(data.settings.headerSubtitle)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error)
      }
    }
    fetchSettings()
  }, [])

  // Carregar dados do banco (tipos, categorias, cidades e bairros)
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔄 Iniciando busca de dados em /api/locations...')
        const response = await fetch('/api/locations')
        console.log('📡 Status da resposta:', response.status, response.statusText)

        if (response.ok) {
          const data = await response.json()
          console.log('✅ Dados carregados do banco:', data)
          console.log('  - Types:', data.types)
          console.log('  - Categories:', data.categories)
          console.log('  - Cities:', data.cities)

          setTypes(data.types || [])
          setCategories(data.categories || [])
          setCities(data.cities || [])
          setNeighborhoods(data.neighborhoods || [])

          console.log('✅ States atualizados!')
        } else {
          console.error('❌ Erro na API:', response.status)
        }
      } catch (error) {
        console.error('❌ Erro ao carregar dados:', error)
      }
    }
    fetchData()
  }, [])

  // Filtrar sugestões baseado no que o usuário digita
  useEffect(() => {
    if (location.length >= 1) {
      const allLocations = [...cities, ...neighborhoods]
      const filtered = allLocations.filter(loc =>
        loc.toLowerCase().includes(location.toLowerCase())
      )
      setFilteredLocations(filtered.slice(0, 10))
    } else {
      setFilteredLocations([])
    }
  }, [location, cities, neighborhoods])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchType) params.set('type', searchType)
    if (propertyType) params.set('category', propertyType)
    if (location) params.set('city', location)
    if (bedrooms) params.set('bedrooms', bedrooms)
    router.push(`/imoveis?${params.toString()}`)
  }

  return (
    <>
      <style jsx>{`
        .modern-field {
          position: relative;
          flex: 1;
          min-width: 0;
        }
        .modern-field:not(:last-child)::after {
          content: '';
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 24px;
          width: 1px;
          background: #e0e0e0;
        }
        .field-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .field-input {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
          padding: 0;
        }
        .field-input::placeholder {
          color: #999;
          font-weight: 400;
        }
        .dropdown-modern {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          overflow: hidden;
          z-index: 100;
          max-height: 280px;
          overflow-y: auto;
        }
        .dropdown-item-modern {
          padding: 14px 18px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
          transition: all 0.15s ease;
          border-bottom: 1px solid #f5f5f5;
        }
        .dropdown-item-modern:last-child {
          border-bottom: none;
        }
        .dropdown-item-modern:hover {
          background: ${primaryColor}08;
          color: ${primaryColor};
          padding-left: 22px;
        }
        .search-btn {
          background: ${primaryColor};
          transition: all 0.2s ease;
        }
        .search-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 6px 20px ${primaryColor}40;
        }
      `}</style>

      <section className="w-full text-center">
        {/* Título - Escondido em mobile */}
        <h1 className="hidden lg:block" style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1.5rem', lineHeight: '1.2', color: 'white', textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
          {headerTitle}
          <br />
          <small style={{ fontSize: '1.5rem', fontWeight: 'normal', opacity: 0.9, display: 'block', marginTop: '0.75rem' }}>
            {headerSubtitle}
          </small>
        </h1>

        {/* Formulário Moderno */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
          className="mt-10"
        >
          <div
            className="flex flex-col lg:flex-row items-stretch gap-0"
            style={{
              background: 'white',
              borderRadius: '50px',
              boxShadow: '0 6px 40px rgba(0,0,0,0.15)',
              padding: '8px 8px 8px 32px',
              border: '1px solid #e0e0e0'
            }}
          >
            {/* Campo 1: Pretensão */}
            <div className="modern-field py-4 pr-6">
              <label className="field-label">Pretensão</label>
              <input
                type="text"
                value={searchType ? searchType.charAt(0).toUpperCase() + searchType.slice(1) : ''}
                onFocus={() => setShowTypeSuggestions(true)}
                onBlur={() => setTimeout(() => setShowTypeSuggestions(false), 200)}
                onChange={(e) => setSearchType(e.target.value.toLowerCase() as 'venda' | 'aluguel' | '')}
                placeholder="Venda ou Aluguel"
                className="field-input cursor-pointer"
                readOnly
              />
              {showTypeSuggestions && types.length > 0 && (
                <div className="dropdown-modern">
                  {types.map((type) => (
                    <div
                      key={type}
                      onClick={() => {
                        setSearchType(type as 'venda' | 'aluguel')
                        setShowTypeSuggestions(false)
                      }}
                      className="dropdown-item-modern"
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Campo 2: Tipo */}
            <div className="modern-field py-4 pr-6">
              <label className="field-label">Tipo</label>
              <input
                type="text"
                value={propertyType ? propertyType.charAt(0).toUpperCase() + propertyType.slice(1) : ''}
                onFocus={() => setShowCategorySuggestions(true)}
                onBlur={() => setTimeout(() => setShowCategorySuggestions(false), 200)}
                onChange={(e) => setPropertyType(e.target.value.toLowerCase())}
                placeholder="Casa, Apartamento..."
                className="field-input"
              />
              {showCategorySuggestions && categories.length > 0 && (
                <div className="dropdown-modern">
                  {categories
                    .filter(cat => !propertyType || cat.toLowerCase().includes(propertyType.toLowerCase()))
                    .slice(0, 8)
                    .map((category) => (
                      <div
                        key={category}
                        onClick={() => {
                          setPropertyType(category)
                          setShowCategorySuggestions(false)
                        }}
                        className="dropdown-item-modern"
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Campo 3: Cidade */}
            <div className="modern-field py-4 pr-6">
              <label className="field-label">Cidade</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={() => setShowLocationSuggestions(true)}
                onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                placeholder="Onde você procura?"
                className="field-input"
              />
              {showLocationSuggestions && (location === '' ? cities.length > 0 : filteredLocations.length > 0) && (
                <div className="dropdown-modern">
                  {(location === '' ? cities.slice(0, 8) : filteredLocations).map((loc, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setLocation(loc)
                        setShowLocationSuggestions(false)
                      }}
                      className="dropdown-item-modern"
                    >
                      {loc}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Campo 4: Quartos */}
            <div className="modern-field py-4 pr-2">
              <label className="field-label">Quartos</label>
              <input
                type="text"
                value={bedrooms ? bedroomOptions.find(opt => opt.value === bedrooms)?.label || '' : ''}
                onFocus={() => setShowBedroomsSuggestions(true)}
                onBlur={() => setTimeout(() => setShowBedroomsSuggestions(false), 200)}
                placeholder="Quantos?"
                readOnly
                className="field-input cursor-pointer"
              />
              {showBedroomsSuggestions && (
                <div className="dropdown-modern">
                  <div
                    onClick={() => {
                      setBedrooms('')
                      setShowBedroomsSuggestions(false)
                    }}
                    className="dropdown-item-modern"
                  >
                    Qualquer
                  </div>
                  {bedroomOptions.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => {
                        setBedrooms(option.value)
                        setShowBedroomsSuggestions(false)
                      }}
                      className="dropdown-item-modern"
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botão Buscar */}
            <button
              type="submit"
              className="search-btn rounded-full px-10 py-4 text-white font-bold text-base flex items-center gap-2 lg:ml-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Buscar</span>
            </button>
          </div>
        </form>
      </section>
    </>
  )
}
