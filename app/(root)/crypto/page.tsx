import Categories from '@/components/CryptoComponents/Categories'
import CoinOverview from '@/components/CryptoComponents/CoinOverview'
import DataTable from '@/components/CryptoComponents/DataTable'
import { CategoriesFallback, CoinOverviewFallback, TrendingCoinsFallback } from '@/components/CryptoComponents/FallBack'
import Header from '@/components/CryptoComponents/Header'
import TrendingCoins from '@/components/CryptoComponents/TrendingCoins'
import { fetcher } from '@/lib/actions/coingecko.actions'
import { cn, formatCurrency } from '@/lib/utils'
import { TrendingDown, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { Suspense } from 'react'


const page = async() => {

  return (
    <>
        <Header />

        <main className='main-container_two'>

            <section className='home-grid_two'>

              <Suspense fallback={<CoinOverviewFallback/>}>

                <CoinOverview />

              </Suspense>

              <Suspense fallback={<TrendingCoinsFallback />}>

                <TrendingCoins />

              </Suspense>

               


            </section>

            <section className='w-full mt-7 space-y-4'>

              <Suspense fallback={<CategoriesFallback />}>
                <Categories />
              </Suspense>
            </section>

        </main>
    </>

    
  )
}

export default page
