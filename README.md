<div align="center">
  <img src="./public/thumbnail.webp" alt="Signalist Banner" width="100%">
  
  <h1>📈 Signalist</h1>
  <p><strong>Real-Time Market Intelligence for Stocks & Cryptocurrencies</strong></p>
  
  ![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript)
  ![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
  
  <p>
    <a href="#-application-overview">Overview</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-dashboard">Dashboard</a> •
    <a href="#-global-search">Global Search</a> •
    <a href="#-contributing">Contributing</a>
  </p>
</div>

---

## 📊 Application Overview

**Signalist** is a comprehensive real-time market intelligence platform for stocks and cryptocurrencies. Built with modern technologies including Next.js, Shadcn UI, Better Auth, and Inngest, Signalist empowers traders and investors with actionable insights through live price tracking, customizable alerts, advanced analytics, and automated workflows.

### Key Features

* **Real-time Market Data**: Live stock and crypto price tracking with sub-second updates
* **Smart Alerts**: Set custom price alerts and automated notifications via Inngest workflows
* **Advanced Charting**: Interactive charts with technical indicators and historical data visualization
* **Market Heatmaps**: Visual representation of market movements across sectors and assets
* **AI-Powered Predictions**: Buy/sell signal recommendations based on market analysis
* **Crypto Dashboard**: Comprehensive cryptocurrency tracking with price converters and exchange listings
* **Personalized Watchlists**: Organize and monitor your favorite assets in one place
* **Secure Authentication**: User management powered by Better Auth

Built for both casual investors and active traders seeking a unified platform for market analysis and portfolio management.

---

## 🚀 Getting Started

### For New Users

<table>
<tr>
<td width="50%">

<img src="./public/sign-up.png" alt="Signup Process" width="100%">

</td>
<td width="50%">

#### Create Your Account

1. **Sign Up**: Navigate to the signup page and create your account with your email and password
2. **Personalize Your Experience**: Choose your investment preferences, favorite markets, and alert settings
3. **Automated Onboarding**: Upon registration, you'll receive a personalized welcome email tailored to your chosen options
4. **Smart Workflows**: Behind the scenes, Inngest workflows automatically fetch and curate content relevant to your interests
5. **Get Started**: You'll be guided through your personalized dashboard with recommendations based on your preferences

Our intelligent onboarding ensures you see the most relevant market data from day one.

</td>
</tr>
</table>

---

### For Existing Users

<table>
<tr>
<td width="50%">

<img src="./public/sign-in.png" alt="Signin Process" width="100%">

</td>
<td width="50%">

#### Welcome Back

1. **Sign In**: Use your registered email and password to access your account
2. **Secure Authentication**: Powered by Better Auth for enterprise-grade security
3. **Instant Access**: Get redirected directly to your personalized dashboard
4. **Resume Tracking**: Your watchlists, alerts, and preferences are automatically loaded
5. **Real-Time Updates**: Start monitoring live market data immediately upon login

Your session is securely managed, keeping your financial data safe and private.

</td>
</tr>
</table>

---

## 📈 Dashboard

<div align="center">
  <img src="./public/dashboard.png" alt="Signalist Dashboard" width="100%" style="max-height: 300px; object-fit: cover;">
</div>

Once you sign in or complete the onboarding process, you'll be redirected to your personalized dashboard—your command center for all market intelligence. The dashboard is designed to give you a comprehensive view of the markets at a glance, combining real-time data with intelligent visualization.

### Market Overview

The **Market Overview** section provides a bird's-eye view of major market indices and sectors. Track the performance of Financial, Technology, and Services sectors through interactive line charts that display historical trends and current movements. Below the chart, you'll find a curated list of major global indices including:

- **JPMorgan Chase** - Leading financial institution performance
- **Wells Fargo** - Banking sector insights
- **Bank of America Corp** - Major bank tracking
- **HSBC Holdings** - International banking perspective
- **Citigroup Inc** - Financial services monitoring
- **Mastercard Incorporated** - Payment processing trends

Each index displays real-time pricing with percentage changes and absolute value movements, color-coded for quick visual reference (red for losses, green for gains).

### Stocks Heatmap

The **Stocks Heatmap** offers a visual representation of market movements across different sectors and companies. This powerful tool allows you to:

- **Identify Trends**: Quickly spot which sectors are gaining or losing momentum
- **Compare Performance**: See relative performance across industries at a glance
- **Sector Analysis**: Toggle between Electronic Technology, Technology Services, Health Technology, Finance, Consumer Services, and more
- **Company-Level Detail**: Drill down to individual stocks like NVDA, GOOGL, META, AAPL, AMZN, and others

The heatmap uses color intensity to represent percentage changes—deeper red indicates larger losses, while deeper green shows stronger gains. Block size represents market capitalization or trading volume, giving you context on each stock's market significance.

### Top Stories

Stay informed with the **Top Stories** section, which aggregates the latest market-moving news:

- Real-time news updates from major financial publications
- Company-specific announcements and earnings reports
- Market analysis and expert commentary
- Sector-wide developments and regulatory changes

Recent stories include major events like "Google: Alphabet Stock Crowned as 2023's Big Tech Winner," "Nike Stock Crashes 10% Despite Revenue Beat," and AI-related market movements. Each story is timestamped and sourced, allowing you to track when information becomes available.

### Financial Tables

At the bottom of the dashboard, detailed **financial tables** break down market data by sector:

**Financial Sector**: Track major banks and financial institutions with columns for Value, Change (absolute and percentage), Open, and High prices.

**Technology Sector**: Monitor tech giants like Apple, Alphabet, Microsoft, Meta Platforms, Oracle Corp, and Intel Corp with comprehensive price data and daily movements.

All data updates in real-time, ensuring you're always working with the most current market information available.

---

## 🔍 Global Search

<div align="center">
  <img src="./public/search.png" alt="Global Search Feature" width="100%" style="max-height: 500px; object-fit: cover;">
</div>

Signalist features a powerful **Global Search** functionality that puts thousands of stocks at your fingertips. Access it instantly using the keyboard shortcut **Ctrl+K** (Windows/Linux) or **⌘K** (Mac) from anywhere in the application.

### Quick Access to Any Stock

The search modal provides:

- **Instant Search**: Type any company name or stock ticker to find relevant matches
- **Real-time Results**: Search results appear as you type, powered by the Finnhub API
- **Popular Stocks**: Always displays the top 10 most popular global stocks for quick access, including:
  - **Apple Inc** (AAPL) - Technology leader
  - **Microsoft Corp** (MSFT) - Software giant
  - **Alphabet Inc** (GOOGL) - Search and cloud services
  - **Amazon.com Inc** (AMZN) - E-commerce and cloud computing
  - **Tesla Inc** (TSLA) - Electric vehicle manufacturer
  - **Meta Platforms Inc** (META) - Social media conglomerate
  - **NVIDIA Corp** (NVDA) - Graphics and AI chips

### Comprehensive Stock Information

Each search result displays:

- Company full name and stock ticker symbol
- Stock type (Common Stock, Preferred Stock, etc.)
- Real-time trend indicators showing price direction
- Quick navigation to detailed stock pages

### Seamless Navigation

Simply click on any stock from the search results to be instantly redirected to its detailed view, where you can access:

- Live price charts and historical data
- Technical indicators and analysis
- Company fundamentals and news
- Add to watchlist functionality
- Set custom price alerts

The global search ensures you can track any publicly traded company worldwide, making Signalist your comprehensive market intelligence platform regardless of which stocks you're interested in.

---

*Ready for the next section!*


