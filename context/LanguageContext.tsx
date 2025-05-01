'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Language = 'en' | 'lt'

const LanguageContext = createContext<{
  lang: Language
  setLang: (lang: Language) => void
}>({
  lang: 'en',
  setLang: () => {
    throw new Error('setLang called outside of LanguageProvider')
  },
})

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [lang, setLangState] = useState<Language>('en')

  // Load from localStorage on mount
  useEffect(() => {
    const storedLang = localStorage.getItem('lang') as Language | null
    if (storedLang) {
      setLangState(storedLang)
    }
  }, [])

  // Save to localStorage whenever lang changes
  const setLang = (newLang: Language) => {
    setLangState(newLang)
    localStorage.setItem('lang', newLang)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
