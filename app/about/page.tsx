'use client'

import { useLanguage } from '@/context/LanguageContext'

export default function Home() {
  const { lang } = useLanguage()

  const text =
    lang == 'en' ? 'A paragraph about the site' : 'Pastraipa apie svetainę'

  return (
    <div>
      <div>{text}</div>
    </div>
  )
}
