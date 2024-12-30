## 🚀 Solana Portfolio Tracker

A real-time portfolio tracker for Solana wallets, built using Next.js, TypeScript, and powered by QuickNode Streams, Functions, and Key-Value Store.

This project provides up-to-date portfolio balances, token prices, and real-time transaction tracking for your Solana wallet.


---

🛠 Features

Real-time updates with QuickNode Streams for wallet transactions.

Dynamic token pricing fetched using QuickNode Functions and Dex APIs.

Integrated SOL value tracking with live price updates.

Optimized performance with Key-Value Store for caching token metadata and prices.

Sleek, easy-to-use UI built with Next.js and TypeScript.



---

🏗️ Getting Started

Follow these steps to run the project locally:

Prerequisites

1. Node.js (>=16.x)


2. npm or yarn


3. A QuickNode account (get started here).



Clone the Repository

git clone https://github.com/David-Horjet/NexFi.git  
cd solana-portfolio-tracker

Install Dependencies

Using npm:

npm install

Or yarn:

yarn install

Set Up Environment Variables

Create a .env.local file in the root directory and add the following variables:

NEXT_PUBLIC_SOLANA_RPC_URL="your quicknode Solana RPC URL"  
NEXT_PUBLIC_QUICKNODE_FUNCTION_RPC_URL="your quicknode function RPC URL"  
NEXT_PUBLIC_QUICKNODE_FUNCTION_API_KEY="your quicknode function API key"  
NEXTAUTH_URL="http://localhost:3000"  
NEXTAUTH_SECRET="your next-auth secret"

Replace the placeholders with your QuickNode details and secure secrets.


---

🚀 Running the App

Start the development server:

Using npm:

npm run dev

Using yarn:

yarn dev

The app will run at http://localhost:3000.


---

🛠️ Usage

1. Connect a Wallet: Enter a Solana wallet address.


2. Track Tokens: The app will fetch token balances, prices, and values.


3. Real-Time Updates: Watch as transactions update your portfolio in real time.




---

🤝 Contributions

Contributions are welcome! Open issues, fork the repository, and submit PRs to help improve this project.


---

💬 Support

If you have questions or need help, feel free to open an issue or reach out to me on Twitter (@YourTwitterHandle).


---

