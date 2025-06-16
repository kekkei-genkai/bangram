'use client'

import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'

export default function useUserId() {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('user_id')
      if (!id) {
        id = nanoid()
        localStorage.setItem('user_id', id)
      }
      setUserId(id)
    }
  }, [])

  return userId
}
