"use client"

import { useState } from "react"
import { ClientTable } from "@/components/clients/client-table"
import { ClientDialog } from "@/components/clients/client-dialog"
import { useClients } from "@/hooks/use-clients"
import type { Database } from "@/types/database"

type Client = Database['public']['Tables']['clients']['Row']

export default function ClientsPage() {
  const { clients, loading, addClient, updateClient, deleteClient } = useClients()
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

  const handleSaveClient = async (clientData: Partial<Client>) => {
    try {
      if (editingClient) {
        await updateClient(editingClient.id, clientData)
      } else {
        await addClient(clientData)
      }
      setDialogOpen(false)
      setEditingClient(undefined)
    } catch (error) {
      console.error("Failed to save client:", error)
    }
  }

  const handleDeleteClient = async (clientId: string) => {
    if (confirm("Are you sure you want to delete this client? This action cannot be undone.")) {
      try {
        await deleteClient(clientId)
      } catch (error) {
        console.error("Failed to delete client:", error)
      }
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
        invoices={[]}
        onAddClient={handleAddClient}
        onEditClient={handleEditClient}
        onDeleteClient={handleDeleteClient}
      />

      <ClientDialog open={dialogOpen} onOpenChange={setDialogOpen} client={editingClient} onSave={handleSaveClient} />
    </div>
  )
}
