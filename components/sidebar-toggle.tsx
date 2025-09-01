"use client"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useSidebar } from "@/components/sidebar-provider"

export function SidebarToggle() {
  const { toggleSidebar } = useSidebar()
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleSidebar}
      className="mr-2"
    >
      <Menu className="h-5 w-5" />
    </Button>
  )
}
