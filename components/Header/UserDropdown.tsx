// "use client";

// import React from 'react'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { useRouter } from 'next/navigation'
// import { Button } from '../ui/button';
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { LogOutIcon } from 'lucide-react';
// import NavItems from './Navitems';
// import { signOut } from '@/lib/actions/auth.actions';

// const UserDropdown = ({user , initialStocks}:{user:User, initialStocks:StockWithWatchlistStatus[]}) => {
//     const router = useRouter();
//     const handleSignout = async() => {

//         await signOut();
//         router.push("/sign-in");
//     }

  


//   return (
//     <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//             <Button variant={"ghost"} className='flex items-center gap-3 text-gray-4 hover:text-yellow-500 cursor-pointer'>
//                 <Avatar className='h-8 w-8'>
//                     <AvatarImage src="https://github.com/shadcn.png" />
//                     <AvatarFallback className='bg-yellow-500 text-yellow-900 text-sm font-bold'>
//                         {user.name[0]}
//                     </AvatarFallback>
//                 </Avatar>

//                 <div className='hidden md:flex flex-col items-start'>

//                     <span className='text-base font-medium text-gray-400'>

//                         {user.name}

//                     </span>

//                 </div>

//             </Button>
//         </DropdownMenuTrigger>


//             <DropdownMenuContent className='text-gray-400'>

//                 <DropdownMenuLabel>
//                     <div className='flex relative items-center gap-3 py-2'>

//                         <Avatar className='h-10 w-10'>
//                                 <AvatarImage src="https://github.com/shadcn.png" />
//                                 <AvatarFallback className='bg-yellow-500 text-yellow-900 text-sm font-bold'>
//                                     {user.name[0]}
//                                 </AvatarFallback>
//                         </Avatar>

//                         <div className='flex flex-col'>

//                             <span className='text-base font-medium text-gray-400'>

//                                 {user.name}

//                             </span>

//                             <span className='text-sm text-gray-500'>
//                                 {user.email}
//                             </span>

//                         </div>

//                     </div>
//                 </DropdownMenuLabel>

//                  <DropdownMenuSeparator className='bg-gray-600 hidden ' />
//                 <nav className='sm:hidden'>

//                     <NavItems
//                     initialStocks={initialStocks}
//                     />

//                 </nav>

//                 <DropdownMenuSeparator className='bg-gray-600' />

//                 <DropdownMenuItem onClick={handleSignout} className='text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition-colors cursor-pointer'>

//                     <LogOutIcon className='h-4 w-4 mr-2 hidden sm:block' />
//                     Logout

//                 </DropdownMenuItem>

               



//             </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }

// export default UserDropdown


"use client";

import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOutIcon } from 'lucide-react';
import NavItems from './Navitems';
import { signOut } from '@/lib/actions/auth.actions';

const UserDropdown = ({user , initialStocks}:{user:User, initialStocks:StockWithWatchlistStatus[]}) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    
    const handleSignout = async() => {
        setOpen(false);
        await signOut();
        router.push("/sign-in");
    }

  


  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} className='flex items-center gap-3 text-gray-4 hover:text-yellow-500 cursor-pointer'>
                <Avatar className='h-8 w-8'>
                    <AvatarFallback className='bg-yellow-500 text-yellow-900 text-sm font-bold'>
                        {user.name[0]}
                    </AvatarFallback>
                </Avatar>

                <div className='hidden md:flex flex-col items-start'>

                    <span className='text-base font-medium text-gray-400'>

                        {user.name}

                    </span>

                </div>

            </Button>
        </DropdownMenuTrigger>


            <DropdownMenuContent className='text-gray-400'>

                <DropdownMenuLabel>
                    <div className='flex relative items-center gap-3 py-2'>

                        <Avatar className='h-10 w-10'>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback className='bg-yellow-500 text-yellow-900 text-sm font-bold'>
                                    {user.name[0]}
                                </AvatarFallback>
                        </Avatar>

                        <div className='flex flex-col'>

                            <span className='text-base font-medium text-gray-400'>

                                {user.name}

                            </span>

                            <span className='text-sm text-gray-500'>
                                {user.email}
                            </span>

                        </div>

                    </div>
                </DropdownMenuLabel>

                 <DropdownMenuSeparator className='bg-gray-600 hidden ' />
                <nav className='sm:hidden'>

                    <NavItems
                    initialStocks={initialStocks}
                    onNavigate={() => setOpen(false)}
                    />

                </nav>

                <DropdownMenuSeparator className='bg-gray-600' />

                <DropdownMenuItem onClick={handleSignout} className='text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition-colors cursor-pointer'>

                    <LogOutIcon className='h-4 w-4 mr-2 hidden sm:block' />
                    Logout

                </DropdownMenuItem>

               



            </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown