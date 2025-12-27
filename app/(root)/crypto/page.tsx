import Header from '@/components/CryptoComponents/Header'
import React from 'react'

const page = () => {
  return (
    <>
        <Header />

        <main className='main-container_two'>

            <section className='home-grid'>

                <p>Coin Overview</p>

                <p>Trending Coins</p>

            </section>

            <section className='w-full mt-7 space-y-4'>
                <p>Categories</p>

            </section>

        </main>
    </>

    
  )
}

export default page
