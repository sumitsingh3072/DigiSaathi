import Faq from '@/components/landing/FAQ'
import Features from '@/components/landing/Features'
import { Feedback } from '@/components/landing/Feedback'
import HeroGeometric from '@/components/landing/Hero'
import { HowItWorks } from '@/components/landing/HowItWorks'
import React from 'react'

const HomePage = () => {
  return (
    <div>
      <HeroGeometric />
      <Features />
      <HowItWorks />
      <Faq />
      <Feedback />
    </div>
  )
}

export default HomePage