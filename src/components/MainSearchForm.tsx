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
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [headerTitle, setHeaderTitle] = useState('')
  const [headerSubtitle, setHeaderSubtitle] = useState('')

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
    if (location.length >= 2) {
      const allLocations = [...cities, ...neighborhoods]
      const filtered = allLocations.filter(loc =>
        loc.toLowerCase().includes(location.toLowerCase())
      )
      setFilteredLocations(filtered.slice(0, 5)) // Mostrar no máximo 5 sugestões
      setShowSuggestions(filtered.length > 0)
    } else {
      setFilteredLocations([])
      setShowSuggestions(false)
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
      <section className="w-full text-center">
        {/* Título - Escondido em mobile */}
        <h1 className="hidden lg:block" style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', lineHeight: '1.2', color: 'white', textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
          {headerTitle}
          <br />
          <small style={{ fontSize: '1.5rem', fontWeight: 'normal', opacity: 0.9, display: 'block', marginTop: '0.5rem' }}>
            {headerSubtitle}
          </small>
        </h1>

        {/* Formulário Moderno */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
          className="mt-6"
          style={{
            background: '#f9f3ea',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
          }}
        >
          {/* Grid de campos - 4 colunas em desktop, 1 em mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">

            {/* Campo 1: Venda/Aluguel */}
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Pretensão
              </label>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as 'venda' | 'aluguel' | '')}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none transition-all text-gray-800 font-medium"
              >
                <option value="">Selecione</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Campo 2: Tipo de Imóvel */}
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Tipo de Imóvel
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none transition-all text-gray-800 font-medium"
              >
                <option value="">Selecione</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Campo 3: Cidade */}
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Cidade
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={() => location.length >= 2 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Digite a cidade..."
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none transition-all text-gray-800 font-medium placeholder:text-gray-400"
              />

              {/* Dropdown de sugestões */}
              {showSuggestions && filteredLocations.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {filteredLocations.map((loc, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setLocation(loc)
                        setShowSuggestions(false)
                      }}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors text-gray-800 font-medium border-b border-gray-100 last:border-b-0"
                    >
                      {loc}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Campo 4: Quartos */}
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Quartos
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none transition-all text-gray-800 font-medium"
              >
                <option value="">Todos</option>
                <option value="1">1 quarto</option>
                <option value="2">2 quartos</option>
                <option value="3">3 quartos</option>
                <option value="4">4+ quartos</option>
              </select>
            </div>
          </div>

          {/* Botão de Busca */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-12 py-4 rounded-full font-bold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3 text-base"
              style={{ backgroundColor: primaryColor }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>BUSCAR IMÓVEIS</span>
            </button>
          </div>
        </form>
      </section>
    </>
  )
}
