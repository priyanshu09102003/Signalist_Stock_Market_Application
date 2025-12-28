"use client"

import React, { useEffect, useState } from 'react'
import { fetcher } from '@/lib/actions/coingecko.actions'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface CoinHistoryProps {
  coinId: string
  currentPrice: number
}

interface HistoricalData {
  prices: [number, number][]
}

const CoinHistory: React.FC<CoinHistoryProps> = ({ coinId, currentPrice }) => {
  const [historyData, setHistoryData] = useState<{
    [key: string]: { 
      price: number
      change: number
      changePercent: number
      chartData: { value: number }[]
    }
  }>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        setLoading(true)

        // Fetch data sequentially with delays to avoid rate limiting
        const data7d = await fetcher<HistoricalData>(`coins/${coinId}/market_chart`, {
          vs_currency: 'usd',
          days: 7,
        })
        
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const data30d = await fetcher<HistoricalData>(`coins/${coinId}/market_chart`, {
          vs_currency: 'usd',
          days: 30,
        })
        
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const data90d = await fetcher<HistoricalData>(`coins/${coinId}/market_chart`, {
          vs_currency: 'usd',
          days: 90,
        })
        
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const data365d = await fetcher<HistoricalData>(`coins/${coinId}/market_chart`, {
          vs_currency: 'usd',
          days: 365,
        })

        const calculateChange = (data: HistoricalData) => {
          if (!data?.prices || data.prices.length === 0) {
            return { 
              price: 0, 
              change: 0, 
              changePercent: 0,
              chartData: []
            }
          }
          
          const oldPrice = data.prices[0][1]
          const change = currentPrice - oldPrice
          const changePercent = (change / oldPrice) * 100

          // Create chart data from prices 
          const sampleRate = Math.ceil(data.prices.length / 20) // Max 20 points
          const chartData = data.prices
            .filter((_, i) => i % sampleRate === 0)
            .map(([_, price]) => ({ value: price }))

          return { price: oldPrice, change, changePercent, chartData }
        }

        setHistoryData({
          '7d': calculateChange(data7d),
          '30d': calculateChange(data30d),
          '90d': calculateChange(data90d),
          '1y': calculateChange(data365d),
        })
      } catch (error) {
        console.error('Error fetching historical data:', error)
        // Set empty data on error
        setHistoryData({
          '7d': { price: 0, change: 0, changePercent: 0, chartData: [] },
          '30d': { price: 0, change: 0, changePercent: 0, chartData: [] },
          '90d': { price: 0, change: 0, changePercent: 0, chartData: [] },
          '1y': { price: 0, change: 0, changePercent: 0, chartData: [] },
        })
      } finally {
        setLoading(false)
      }
    }

    fetchHistoricalData()
  }, [coinId, currentPrice])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  const coinHistory = [
    {
      label: '7 Days Ago',
      period: '7d',
    },
    {
      label: '30 Days Ago',
      period: '30d',
    },
    {
      label: '90 Days Ago',
      period: '90d',
    },
    {
      label: '1 Year Ago',
      period: '1y',
    },
  ]

  if (loading) {
    return (
      <div className='details'>
        <h4>Coin History</h4>
        <ul className='details-grid'>
          {[1, 2, 3, 4].map((i) => (
            <li key={i}>
              <p className='text-gray-400'>Loading...</p>
              <p className='text-base font-medium'>--</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className='details'>
      <h4>Coin History</h4>
      <ul className='details-grid'>
        {coinHistory.map(({ label, period }) => {
          const data = historyData[period]
          if (!data || data.price === 0) {
            return (
              <li key={period}>
                <p className={label}>{label}</p>
                <p className='text-sm text-gray-500'>Data unavailable</p>
              </li>
            )
          }

          const isPositive = data.changePercent >= 0

          return (
            <li key={period}>
              <p className={label}>{label}</p>
              <div className='flex flex-col gap-2'>
                <p className='text-base font-medium'>{formatCurrency(data.price)}</p>
                <div className='flex items-center gap-2'>
                  {isPositive ? (
                    <TrendingUp size={14} className='text-green-500' />
                  ) : (
                    <TrendingDown size={14} className='text-red-500' />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      isPositive ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {formatPercent(data.changePercent)}
                  </span>
                </div>
                {data.chartData.length > 0 && (
                  <div className='w-full h-12 mt-1'>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.chartData}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={isPositive ? '#22c55e' : '#ef4444'}
                          strokeWidth={1.5}
                          dot={false}
                          animationDuration={300}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default CoinHistory