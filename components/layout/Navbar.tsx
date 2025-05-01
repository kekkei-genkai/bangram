'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const { lang, setLang } = useLanguage()

  const text = {
    home: lang == 'en' ? 'Home' : 'Pagrindinis',
    puzzles: lang == 'en' ? 'Puzzles' : 'Dėlionės',
    about: lang == 'en' ? 'About' : 'Apie',
    switchLang: lang == 'en' ? 'LT' : 'EN',
    swtichTitle:
      lang == 'en' ? 'Perjungti į lietuvių kalbą' : 'Switch to English',
  }

  return (
    <nav className='w-full bg-gray-800 text-white px-4 py-3 flex justify-between items-center'>
      <Link href='/' className='text-lg font-semibold' title={text.home}>
        Bangram
      </Link>
      <div className='flex gap-4 items-center'>
        {usePathname() !== '/puzzles' && (
          <Link href='/puzzles'>{text.puzzles}</Link>
        )}
        {usePathname() !== '/about' && <Link href='/about'>{text.about}</Link>}
        <button
          onClick={() => setLang(lang === 'en' ? 'lt' : 'en')}
          className='text-xs bg-gray-700 px-3 py-1 rounded hover:bg-gray-600'
          title={text.swtichTitle}
        >
          {text.switchLang}
        </button>
      </div>
    </nav>
  )
}

export default Navbar
