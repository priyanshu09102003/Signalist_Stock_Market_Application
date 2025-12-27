import { fetcher } from '@/lib/actions/coingecko.actions'
import React from 'react'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import { CoinOverviewFallback } from './FallBack'
import CandlestickCharts from './Charts/CandlestickCharts'

const CoinOverview = async () => {

    try {

      const [coin, coinOHLCData] = await Promise.all([
          fetcher<CoinDetailsData>('coins/bitcoin'),

        fetcher<(OHLCData[])>('coins/bitcoin/ohlc', {
        vs_currency: 'usd',
        days: 1,
        precision: 'full'
        })
      ])

      return (
        <div id='coin-overview'>
          <CandlestickCharts data={coinOHLCData} coinId="bitcoin" >

            <div className='header_three pt-2'>

                        <Image src={coin.image.large} alt={coin.name} width={56} height={56} />
                        <div className='info'>

                          <p>{coin.name} | {coin.symbol.toUpperCase()}</p>
                          <h1>{formatCurrency(coin.market_data.current_price.usd)}</h1>


                        </div>

                  </div>

          </CandlestickCharts>

        </div>
      )
      
    } catch (error) {
      console.error('Error fetching coin OverView');
      return <CoinOverviewFallback />
    }
    
}

export default CoinOverview