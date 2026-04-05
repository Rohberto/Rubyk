'use client'

import { useState } from 'react'
import Preloader from './Preloader'
import { SiteReadyContext } from './SiteReadyContext'

export default function PreloaderWrapper({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false)

  return (
    <SiteReadyContext.Provider value={done}>
      {!done && <Preloader onComplete={() => setDone(true)} />}
      <div style={{ opacity: done ? 1 : 0, transition: 'opacity 0.4s ease' }}>
        {children}
      </div>
    </SiteReadyContext.Provider>
  )
}