"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDate } from "@/lib/utils"
import type { Client, Invoice } from "@/lib/types"
import { Search, MoreHorizontal, Eye, Edit, Trash2, Mail, Phone, MapPin, Plus } from "lucide-react"

interface ClientTableProps {
  clients: Client[]
  invoices: Invoice[]
  onAddClient?: () => void
  onEditClient?: (client: Client) => void
  onDeleteClient?: (clientId: string) => void
}

export function ClientTable({ clients, invoices, onAddClient, onEditClient, onDeleteClient }: ClientTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedClient, setExpandedClient] = useState<string | null>(null)

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getClientInvoices = (clientId: string) => {
    return invoices.filter((invoice) => invoice.client_id === clientId)
  }

  const getClientStats = (clientId: string) => {
    const clientInvoices = getClientInvoices(clientId)
    const totalInvoices = clientInvoices.length
    const totalRevenue = clientInvoices.reduce((sum, invoice) => sum + invoice.total_amount, 0)
    const unpaidInvoices = clientInvoices.filter((invoice) => invoice.status !== "paid").length

    return { totalInvoices, totalRevenue, unpaidInvoices }
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Clients</CardTitle>
            <Button onClick={onAddClient}>
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </div>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredClients.map((client) => {
              const stats = getClientStats(client.id)
              const isExpanded = expandedClient === client.id

              return (
                <Card key={client.id} className="transition-all duration-200 shadow-2xl hover:shadow-3xl">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => setExpandedClient(isExpanded ? null : client.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{client.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {client.email}
                              </div>
                              {client.phone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {client.phone}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-4 text-sm">
                            <div className="text-center">
                              <div className="font-semibold">{stats.totalInvoices}</div>
                              <div className="text-muted-foreground">Invoices</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold">${stats.totalRevenue.toLocaleString()}</div>
                              <div className="text-muted-foreground">Revenue</div>
                            </div>
                            {stats.unpaidInvoices > 0 && (
                              <div className="text-center">
                                <Badge variant="destructive">{stats.unpaidInvoices}</Badge>
                                <div className="text-muted-foreground text-xs">Unpaid</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setExpandedClient(isExpanded ? null : client.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            {isExpanded ? "Hide Details" : "View Details"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEditClient?.(client)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Client
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => onDeleteClient?.(client.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Client
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Contact Information</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                <div>{client.address}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <a href={`mailto:${client.email}`} className="text-primary hover:underline">
                                  {client.email}
                                </a>
                              </div>
                              {client.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <a href={`tel:${client.phone}`} className="text-primary hover:underline">
                                    {client.phone}
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Recent Invoices</h4>
                            <div className="space-y-2">
                              {getClientInvoices(client.id)
                                .slice(0, 3)
                                .map((invoice) => (
                                  <div key={invoice.id} className="flex justify-between items-center text-sm">
                                    <span>{invoice.invoice_number}</span>
                                    <div className="flex items-center gap-2">
                                      <Badge
                                        className={`text-xs ${
                                          invoice.status === "paid"
                                            ? "bg-green-100 text-green-800"
                                            : invoice.status === "overdue"
                                              ? "bg-red-100 text-red-800"
                                              : "bg-blue-100 text-blue-800"
                                        }`}
                                      >
                                        {invoice.status}
                                      </Badge>
                                      <span className="font-medium">${invoice.total_amount.toLocaleString()}</span>
                                    </div>
                                  </div>
                                ))}
                              {getClientInvoices(client.id).length === 0 && (
                                <p className="text-muted-foreground text-sm">No invoices yet</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Client since {formatDate(client.created_at)}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
