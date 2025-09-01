"use client"

import { InvoiceForm } from "@/components/invoices/invoice-form"
import { useClients } from "@/hooks/use-clients"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function NewInvoicePage() {
  const router = useRouter()
  const { clients, loading } = useClients()
  const [pdfData, setPdfData] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const handleSave = async (invoice: any) => {
    console.log("Saving invoice as draft:", invoice)
    // TODO: Implement invoice saving with Supabase
    router.push("/invoices")
  }

  const handleSend = (invoice: any) => {
    console.log("Sending invoice:", invoice)
    // In a real app, this would save to database and send email
    router.push("/invoices")
  }

  const handlePreview = (data: any) => {
    if (data.pdfData) {
      setPdfData(data.pdfData)
      setIsPreviewOpen(true)
    }
  }

  const handleAddClient = (newClient: Omit<Client, "id">) => {
    const clientWithId: Client = {
      ...newClient,
      id: `client-${Date.now()}`, // Generate a temporary ID
    }
    setClients((prev) => [...prev, clientWithId])
    console.log("Added new client:", clientWithId)
    // In a real app, this would save to the database
  }

  return (
    <div className="flex-1 space-y-6 p-6 container mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Create New Invoice</h1>
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Invoice PDF Preview</DialogTitle>
            </DialogHeader>
            {pdfData && (
              <div className="w-full h-[70vh]">
                <iframe
                  src={pdfData}
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                  title="Invoice PDF Preview"
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <InvoiceForm
        clients={clients}
        onSave={handleSave}
        onSend={handleSend}
        onPreview={handlePreview}
        onAddClient={handleAddClient}
      />
    </div>
  )
}
