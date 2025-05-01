'use client'

import { useLanguage } from '@/context/LanguageContext'

export default function Home() {
  const { lang } = useLanguage()

  const text =
    lang == 'en'
      ? 'Here should be some content'
      : 'Titulinis puslapis under construction'

  return (
    <div>
      <div>{text}</div>
    </div>
  )
}
