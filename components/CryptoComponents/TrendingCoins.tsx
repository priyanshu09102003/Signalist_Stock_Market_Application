import { fetcher } from '@/lib/actions/coingecko.actions';
import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import DataTable from './DataTable';

const TrendingCoins = async () => {
    const trendingCoins = await fetcher<{coins: TrendingCoin[]}>('/search/trending', undefined, 300);

const columns: DataTableColumn<TrendingCoin>[] = [
  {header: 'Name', 
  cellClassName: 'name-cell', 
  cell: (coin) => {
    const item = coin.item;

    return(
      <Link href={`/coins/${item.id}`}>

        <Image src={item.large} alt={item.name} width={36} height={36} />
        <p>{item.name}</p>
      
      </Link>
    )
  }
},

  {header: '24h Change',
    cellClassName: 'change-cell',
    cell: (coin) => {
      const item = coin.item;
      const isTrendingUp = item.data.price_change_percentage_24h.usd > 0;

      return(
        <div className={cn('price-change', isTrendingUp ? 'text-green-500': 'text-red-500')}>

          
            {isTrendingUp ? (
              <TrendingUp width={16} height={16} />
            ) : (
              <TrendingDown width={16} height={16} />
            )}
            {Math.abs(item.data.price_change_percentage_24h.usd).toFixed(2)}%
          

        </div>
      )
    
  }

},

{header: 'Price',
  cellClassName: 'price-cell',
  cell: (coin)=> coin.item.data.price
}

]


  return (
    <div id='trending-coins'>
        
        <h4>Trending Coins</h4>

        <DataTable
        data={trendingCoins.coins.slice(0,8)|| []}
        columns={columns}
        rowKey={(coin) => coin.item.id}
        tableClassName='trending-coins-table'
        headerCellClassName='!py-3'
        bodyCellClassName='!py-2'
        />
    
    </div>
  )
}

export default TrendingCoins