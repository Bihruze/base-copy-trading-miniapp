# Copy Trading Pro - Base Mini App

A powerful copy trading application built for the Base ecosystem, allowing users to follow and automatically copy successful traders.

## 🚀 Features

- **Trader Discovery**: Find and follow top-performing traders
- **Auto Copy Trading**: Automatically copy trades from successful traders
- **Portfolio Management**: Track your performance and P&L
- **Social Features**: Follow traders, see their performance
- **Risk Management**: Set stop-loss and take-profit levels
- **Real-time Updates**: Live trading data and notifications

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Blockchain**: Base Network, Smart Contracts
- **SDK**: Base Mini App SDK
- **Charts**: Recharts

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd copy-trading-miniapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Base Mini App Setup

### 1. Install Base Mini App SDK
```bash
npm install @farcaster/miniapp-sdk
```

### 2. Initialize SDK in your app
```typescript
import { sdk } from '@farcaster/miniapp-sdk';

// Once app is ready to be displayed
await sdk.actions.ready();
```

### 3. Create Manifest File
Create `public/.well-known/farcaster.json` with your app details:

```json
{
  "accountAssociation": {
    "header": "",
    "payload": "",
    "signature": ""
  },
  "baseBuilder": {
    "allowedAddresses": [""]
  },
  "miniapp": {
    "version": "1",
    "name": "Copy Trading Pro",
    "homeUrl": "https://your-domain.com",
    "iconUrl": "https://your-domain.com/icon.png",
    "splashImageUrl": "https://your-domain.com/splash.png",
    "splashBackgroundColor": "#0052FF",
    "webhookUrl": "https://your-domain.com/api/webhook",
    "subtitle": "Follow the best traders",
    "description": "Copy successful traders automatically and earn profits with minimal effort.",
    "screenshotUrls": [
      "https://your-domain.com/screenshots/1.png",
      "https://your-domain.com/screenshots/2.png"
    ],
    "primaryCategory": "finance",
    "tags": ["trading", "defi", "copy-trading", "base"],
    "heroImageUrl": "https://your-domain.com/hero.png",
    "tagline": "Copy. Trade. Earn.",
    "ogTitle": "Copy Trading Pro - Follow the Best Traders",
    "ogDescription": "Automatically copy successful traders and earn profits.",
    "ogImageUrl": "https://your-domain.com/og-image.png"
  }
}
```

### 4. Add Embed Metadata
Add to your `app/layout.tsx`:

```html
<meta name="fc:miniapp" content='{
  "version":"next",
  "imageUrl":"https://your-domain.com/embed-image.png",
  "button":{
      "title":"Start Copy Trading",
      "action":{
      "type":"launch_miniapp",
      "name":"Copy Trading Pro",
      "url":"https://your-domain.com"
      }
  }
}' />
```

## 🎨 UI Components

The app includes several key components:

- **Dashboard**: Main overview with portfolio and market data
- **TraderCard**: Individual trader performance cards
- **PortfolioOverview**: User's portfolio summary
- **TopTraders**: Leaderboard of best performers
- **ActiveCopies**: Currently active copy trades
- **MarketOverview**: Market data and trends

## 🔒 Security Features

- **Smart Contract Integration**: Secure on-chain trading
- **Risk Management**: Stop-loss and position sizing
- **Multi-signature Support**: Enhanced security for large trades
- **Emergency Stop**: Quick exit from all positions

## 📱 Mobile Optimization

The app is fully responsive and optimized for mobile devices, providing a seamless experience across all screen sizes.

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the app: `npm run build`
2. Deploy the `out` folder to your hosting provider
3. Ensure the manifest file is accessible at `/.well-known/farcaster.json`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@copy-trading-pro.com or join our Discord community.

## 🔗 Links

- [Base Documentation](https://docs.base.org)
- [Base Mini Apps Guide](https://docs.base.org/mini-apps)
- [Base Build](https://build.base.org)
