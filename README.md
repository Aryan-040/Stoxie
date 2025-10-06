# 📈 Stoxie

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![MongoDB](https://img.shields.io/badge/MongoDB-6.20.0-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-blue)

**Stoxie** is a modern stock tracking web application that helps users monitor their favorite stocks, manage personalized watchlists, and receive daily stock news via email. Built with Next.js and MongoDB, Stoxie provides real-time market data and personalized stock alerts to keep you informed about your investments.

## ✨ Key Features

- **📋 Watchlist Management** - Add, remove, and organize your favorite stocks in a personalized watchlist
- **📰 Daily Stock News** - Receive curated stock news and market updates via email
- **💹 Real-time Prices** - Track stock prices and market changes in real-time
- **📬 Personalized Email Alerts** - Get notified about significant price movements for stocks you care about
- **📊 Watchlist Overview** - View comprehensive data about your watchlist stocks including price, change, market cap, and P/E ratio

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/), [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [Node.js](https://nodejs.org/), [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- **Database**: [MongoDB](https://www.mongodb.com/), [Mongoose](https://mongoosejs.com/)
- **Authentication**: [Better Auth](https://www.npmjs.com/package/better-auth)
- **Email**: [Nodemailer](https://nodemailer.com/)
- **Background Jobs**: [Inngest](https://www.inngest.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Stock Data**: [Finnhub API](https://finnhub.io/)

## 🚀 Installation and Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB database

### Steps

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/stoxie.git
cd stoxie
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Set up environment variables**

Create a `.env` file in the root directory with the following variables:

```
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Authentication
AUTH_SECRET=your_auth_secret_key

# Finnhub API
NEXT_PUBLIC_FINNHUB_API_KEY=your_finnhub_api_key

# Email (Nodemailer)
EMAIL_SERVER_USER=your_email_address
EMAIL_SERVER_PASSWORD=your_email_password
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_FROM=noreply@yourdomain.com
```

4. **Run the development server**

```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000) to see the application.



## 📁 Project Structure

```
stoxie/
├── app/                  # Next.js app directory
│   ├── (auth)/           # Authentication routes
│   ├── (root)/           # Main application routes
│   ├── api/              # API routes
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── forms/            # Form components
│   ├── ui/               # UI components
│   └── ...
├── database/             # Database models and connection
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and actions
│   ├── actions/          # Server actions
│   ├── better-auth/      # Authentication setup
│   ├── inngest/          # Background jobs
│   └── nodemailer/       # Email templates
├── middleware/           # Next.js middleware
├── public/               # Static assets
│   └── assets/
├── types/                # TypeScript type definitions
└── ...
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [MongoDB](https://www.mongodb.com/) for the database
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Finnhub](https://finnhub.io/) for stock market data
- [Shadcn UI](https://ui.shadcn.com/) for beautiful UI components

---

