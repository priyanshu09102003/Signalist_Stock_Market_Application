'use client'

import React, { useState } from 'react'
import { Input } from '../ui/input';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const Converter = ({symbol , icon, priceList}:ConverterProps) => {
    const[currency, setCurrency] = useState('usd');
    const [amount, setAmount] = useState('10');

    const convertedPrice = (parseFloat(amount)||0) * (priceList[currency] || 0)
    
  return (
    <div id='converter'>
        <h4>{symbol.toUpperCase()} Converter</h4>

        <div className='panel'>

            <div className='input-wrapper !bg-dark-700'>

                <Input type='number' placeholder='Amount' value={amount} onChange={(e) => setAmount(e.target.value)} className='input !bg-dark-700' />

                <div className='coin-info'>

                    <Image src={icon} alt={symbol} height={20} width={20} />
                    <p>{symbol.toUpperCase()}</p>
                </div>

            </div>

            <div className='divider'>

                <div className='line !bg-dark-700'/>

                <Image src="/assets/icons/converter.svg" alt='converter' width={32} height={32} className='icon !bg-dark-700' />

            </div>

            <div className='output-wrapper !bg-dark-700'>
                <p>{formatCurrency(convertedPrice, 2, currency, false)}</p>

                <Select value={currency} onValueChange={setCurrency} >

                    <SelectTrigger className='select-trigger_two !bg-dark-700' value={currency}>
                        <SelectValue placeholder="Select" className='select-value !bg-dark-700'>
                            {currency.toUpperCase()}
                        </SelectValue>
                    </SelectTrigger>

                    <SelectContent className='select-content !bg-dark-700' data-converter>
                        {
                            Object.keys(priceList).map((currencyCode)=> (
                                <SelectItem value={currencyCode} key={currencyCode} className='select-item !bg-dark-700'>

                                    {currencyCode.toUpperCase()}

                                </SelectItem>
                            ))
                        }

                    </SelectContent>


                </Select>

            </div>


        </div>
      
    </div>
  )
}

export default Converter