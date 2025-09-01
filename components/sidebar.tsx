"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, Users, Settings, CreditCard, Plus, Receipt, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useIsMobile } from "@/hooks/use-mobile"
import { useSidebar } from "@/components/sidebar-provider"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Invoices", href: "/invoices", icon: FileText, badge: "8" },
  { name: "Clients", href: "/clients", icon: Users, badge: "6" },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const { isOpen, closeSidebar } = useSidebar()

  const handleNavClick = () => {
    if (isMobile) {
      closeSidebar()
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out",
        isMobile && !isOpen && "-translate-x-full",
        "lg:translate-x-0 lg:relative"
      )}>
        <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Receipt className="h-8 w-8 text-sidebar-primary" />
            <span className="text-xl font-bold text-sidebar-foreground">InvoiceApp</span>
          </div>
          
          {/* Mobile close button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={closeSidebar}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div className="flex-1 px-4 py-6">
          <div className="mb-6">
            <Button asChild className="w-full">
              <Link href="/invoices/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Invoice
              </Link>
            </Button>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleNavClick}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <div className="text-xs text-muted-foreground text-center">InvoiceApp v1.0.0</div>
        </div>
      </div>
    </>
  )
}
