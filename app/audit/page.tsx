import type { Metadata } from 'next'
import QuizClient from './QuizClient'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title:       'Storytelling Quiz — Rubyk',
  description: 'Grade your startup\'s storytelling in 2 minutes. Find out if your narrative is helping or hurting your growth.',
}

export default function QuizPage() {
  return (
    <>
      <Navbar />
      <QuizClient />
      <Footer />
    </>
  )
}