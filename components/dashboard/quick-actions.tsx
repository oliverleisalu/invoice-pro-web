import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Users, FileText, CreditCard } from "lucide-react"

export function QuickActions() {
  const actions1 = [
    {
      title: "Create Invoice",
      description: "Generate a new invoice",
      href: "/invoices/new",
      icon: Plus,
      variant: "default" as const,
    },
  ]

  const actions2 = [
    {
      title: "Add Client",
      description: "Add a new client",
      href: "/clients",
      icon: Users,
      variant: "outline" as const,
    },
    {
      title: "View Invoices",
      description: "Manage all invoices",
      href: "/invoices",
      icon: FileText,
      variant: "outline" as const,
    },
    {
      title: "Record Payment",
      description: "Log a new payment",
      href: "/payments",
      icon: CreditCard,
      variant: "outline" as const,
    },
  ]

  return (
    <div className="flex gap-3">
      <div className="bg-white border rounded-lg shadow-2xl">
        <div className="flex items-center justify-between p-1">
          {/* <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-card-foreground">Quick Actions</h2>
          <span className="text-sm text-muted-foreground">|</span>
          <span className="text-sm text-muted-foreground">Common tasks</span>
        </div> */}
          <div className="flex gap-3">
            {actions1.map((action) => (
              <Button key={action.title} asChild variant={action.variant} size="sm" className="h-auto px-4 py-2">
                <Link href={action.href}>
                  <action.icon className="h-4 w-4 mr-2" />
                  <span className="font-medium">{action.title}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white border rounded-lg shadow-2xl">
        <div className="flex items-center justify-between p-1">
          {/* <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-card-foreground">Quick Actions</h2>
          <span className="text-sm text-muted-foreground">|</span>
          <span className="text-sm text-muted-foreground">Common tasks</span>
        </div> */}
          <div className="flex gap-3">
            {actions2.map((action) => (
              <Button key={action.title} asChild variant={action.variant} size="sm" className="h-auto px-4 py-2">
                <Link href={action.href}>
                  <action.icon className="h-4 w-4 mr-2" />
                  <span className="font-medium">{action.title}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
