"use client"

import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Header = () => {
    const pathname = usePathname();
    
  return (
   <header>
        <div className='main-container inner'>
                <nav className="ml-auto">

                      <Link href="/crypto"
                    className={cn('nav-link' , {
                        'is-active': pathname === '/crypto'
                    })}
                    >
                    Explore</Link>


                    <p>Search Coins</p>

                    <Link href="/coins"
                    className={cn('nav-link' , {
                        'is-active': pathname === '/coins'
                    })}
                    >
                    All Coins</Link>

                </nav>
        </div>
   </header>
  )
}

export default Header