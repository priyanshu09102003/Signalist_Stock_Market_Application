"use client"

import React from 'react'
import DataTable from './DataTable'
import { ExternalLink } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface ExchangeListingsProps {
  tickers: Ticker[]
}

const ExchangeListings: React.FC<ExchangeListingsProps> = ({ tickers }) => {
  // Get top 10 tickers by volume
  const topTickers = tickers
    .filter(ticker => ticker.converted_last?.usd && ticker.market?.name)
    .slice(0, 10);

  const columns = [
    {
      header: '#',
      cell: (_: Ticker, index: number) => (
        <span className="text-gray-400 font-medium">{index + 1}</span>
      ),
      headClassName: 'w-12'
    },
    {
      header: 'Exchange',
      cell: (ticker: Ticker) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-dark-400 flex items-center justify-center overflow-hidden">
            <span className="text-xs font-bold text-purple-400">
              {ticker.market.name.substring(0, 2).toUpperCase()}
            </span>
          </div>
          <span className="font-medium text-white">{ticker.market.name}</span>
        </div>
      ),
    },
    {
      header: 'Pair',
      cell: (ticker: Ticker) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-300 font-medium">{ticker.base}</span>
          <span className="text-gray-500">/</span>
          <span className="text-gray-400">{ticker.target}</span>
        </div>
      ),
    },
    {
      header: 'Price',
      cell: (ticker: Ticker) => (
        <span className="text-white font-medium">
          {formatCurrency(ticker.converted_last.usd)}
        </span>
      ),
    },
    {
      header: 'Last Traded',
      cell: (ticker: Ticker) => {
        const date = new Date(ticker.timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        let timeAgo = '';
        if (diffDays > 0) timeAgo = `${diffDays}d ago`;
        else if (diffHours > 0) timeAgo = `${diffHours}h ago`;
        else if (diffMins > 0) timeAgo = `${diffMins}m ago`;
        else timeAgo = 'Just now';

        return <span className="text-gray-400">{timeAgo}</span>;
      },
    },
    {
      header: 'Trade',
      cell: (ticker: Ticker) => (
        <a
          href={ticker.trade_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
        >
          <span>Trade</span>
          <ExternalLink size={14} />
        </a>
      ),
      headClassName: 'text-right',
      cellClassName: 'text-right'
    },
  ];

  if (topTickers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No exchange listings available
      </div>
    );
  }

  return (
    <div className="w-full">
      <h4 className="text-xl font-semibold mb-4">Exchange Listings</h4>
      <DataTable
        columns={columns}
        data={topTickers}
        rowKey={(ticker, index) => `${ticker.market.name}-${ticker.base}-${index}`}
        tableClassName="w-full"
      />
    </div>
  );
};

export default ExchangeListings;