'use client'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'
import React from 'react'
import { usePathname } from 'next/navigation'
type Props = {}

const Navigator = (props: Props) => {
    const pathname = usePathname()
  return (
    <NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuLink  href='/Dashboard' className={`${navigationMenuTriggerStyle()} font-light hover:bg-primary hover:text-white ${pathname === '/Dashboard' ? 'bg-primary text-white' : ''}`}  >Dashboard</NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink  href='/Analytics' className={`${navigationMenuTriggerStyle()} font-light hover:bg-primary hover:text-white ${pathname === '/Analytics' ? 'bg-primary text-white' : ''}`}  >Analytics</NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href='/Product' className={`${navigationMenuTriggerStyle()} font-light hover:bg-primary hover:text-white ${pathname === '/Product' ? 'bg-primary text-white' : ''}`}>Product</NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href='/Sales' className={`${navigationMenuTriggerStyle()} font-light hover:bg-primary hover:text-white ${pathname === '/Sales' ? 'bg-primary text-white' : ''}`}>Sales</NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href='/Purchases' className={`${navigationMenuTriggerStyle()} font-light hover:bg-primary hover:text-white ${pathname === '/Purchases' ? 'bg-primary text-white' : ''}`}>Purchases</NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href='/Customers' className={`${navigationMenuTriggerStyle()} font-light hover:bg-primary hover:text-white ${pathname === '/Customers' ? 'bg-primary text-white' : ''}`}>Customers</NavigationMenuLink>
    </NavigationMenuItem>
  
 
    

  </NavigationMenuList>
</NavigationMenu>
 )
  
}

export default Navigator