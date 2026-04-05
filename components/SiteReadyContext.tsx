'use client'

import { createContext, useContext } from 'react'

export const SiteReadyContext = createContext(false)

export const useSiteReady = () => useContext(SiteReadyContext)