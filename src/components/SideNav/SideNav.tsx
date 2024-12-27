"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/compat/router'
import { Wallet, Compass, Gift, BarChart3, MenuIcon } from 'lucide-react'
import { NextRouter } from 'next/router'

const SideNav: React.FC = () => {
    const router: NextRouter | null = useRouter()

    const navItems = [
        { name: 'Overview', href: '/', icon: BarChart3 },
        { name: 'Explore', href: '/explore', icon: Compass },
        { name: 'Rewards', href: '/rewards', icon: Gift },
    ]

    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    return (
        <>
            <section className={`block md:hidden absolute bottom-10 right-10 z-20 bg-purple-500 p-3 rounded-full animate-bounce transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-y-0' : '-translate-y-[300px]'}`}>
                <MenuIcon className='cursor-pointer' onClick={(): void => ((setIsSidebarOpen(true)))} />
            </section>

            <aside className={`absolute md:relative left-0 z-20 transform transition-transform duration-300 ease-in-out w-60 p-3 h-screen ${isSidebarOpen ? "translate-x-0" : "-translate-x-[300px] md:translate-x-0"
                }`}>

                <section className='bg-gray-900 h-full p-6 flex flex-col rounded-xl'>
                    <div className="block md:hidden absolute top-8 cursor-pointer right-8" onClick={(): void => ((setIsSidebarOpen(false)))}>x</div>
                    <div className="flex items-center mb-8">
                        <Wallet className="text-purple-500 w-8 h-8 mr-2" />
                        <h1 className="text-2xl font-bold text-white">NexusFi</h1>
                    </div>
                    <nav className="flex-grow">
                        <ul className="space-y-2">
                            {navItems.map((item) => (
                                <li key={item.name}>
                                    <Link className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${router !== null && router.pathname === item.href
                                        ? 'bg-purple-500 text-white'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                        }`} href={item.href} passHref>

                                        <item.icon className="w-5 h-5 mr-3" />
                                        {item.name}

                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="mt-auto">
                        <Link className="flex items-center p-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors duration-200" href="/settings" passHref>
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Settings
                        </Link>
                    </div>
                </section>
            </aside>
        </>
    )
}

export default SideNav

