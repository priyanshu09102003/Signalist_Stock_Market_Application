
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Trash2, TrendingUp, TrendingDown } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { removeFromWatchlist } from "@/lib/actions/watchlist.actions"

interface WatchlistStock {
  symbol: string
  company: string
  addedAt: string
}

interface StockQuote {
  c: number // Current price
  d: number // Change
  dp: number // Percent change
  h: number // High price of the day
  l: number // Low price of the day
  o: number // Open price of the day
  pc: number // Previous close price
}

interface StockProfile {
  marketCapitalization: number
}

interface EnhancedStock extends WatchlistStock {
  currentPrice?: number
  priceChange?: number
  priceChangePercent?: number
  marketCap?: number
  loading?: boolean
}

interface WatchlistTableProps {
  stocks: WatchlistStock[]
  userEmail: string
  finnhubApiKey: string
}

const ITEMS_PER_PAGE = 10

export default function WatchlistTable({ stocks, userEmail, finnhubApiKey }: WatchlistTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [localStocks, setLocalStocks] = useState<EnhancedStock[]>(
    stocks.map(stock => ({ ...stock, loading: true }))
  )
  const [loading, setLoading] = useState<string | null>(null)

  // Fetch real-time stock data on component mount and when stocks change
  useEffect(() => {
    const fetchStockData = async () => {
      const updatedStocks = await Promise.all(
        stocks.map(async (stock) => {
          try {
            // Fetch quote data (price, change, etc.)
            const quoteResponse = await fetch(
              `https://finnhub.io/api/v1/quote?symbol=${stock.symbol}&token=${finnhubApiKey}`
            )
            const quoteData: StockQuote = await quoteResponse.json()

            // Fetch profile data for market cap
            const profileResponse = await fetch(
              `https://finnhub.io/api/v1/stock/profile2?symbol=${stock.symbol}&token=${finnhubApiKey}`
            )
            const profileData: StockProfile = await profileResponse.json()

            return {
              ...stock,
              currentPrice: quoteData.c,
              priceChange: quoteData.d,
              priceChangePercent: quoteData.dp,
              marketCap: profileData.marketCapitalization,
              loading: false,
            }
          } catch (error) {
            console.error(`Failed to fetch data for ${stock.symbol}:`, error)
            return {
              ...stock,
              loading: false,
            }
          }
        })
      )

      setLocalStocks(updatedStocks)
    }

    if (stocks.length > 0) {
      fetchStockData()
    }
  }, [stocks, finnhubApiKey])

  const totalPages = Math.ceil(localStocks.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentStocks = localStocks.slice(startIndex, endIndex)

  const handleRemove = async (symbol: string) => {
    setLoading(symbol)

    try {
      const result = await removeFromWatchlist(userEmail, symbol)
      
      if (result.success) {
        setLocalStocks(prev => prev.filter(stock => stock.symbol !== symbol))

        // Adjust current page if needed
        const newTotalPages = Math.ceil((localStocks.length - 1) / ITEMS_PER_PAGE)
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages)
        }
      }
    } catch (error) {
      console.error('Failed to remove stock:', error)
    } finally {
      setLoading(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatMarketCap = (marketCap?: number) => {
    if (!marketCap) return 'N/A'
    
    // Market cap is in billions
    if (marketCap >= 1000) {
      return `$${(marketCap / 1000).toFixed(2)}T`
    } else if (marketCap >= 1) {
      return `$${marketCap.toFixed(2)}B`
    } else {
      return `$${(marketCap * 1000).toFixed(2)}M`
    }
  }

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A'
    return `$${price.toFixed(2)}`
  }

  const formatPercentChange = (percent?: number) => {
    if (percent === undefined) return 'N/A'
    const sign = percent >= 0 ? '+' : ''
    return `${sign}${percent.toFixed(2)}%`
  }

  return (
    <div className="space-y-6">
      <div className="watchlist-table overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="table-header-row">
              <TableHead className="table-header">Company</TableHead>
              <TableHead className="table-header">Symbol</TableHead>
              <TableHead className="table-header text-right">Price</TableHead>
              <TableHead className="table-header text-right">Change %</TableHead>
              <TableHead className="table-header text-right">Market Cap</TableHead>
              <TableHead className="table-header">Added On</TableHead>
              <TableHead className="table-header text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentStocks.map((stock) => (
              <TableRow key={stock.symbol} className="table-row">
                <TableCell className="table-cell">
                  <Link 
                    href={`/stocks/${stock.symbol}`}
                    className="hover:text-yellow-500 transition-colors font-medium"
                  >
                    {stock.company}
                  </Link>
                </TableCell>
                <TableCell className="table-cell">
                  <Link 
                    href={`/stocks/${stock.symbol}`}
                    className="hover:text-yellow-500 transition-colors"
                  >
                    {stock.symbol}
                  </Link>
                </TableCell>
                <TableCell className="table-cell text-right font-medium">
                  {stock.loading ? (
                    <span className="text-gray-500">Loading...</span>
                  ) : (
                    formatPrice(stock.currentPrice)
                  )}
                </TableCell>
                <TableCell className="table-cell text-right">
                  {stock.loading ? (
                    <span className="text-gray-500">-</span>
                  ) : (
                    <div className="flex items-center justify-end gap-1">
                      {stock.priceChangePercent !== undefined && stock.priceChangePercent >= 0 ? (
                        <>
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-green-500 font-medium">
                            {formatPercentChange(stock.priceChangePercent)}
                          </span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-4 h-4 text-red-500" />
                          <span className="text-red-500 font-medium">
                            {formatPercentChange(stock.priceChangePercent)}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell className="table-cell text-right text-gray-300">
                  {stock.loading ? (
                    <span className="text-gray-500">-</span>
                  ) : (
                    formatMarketCap(stock.marketCap)
                  )}
                </TableCell>
                <TableCell className="table-cell text-gray-400">
                  {formatDate(stock.addedAt)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(stock.symbol)}
                    disabled={loading === stock.symbol}
                    className="watchlist-icon-btn hover:bg-red-500/10"
                  >
                    <Trash2 className="trash-icon w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}