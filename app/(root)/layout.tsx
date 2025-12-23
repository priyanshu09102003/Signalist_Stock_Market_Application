import Header from '@/components/Header/Header'
import React from 'react'

const RootLayout = ({children}:{children: React.ReactNode}) => {
  return (
    <main className='min-h-screen text-gray-400'>

        {/* HEADER */}

        <Header />

        <div className='container py-10'>
            {children}
        </div>

    </main>
  )
}

export default RootLayout
