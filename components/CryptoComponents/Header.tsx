
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { headers } from 'next/headers'
import React from 'react'
import { SearchModal } from './GlobalSearchCrypto'
import { fetcher } from '@/lib/actions/coingecko.actions'

const Header = async () => {
    // Fetch trending coins
    const trendingData = await fetcher<{ coins: TrendingCoin[] }>('search/trending').catch(() => ({ coins: [] }));
    const trendingCoins = trendingData.coins || [];

    // Get pathname on server side
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || '';
    
  return (
   <header>
        <div className='main-container inner'>
                <nav className="ml-auto">

                    <SearchModal initialTrendingCoins={trendingCoins} />

                    <Link href="/crypto/coins"
                    className={cn('nav-link' , {
                        'is-active': pathname === '/crypto/coins'
                    })}
                    >
                    All Coins</Link>

                </nav>
        </div>
   </header>
  )
}

export default Header