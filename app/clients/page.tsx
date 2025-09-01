"use client"

import { useState } from "react"
import { ClientTable } from "@/components/clients/client-table"
import { ClientDialog } from "@/components/clients/client-dialog"
import { sampleClients, sampleInvoices } from "@/lib/sample-data"
import type { Client } from "@/lib/types"

export default function ClientsPage() {
  const [clients, setClients] = useState(sampleClients)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | undefined>()

  const handleAddClient = () => {
    setEditingClient(undefined)
    setDialogOpen(true)
  }

  const handleEditClient = (client: Client) => {
    setEditingClient(client)
    setDialogOpen(true)
  }

  const handleSaveClient = (clientData: Partial<Client>) => {
    if (editingClient) {
      // Update existing client
      setClients(clients.map((c) => (c.id === editingClient.id ? { ...c, ...clientData } : c)))
    } else {
      // Add new client
      const newClient: Client = {
        id: `client-${Date.now()}`,
        user_id: "user-1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...clientData,
      } as Client
      setClients([...clients, newClient])
    }
  }

  const handleDeleteClient = (clientId: string) => {
    if (confirm("Are you sure you want to delete this client? This action cannot be undone.")) {
      setClients(clients.filter((c) => c.id !== clientId))
    }
  }

  return (
    <div className="flex-1 space-y-4 px-4 py-6 sm:px-6 lg:px-8 container mx-auto max-w-7xl">
      {/* Mobile-first header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Clients</h1>
          <p className="text-muted-foreground mt-1">Manage your client relationships</p>
        </div>
      </div>

      <ClientTable
        clients={clients}
        invoices={sampleInvoices}
        onAddClient={handleAddClient}
        onEditClient={handleEditClient}
        onDeleteClient={handleDeleteClient}
      />

      <ClientDialog open={dialogOpen} onOpenChange={setDialogOpen} client={editingClient} onSave={handleSaveClient} />
    </div>
  )
}
