"use client"

import { fetcher } from '@/lib/actions/coingecko.actions';
import { getCandlestickConfig, getChartConfig, PERIOD_BUTTONS, PERIOD_CONFIG } from '@/lib/constants'
import { convertOHLCData } from '@/lib/utils';
import { CandlestickSeries, createChart, IChartApi, ISeriesApi } from 'lightweight-charts';
import React, { useEffect, useRef, useState, useTransition } from 'react'

const CandlestickCharts = ({children, data, coinId, height = 420, initialPeriod = 'daily'}:CandlestickChartProps) => {
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null)

    const [loading, setLoading] = useState(false);
    const [period, setPeriod] = useState(initialPeriod)
    const [ohlcData, setOhlcData] = useState<OHLCData[]>(data ?? []);
    const [isPending, startTransition] = useTransition();

    const fetchOHLCData = async (selectedPeriod: Period) => {
    setLoading(true);
    try {

        const {days, interval} = PERIOD_CONFIG[selectedPeriod]
        const newData = await fetcher<(OHLCData[])>(`coins/${coinId}/ohlc`, {
                vs_currency: 'usd',
                days,
                ...(interval && { interval }), 
                precision: 'full'
        });
        setOhlcData(newData ?? [])

    } catch (error) {
        console.error("Failed to fetch OHLC Data:", error)
    } finally {
        setLoading(false);
    }
}

    const handlePeriodChange = (newPeriod: Period) => {
        if(newPeriod === period) return;

        //Update PERIOD
        startTransition(async() => {
            setPeriod(newPeriod)
            await fetchOHLCData(newPeriod)
        })
    }

    useEffect(() => {
        const container = chartContainerRef.current;

        if(!container)return;

        const showTime = ['daily' , 'weekly' , 'monthly'].includes(period);

        const chart = createChart(container, {
            ...getChartConfig(height, showTime),
            width: container.clientWidth
        });

        chartRef.current = chart;

        const series = chart.addSeries(CandlestickSeries, getCandlestickConfig());
        candleSeriesRef.current = series;

        const convertedToSeconds = ohlcData.map(
        (item) => [Math.floor(item[0] / 1000), item[1], item[2], item[3], item[4]] as OHLCData,);

    series.setData(convertOHLCData(convertedToSeconds));
    chart.timeScale().fitContent();

        series.setData(convertOHLCData(ohlcData));
        chart.timeScale().fitContent();

        const handleResize = () => {
            if(container && chartRef.current) {
                chartRef.current.applyOptions({
                    width: container.clientWidth
                });
            }
        };



        chartRef.current = chart;
        candleSeriesRef.current = series;

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
            chartRef.current = null;
            candleSeriesRef.current = null
        };
    }, [height, period])

    useEffect(() => {
        if(!candleSeriesRef.current)return;

        const convertedToSeconds = ohlcData.map((item) => 
            [Math.floor(item[0] / 1000), item[1], item[2], item[3], item[4]] as OHLCData,
        )

        const converted = convertOHLCData(convertedToSeconds);
        candleSeriesRef.current.setData(converted);
        chartRef.current?.timeScale().fitContent()

    }, [ohlcData, period])
    
  return (
    <div id='candlestick-chart' className='w-full max-w-full overflow-hidden'>

        <div className='chart-header'>
            <div className='flex-1'>

                {children}

            </div>


            <div className='button-group'>

                <span className='text-sm mx-2 font-medium text-purple-100/50'>Period:</span>

                {
                    PERIOD_BUTTONS.map(({value, label}) => (

                        <button key={value} className={period === value ? 'config-button-active' : 'config-button'} onClick={() => handlePeriodChange(value)} disabled={isPending}>{label}</button>
                    ))
                }

            </div>

        </div>

        <div ref={chartContainerRef} className='chart w-full max-w-full' style={{height}} />
      
    </div>
  )
}

export default CandlestickCharts