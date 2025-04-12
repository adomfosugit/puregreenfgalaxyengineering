'use client'
import { Button } from "@/components/ui/button"
import { LogOutUser } from "@/lib/Appwrite/api"
import { LogOutIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export  function NavigationMenu() {
    const router = useRouter
    const logoutuser = async () => {
        const logout = await LogOutUser()
        // @ts-ignore
        if(logout) router.push('/')
        
    }
  return (
        <Button onClick={logoutuser}>
          <LogOutIcon />
        </Button>

  )
}