import { InvoiceTable } from "@/components/invoices/invoice-table"
import { Button } from "@/components/ui/button"
import { sampleInvoices } from "@/lib/sample-data"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function InvoicesPage() {
  return (
    <div className="flex-1 space-y-4 px-4 py-6 sm:px-6 lg:px-8 container mx-auto max-w-7xl">
      {/* Mobile-first header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Invoices</h1>
          <p className="text-muted-foreground mt-1">Manage and track your invoices</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/invoices/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Link>
        </Button>
      </div>

      <InvoiceTable invoices={sampleInvoices} />
    </div>
  )
}
