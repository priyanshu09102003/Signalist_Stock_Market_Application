"use client"

import React, { useState, useEffect } from 'react'
import { Separator } from '../ui/separator'
import CandlestickCharts from './Charts/CandlestickCharts'
import { fetcher } from '@/lib/actions/coingecko.actions'
import ExchangeListings from './ExchangeListings'

const LiveDataWrapper = ({children, coinId, poolId, coin, coinOHLCData}:LiveDataProps) => {
    const [liveInterval, setLiveInterval] = useState<'1s' | '1m'>('1s')
    const [liveOhlcData, setLiveOhlcData] = useState<OHLCData[]>(coinOHLCData || [])
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
    const [isLoading, setIsLoading] = useState(false)
    const [countdown, setCountdown] = useState<number>(60)

    useEffect(() => {
        const fetchLiveOHLC = async () => {
            setIsLoading(true)
            try {
                const newData = await fetcher<OHLCData[]>(`coins/${coinId}/ohlc`, {
                    vs_currency: 'usd',
                    days: 1,
                    precision: 'full'
                });

                if (newData && newData.length > 0) {
                    setLiveOhlcData(newData);
                    setLastUpdated(new Date());
                    setCountdown(60);
                }
            } catch (error) {
                console.error('Error fetching live OHLC data:', error);
            } finally {
                setIsLoading(false)
            }
        };

        // Initial fetch
        fetchLiveOHLC();

        // Poll every 60 seconds
        const pollInterval = setInterval(fetchLiveOHLC, 60000);

        return () => clearInterval(pollInterval);
    }, [coinId]);

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 60));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
    };

  
  return (
    <section id='live-data-wrapper'>

        <p>Coin Header</p>
        <Separator className='divider lg:hidden xl:hidden' />

        <div className='trend'>

            <CandlestickCharts 
                coinId={coinId} 
                data={liveOhlcData} 
                liveOhlcv={null} 
                mode='live' 
                liveInterval={liveInterval}
                setLiveInterval={setLiveInterval}
            >
                <div className='flex flex-col gap-1'>
                    <h4>Trend Overview</h4>
                    <div className='flex items-center gap-4 text-xs'>
                        <div className='flex items-center gap-2 text-gray-400'>
                            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
                            <span>Last updated: {formatTime(lastUpdated)}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className='text-purple-400 font-medium'>Next update: {countdown}s</span>
                        </div>
                    </div>
                </div>
            </CandlestickCharts>

        </div>

        <Separator className='divider lg:hidden xl:hidden' />

        <div className='mt-6'>

            <ExchangeListings tickers={coin.tickers}/>

        </div>

      
    </section>
  )
}

export default LiveDataWrapper