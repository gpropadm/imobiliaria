'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'

interface SearchFilters {
  types: string[]
  categoriesByType: Record<string, string[]>
}

export default function SearchForm() {
  const router = useRouter()
  const { primaryColor } = useTheme()
  const [filters, setFilters] = useState<SearchFilters>({ types: [], categoriesByType: {} })
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [bedrooms, setBedrooms] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFilters()
  }, [])

  const fetchFilters = async () => {
    try {
      const response = await fetch('/api/search-filters')
      if (response.ok) {
        const data = await response.json()
        setFilters(data)
      }
    } catch (error) {
      console.error('Erro ao carregar filtros:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const searchParams = new URLSearchParams()

    if (selectedType) searchParams.set('type', selectedType)
    if (selectedCategory) searchParams.set('category', selectedCategory)
    if (bedrooms) searchParams.set('bedrooms', bedrooms)
    if (location.trim()) {
      const locationParts = location.trim().split(' - ')
      if (locationParts.length === 2) {
        searchParams.set('city', locationParts[0])
        searchParams.set('state', locationParts[1])
      } else {
        searchParams.set('city', location.trim())
      }
    }

    router.push(`/imoveis?${searchParams.toString()}`)
  }

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="animate-pulse bg-white/70 h-24 rounded-3xl"></div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      {/* NOVO FORMULÁRIO COMPLETO */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-6 border border-gray-100">
        <form onSubmit={handleSearch} className="space-y-6">

          {/* Linha de Campos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* CAMPO 1: Venda/Aluguel */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                🏷️ Tipo de Negócio
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white text-gray-800 font-medium cursor-pointer"
              >
                <option value="">Selecione</option>
                {filters.types && filters.types.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* CAMPO 2: Tipo de Imóvel */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                🏠 Tipo de Imóvel
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white text-gray-800 font-medium cursor-pointer"
              >
                <option value="">Selecione</option>
                {filters.categoriesByType && Object.values(filters.categoriesByType).flat().filter((v, i, a) => a.indexOf(v) === i).map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* CAMPO 3: Cidade */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                📍 Localização
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Cidade, bairro..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white text-gray-800 font-medium placeholder:text-gray-400"
              />
            </div>

            {/* CAMPO 4: Quartos */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                🛏️ Quartos
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white text-gray-800 font-medium cursor-pointer"
              >
                <option value="">Todos</option>
                <option value="1">1 quarto</option>
                <option value="2">2 quartos</option>
                <option value="3">3 quartos</option>
                <option value="4">4+ quartos</option>
              </select>
            </div>
          </div>

          {/* Botão de Busca Grande */}
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="px-12 py-4 text-lg font-bold text-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-3"
              style={{ backgroundColor: primaryColor }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>BUSCAR IMÓVEIS</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
