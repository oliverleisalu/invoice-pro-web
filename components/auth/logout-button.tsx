"use client"

import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const { signOut, user } = useAuth()

  if (!user) return null

  return (
    <Button
      variant="ghost"
      onClick={signOut}
      className="w-full justify-start gap-2"
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </Button>
  )
}
