import { InvoiceTable } from "@/components/invoices/invoice-table"
import { Button } from "@/components/ui/button"
import { sampleInvoices } from "@/lib/sample-data"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function InvoicesPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
        <Button asChild>
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
