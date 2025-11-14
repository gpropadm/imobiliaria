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
        .search-input {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
        }
        .search-input:focus {
          border-color: ${primaryColor};
          box-shadow: 0 0 0 3px ${primaryColor}15;
        }
        .suggestion-item:hover {
          background: ${primaryColor}08;
          border-left: 3px solid ${primaryColor};
        }
      `}</style>

      <section className="w-full text-center">
        {/* Título - Escondido em mobile */}
        <h1 className="hidden lg:block" style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', lineHeight: '1.2', color: 'white', textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
          {headerTitle}
          <br />
          <small style={{ fontSize: '1.5rem', fontWeight: 'normal', opacity: 0.9, display: 'block', marginTop: '0.5rem' }}>
            {headerSubtitle}
          </small>
        </h1>

        {/* Formulário Profissional */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
          className="mt-8"
        >
          <div
            className="flex flex-col lg:flex-row items-center gap-0 lg:gap-0 overflow-hidden"
            style={{
              background: '#f9f3ea',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #e0e0e0'
            }}
          >
            {/* Campo 1: Venda/Aluguel */}
            <div className="relative w-full lg:w-1/4 border-b lg:border-b-0 lg:border-r border-gray-300">
              <input
                type="text"
                value={searchType ? searchType.charAt(0).toUpperCase() + searchType.slice(1) : ''}
                onChange={(e) => setSearchType(e.target.value.toLowerCase() as 'venda' | 'aluguel' | '')}
                onFocus={() => setShowTypeSuggestions(true)}
                onBlur={() => setTimeout(() => setShowTypeSuggestions(false), 200)}
                placeholder="Venda ou Aluguel"
                className="search-input w-full px-4 py-3.5 bg-transparent border-0 outline-none text-sm font-medium text-gray-800 placeholder:text-gray-400"
              />

              {showTypeSuggestions && types.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-2xl z-50 border border-gray-200">
                  {types.map((type) => (
                    <div
                      key={type}
                      onClick={() => {
                        setSearchType(type as 'venda' | 'aluguel')
                        setShowTypeSuggestions(false)
                      }}
                      className="suggestion-item px-4 py-2.5 cursor-pointer text-sm text-gray-700 hover:text-gray-900 border-b last:border-b-0 border-gray-100 transition-all"
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Campo 2: Tipo de Imóvel */}
            <div className="relative w-full lg:w-1/4 border-b lg:border-b-0 lg:border-r border-gray-300">
              <input
                type="text"
                value={propertyType ? propertyType.charAt(0).toUpperCase() + propertyType.slice(1) : ''}
                onChange={(e) => setPropertyType(e.target.value.toLowerCase())}
                onFocus={() => setShowCategorySuggestions(true)}
                onBlur={() => setTimeout(() => setShowCategorySuggestions(false), 200)}
                placeholder="Casa, Apartamento..."
                className="search-input w-full px-4 py-3.5 bg-transparent border-0 outline-none text-sm font-medium text-gray-800 placeholder:text-gray-400"
              />

              {showCategorySuggestions && categories.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-2xl z-50 border border-gray-200 max-h-64 overflow-y-auto">
                  {categories
                    .filter(cat => !propertyType || cat.toLowerCase().includes(propertyType.toLowerCase()))
                    .map((category) => (
                      <div
                        key={category}
                        onClick={() => {
                          setPropertyType(category)
                          setShowCategorySuggestions(false)
                        }}
                        className="suggestion-item px-4 py-2.5 cursor-pointer text-sm text-gray-700 hover:text-gray-900 border-b last:border-b-0 border-gray-100 transition-all"
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Campo 3: Cidade - Autocomplete */}
            <div className="relative w-full lg:flex-1 border-b lg:border-b-0 lg:border-r border-gray-300">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={() => setShowLocationSuggestions(true)}
                onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                placeholder="Cidade ou bairro"
                className="search-input w-full px-4 py-3.5 bg-transparent border-0 outline-none text-sm font-medium text-gray-800 placeholder:text-gray-400"
              />

              {/* Autocomplete de cidades */}
              {showLocationSuggestions && (location === '' ? cities.length > 0 : filteredLocations.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-2xl z-50 border border-gray-200 max-h-64 overflow-y-auto">
                  {(location === '' ? cities.slice(0, 10) : filteredLocations).map((loc, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setLocation(loc)
                        setShowLocationSuggestions(false)
                      }}
                      className="suggestion-item px-4 py-2.5 cursor-pointer text-sm text-gray-700 hover:text-gray-900 border-b last:border-b-0 border-gray-100 transition-all"
                    >
                      {loc}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Campo 4: Quartos */}
            <div className="relative w-full lg:w-auto border-gray-300">
              <input
                type="text"
                value={bedrooms ? bedroomOptions.find(opt => opt.value === bedrooms)?.label || '' : ''}
                onChange={(e) => setBedrooms('')}
                onFocus={() => setShowBedroomsSuggestions(true)}
                onBlur={() => setTimeout(() => setShowBedroomsSuggestions(false), 200)}
                placeholder="Quartos"
                readOnly
                className="search-input w-full px-4 py-3.5 bg-transparent border-0 outline-none text-sm font-medium text-gray-800 placeholder:text-gray-400 cursor-pointer"
              />

              {showBedroomsSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-2xl z-50 border border-gray-200">
                  {bedroomOptions.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => {
                        setBedrooms(option.value)
                        setShowBedroomsSuggestions(false)
                      }}
                      className="suggestion-item px-4 py-2.5 cursor-pointer text-sm text-gray-700 hover:text-gray-900 border-b last:border-b-0 border-gray-100 transition-all"
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botão de Busca - Integrado */}
            <button
              type="submit"
              className="w-full lg:w-auto px-8 py-3.5 font-semibold text-white text-sm transition-all duration-200 hover:opacity-90 flex items-center justify-center gap-2"
              style={{
                backgroundColor: primaryColor,
                borderRadius: '0 12px 12px 0'
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden lg:inline">BUSCAR</span>
            </button>
          </div>
        </form>
      </section>
    </>
  )
}
