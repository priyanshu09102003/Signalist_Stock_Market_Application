
import { headers } from "next/headers"
import { getWatchlistStocks } from "@/lib/actions/watchlist.actions"
import WatchlistTable from "@/components/WatchlistTable"
import { Star } from "lucide-react"
import Link from "next/link"
import { auth } from "@/lib/better-auth/auth"

export default async function WatchlistPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.email) {
    return (
      <div className="watchlist-empty-container">
        <div className="watchlist-empty">
          <Star className="watchlist-star" />
          <h2 className="empty-title">Sign in to view your watchlist</h2>
          <p className="empty-description">
            Create an account or sign in to start tracking your favorite stocks.
          </p>
          <Link href="/sign-in" className="yellow-btn px-6">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  const watchlistStocks = await getWatchlistStocks(session.user.email)

  if (watchlistStocks.length === 0) {
    return (
      <div className="watchlist-empty-container">
        <div className="watchlist-empty">
          <Star className="watchlist-star" />
          <h2 className="empty-title">Your watchlist is empty</h2>
          <p className="empty-description">
            Start adding stocks to your watchlist to track their performance and stay updated.
          </p>
        </div>
      </div>
    )
  }

  // Get Finnhub API key from environment variables
  const finnhubApiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || ""

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="watchlist-title mb-2">My Watchlist</h1>
        <p className="text-gray-500">
          Track your favorite stocks and stay updated on their performance
        </p>
      </div>
      <WatchlistTable 
        stocks={watchlistStocks} 
        userEmail={session.user.email}
        finnhubApiKey={finnhubApiKey}
      />
    </div>
  )
}