'use client';

import React, { useState } from 'react';
import {
    Search, Bell,
    // ChevronDown 
} from 'lucide-react';
// import { useNetworkConnection } from '@/hooks/useNetwork';

// type BalanceUnit = 'USD' | 'ETH' | 'BTC';

const TopNav: React.FC = () => {
    // const [balanceUnit, setBalanceUnit] = useState<BalanceUnit>('USD');
    // const { network, setNetwork } = useNetworkConnection();
    // const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = useState(false);
    // const [isBalanceUnitDropdownOpen, setIsBalanceUnitDropdownOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    return (
        <nav className="p-3 pl-1">
            <section className="bg-gray-900 rounded-xl text-white p-4 border-b border-gray-800">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0 max-w-xs">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="search"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* <div className="relative hidden md:block">
                            <button
                                onClick={() => setIsNetworkDropdownOpen(!isNetworkDropdownOpen)}
                                aria-expanded={isNetworkDropdownOpen}
                                className="flex items-center justify-between w-32 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <span>{network}</span>
                                <ChevronDown className="h-4 w-4 ml-2" />
                            </button>
                            {isNetworkDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-32 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
                                    {['mainnet', 'devnet', 'testnet'].map((net) => (
                                        <button
                                            key={net}
                                            onClick={() => {
                                                setNetwork(net as 'mainnet' | 'devnet' | 'testnet');
                                                setIsNetworkDropdownOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                                        >
                                            {net}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="relative hidden md:block">
                            <button
                                onClick={() => setIsBalanceUnitDropdownOpen(!isBalanceUnitDropdownOpen)}
                                className="flex items-center justify-between w-24 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <span>{balanceUnit}</span>
                                <ChevronDown className="h-4 w-4 ml-2" />
                            </button>
                            {isBalanceUnitDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-24 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
                                    {['USD', 'ETH', 'BTC'].map((unit) => (
                                        <button
                                            key={unit}
                                            onClick={() => {
                                                setBalanceUnit(unit as BalanceUnit);
                                                setIsBalanceUnitDropdownOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                                        >
                                            {unit}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div> */}

                        <button className="p-2 rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <Bell className="h-5 w-5" />
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full"
                            >
                                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                                    <span className="text-sm font-medium">US</span>
                                </div>
                            </button>
                            {isProfileDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
                                    <div className="px-4 py-3 border-b border-gray-700">
                                        <p className="text-sm font-medium">username</p>
                                        <p className="text-xs text-gray-400">user@example.com</p>
                                    </div>
                                    <div className="py-1">
                                        <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700">Profile</button>
                                        <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700">Settings</button>
                                        <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700">Log out</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </nav>
    );
};

export default TopNav;
