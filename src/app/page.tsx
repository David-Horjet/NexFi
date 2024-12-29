import Link from 'next/link'
import { ArrowRight, BarChart2, Wallet, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-blue-800">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center text-white mb-16">
          <h1 className="text-5xl font-bold mb-4">NexFi Portfolio Tracker</h1>
          <p className="text-xl mb-8">Track your DeFi Portfolio with Real-Time Updates</p>
          <Link 
            href="/auth" 
            className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-colors inline-flex items-center"
          >
            Get Started
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </header>
        
        <section className="grid md:grid-cols-3 gap-8 text-white">
          <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-md">
            <Wallet className="w-12 h-12 mb-4 text-yellow-300" />
            <h2 className="text-2xl font-semibold mb-2">Multi-Wallet Support</h2>
            <p>Connect and manage multiple wallets for comprehensive tracking of your DeFi investments.</p>
          </div>
          <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-md">
            <BarChart2 className="w-12 h-12 mb-4 text-green-300" />
            <h2 className="text-2xl font-semibold mb-2">Real-Time Analytics</h2>
            <p>Get up-to-the-minute updates and insights on your portfolio's performance.</p>
          </div>
          <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-md">
            <Zap className="w-12 h-12 mb-4 text-blue-300" />
            <h2 className="text-2xl font-semibold mb-2">Quick Actions</h2>
            <p>Easily manage your assets with quick actions for common DeFi operations.</p>
          </div>
        </section>
      </div>
    </div>
  )
}

