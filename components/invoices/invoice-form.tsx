"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Client, InvoiceItem } from "@/lib/types"
import { sampleUser } from "@/lib/sample-data"
import { Plus, Trash2, Save, Send, FileText, UserPlus, Download } from "lucide-react"
import jsPDF from "jspdf"
// Default company data - TODO: Replace with user profile data from Supabase
const defaultCompany = {
  name: "Your Company Name",
  address: "123 Business St",
  city: "Your City",
  state: "ST",
  zipCode: "12345",
  phone: "(555) 123-4567",
  email: "info@yourcompany.com"
}

interface InvoiceFormProps {
  clients: Client[]
  onSave?: (invoice: any) => void
  onSend?: (invoice: any) => void
  onPreview?: (invoice: any) => void
  onAddClient?: (client: Omit<Client, "id">) => void // Added onAddClient prop
}

interface FormData {
  client_id: string
  invoice_number: string
  reference_number: string // Added reference number field
  issue_date: string
  due_date: string
  notes: string
  terms: string
  discount_amount: number
}

export function InvoiceForm({ clients, onSave, onSend, onPreview, onAddClient }: InvoiceFormProps) {
  const [formData, setFormData] = useState<FormData>({
    client_id: "",
    invoice_number: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
    reference_number: "", // Added reference number to initial state
    issue_date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    notes: "",
    terms: "Payment due within 30 days",
    discount_amount: 0,
  })

  const [items, setItems] = useState<Omit<InvoiceItem, "id" | "invoice_id">[]>([
    { description: "", quantity: 1, unit: "pcs", unit_price: null, tax_rate: 0, total: 0 },
  ])

  const [currentTaxRate, setCurrentTaxRate] = useState(sampleUser.default_tax_rate || 0.08)
  const globalTaxRate = currentTaxRate // Use current tax rate that can be overridden

  const updateItem = (index: number, field: keyof Omit<InvoiceItem, "id" | "invoice_id">, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }

    if (field === "quantity" || field === "unit_price" || field === "tax_rate") {
      const item = newItems[index]
      const subtotal = item.quantity * (item.unit_price || 0)
      const discountAmount = subtotal * (item.tax_rate || 0) // Using tax_rate field for discount percentage
      const discountedAmount = subtotal - discountAmount
      newItems[index].total = discountedAmount // Line item total without tax
    }

    setItems(newItems)
  }

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unit: "pcs", unit_price: null, tax_rate: 0, total: 0 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.quantity * (item.unit_price || 0), 0)
    const lineDiscounts = items.reduce((sum, item) => sum + item.quantity * (item.unit_price || 0) * (item.tax_rate || 0), 0)
    const subtotalAfterLineDiscounts = subtotal - lineDiscounts
    const taxAmount = subtotalAfterLineDiscounts * globalTaxRate
    const total = subtotalAfterLineDiscounts + taxAmount - formData.discount_amount
    return { subtotal, taxAmount, total, lineDiscounts }
  }

  const { subtotal, taxAmount, total, lineDiscounts } = calculateTotals()

  const handleSave = () => {
    const invoice = {
      ...formData,
      items,
      subtotal,
      tax_amount: taxAmount,
      total_amount: total,
      status: "draft",
    }
    onSave?.(invoice)
  }

  const handleSend = () => {
    const invoice = {
      ...formData,
      items,
      subtotal,
      tax_amount: taxAmount,
      total_amount: total,
      status: "sent",
    }
    onSend?.(invoice)
  }

  const handleGeneratePDF = () => {
    const selectedClient = clients.find((c) => c.id === formData.client_id)
    if (!selectedClient) {
      alert("Please select a client first")
      return
    }

    // Create new PDF document with A4 dimensions (210mm x 297mm)
    const pdf = new jsPDF("p", "mm", "a4")

    // Set initial position
    let yPos = 20
    const leftMargin = 20
    const rightMargin = 190
    const pageWidth = 210

    // Company header
    pdf.setFontSize(24)
    pdf.setFont("helvetica", "bold")
    pdf.text("INVOICE", leftMargin, yPos)

    yPos += 15
    pdf.setFontSize(12)
    pdf.setFont("helvetica", "normal")
    pdf.text(defaultCompany.name, leftMargin, yPos)
    yPos += 5
    pdf.text(defaultCompany.address, leftMargin, yPos)
    yPos += 5
    pdf.text(`${defaultCompany.city}, ${defaultCompany.state} ${defaultCompany.zipCode}`, leftMargin, yPos)
    yPos += 5
    pdf.text(`Phone: ${defaultCompany.phone}`, leftMargin, yPos)
    yPos += 5
    pdf.text(`Email: ${defaultCompany.email}`, leftMargin, yPos)

    // Invoice details (right side)
    yPos = 35
    pdf.setFontSize(10)
    pdf.text(`Invoice #: ${formData.invoice_number}`, rightMargin - 40, yPos, { align: "right" })
    yPos += 5
    pdf.text(`Date: ${new Date(formData.issue_date).toLocaleDateString()}`, rightMargin - 40, yPos, { align: "right" })
    yPos += 5
    pdf.text(`Due Date: ${new Date(formData.due_date).toLocaleDateString()}`, rightMargin - 40, yPos, { align: "right" })
    if (formData.reference_number) {
      yPos += 5
      pdf.text(`Ref: ${formData.reference_number}`, rightMargin - 40, yPos, { align: "right" })
    }

    // Client information
    yPos += 20
    pdf.setFontSize(12)
    pdf.setFont("helvetica", "bold")
    pdf.text("Bill To:", leftMargin, yPos)
    yPos += 8
    pdf.setFont("helvetica", "normal")
    pdf.text(selectedClient.name, leftMargin, yPos)
    yPos += 5
    if (selectedClient.email) pdf.text(selectedClient.email, leftMargin, yPos)
    yPos += 5
    if (selectedClient.phone) pdf.text(selectedClient.phone, leftMargin, yPos)
    yPos += 5
    if (selectedClient.address) {
      pdf.text(selectedClient.address, leftMargin, yPos)
      yPos += 5
      if (selectedClient.city && selectedClient.state) {
        pdf.text(`${selectedClient.city}, ${selectedClient.state} ${selectedClient.zip_code || ""}`, leftMargin, yPos)
        yPos += 5
      }
      if (selectedClient.country) pdf.text(selectedClient.country, leftMargin, yPos)
    }

    // Items table
    yPos += 15
    pdf.setFontSize(10)
    pdf.setFont("helvetica", "bold")

    // Table headers
    const col1 = leftMargin
    const col2 = col1 + 65
    const col3 = col2 + 20
    const col4 = col3 + 25
    const col5 = col4 + 25
    const col6 = col5 + 35

    pdf.text("Description", col1, yPos)
    pdf.text("Qty", col2, yPos)
    pdf.text("Unit", col3, yPos)
    pdf.text("Rate", col4, yPos)
    pdf.text("Amount", col5, yPos)

    yPos += 5
    pdf.line(leftMargin, yPos, rightMargin, yPos) // Header line

    // Table rows
    yPos += 8
    pdf.setFont("helvetica", "normal")

    items.forEach((item) => {
      if (yPos > 250) { // Check if we need a new page
        pdf.addPage()
        yPos = 20
      }

      pdf.text(item.description || "Item", col1, yPos)
      pdf.text(item.quantity.toString(), col2, yPos)
      pdf.text(item.unit || "pcs", col3, yPos)
      pdf.text(formatCurrency(item.unit_price || 0), col4, yPos)
      pdf.text(formatCurrency(item.total), col5, yPos)
      yPos += 6
    })
    
    // Totals section
    yPos += 5
    pdf.line(leftMargin, yPos, rightMargin, yPos)
    yPos += 8
    
    pdf.setFont("helvetica", "bold")
    pdf.text("Subtotal:", col4, yPos)
    pdf.text(formatCurrency(subtotal), col5, yPos, { align: "right" })
    
    if (lineDiscounts > 0) {
      yPos += 5
      pdf.text("Line Discounts:", col4, yPos)
      pdf.text(`-${formatCurrency(lineDiscounts)}`, col5, yPos, { align: "right" })
    }
    
    yPos += 5
    pdf.text(`Tax (${(globalTaxRate * 100).toFixed(2)}%):`, col4, yPos)
    pdf.text(formatCurrency(taxAmount), col5, yPos, { align: "right" })
    
    if (formData.discount_amount > 0) {
      yPos += 5
      pdf.text("Additional Discount:", col4, yPos)
      pdf.text(`-${formatCurrency(formData.discount_amount)}`, col5, yPos, { align: "right" })
    }
    
    yPos += 5
    pdf.line(leftMargin, yPos, rightMargin, yPos)
    yPos += 8
    
    pdf.setFontSize(12)
    pdf.text("Total:", col4, yPos)
    pdf.text(formatCurrency(total), col5, yPos, { align: "right" })
    
    // Notes and terms
    if (formData.notes || formData.terms) {
      yPos += 20
      if (yPos > 250) {
        pdf.addPage()
        yPos = 20
      }
      
      if (formData.notes) {
        pdf.setFontSize(10)
        pdf.setFont("helvetica", "bold")
        pdf.text("Notes:", leftMargin, yPos)
        yPos += 5
        pdf.setFont("helvetica", "normal")
        const notesLines = pdf.splitTextToSize(formData.notes, 170)
        notesLines.forEach((line: string) => {
          if (yPos > 250) {
            pdf.addPage()
            yPos = 20
          }
          pdf.text(line, leftMargin, yPos)
          yPos += 5
        })
      }
      
      if (formData.terms) {
        yPos += 10
        if (yPos > 250) {
          pdf.addPage()
          yPos = 20
        }
        pdf.setFontSize(10)
        pdf.setFont("helvetica", "bold")
        pdf.text("Terms & Conditions:", leftMargin, yPos)
        yPos += 5
        pdf.setFont("helvetica", "normal")
        const termsLines = pdf.splitTextToSize(formData.terms, 170)
        termsLines.forEach((line: string) => {
          if (yPos > 250) {
            pdf.addPage()
            yPos = 20
          }
          pdf.text(line, leftMargin, yPos)
          yPos += 5
        })
      }
    }
    
    // Save the PDF
    const fileName = `invoice-${formData.invoice_number}-${selectedClient.name.replace(/\s+/g, '-')}.pdf`
    pdf.save(fileName)
  }

  const handlePreview = () => {
    const selectedClient = clients.find((c) => c.id === formData.client_id)
    if (!selectedClient) {
      alert("Please select a client first")
      return
    }

    // Create new PDF document with A4 dimensions (210mm x 297mm)
    const pdf = new jsPDF("p", "mm", "a4")
    
    // Set initial position
    let yPos = 20
    const leftMargin = 20
    const rightMargin = 190
    const pageWidth = 210
    
        // Company header
    pdf.setFontSize(24)
    pdf.setFont("helvetica", "bold")
    pdf.text("INVOICE", leftMargin, yPos)
    
    yPos += 15
    pdf.setFontSize(12)
    pdf.setFont("helvetica", "normal")
    pdf.text(defaultCompany.name, leftMargin, yPos)
    yPos += 5
    pdf.text(defaultCompany.address, leftMargin, yPos)
    yPos += 5
    pdf.text(`${defaultCompany.city}, ${defaultCompany.state} ${defaultCompany.zipCode}`, leftMargin, yPos)
    yPos += 5
    pdf.text(`Phone: ${defaultCompany.phone}`, leftMargin, yPos)
    yPos += 5
    pdf.text(`Email: ${defaultCompany.email}`, leftMargin, yPos)
    
    // Invoice details (right side)
    yPos = 35
    pdf.setFontSize(10)
    pdf.text(`Invoice #: ${formData.invoice_number}`, rightMargin - 40, yPos, { align: "right" })
    yPos += 5
    pdf.text(`Date: ${new Date(formData.issue_date).toLocaleDateString()}`, rightMargin - 40, yPos, { align: "right" })
    yPos += 5
    pdf.text(`Due Date: ${new Date(formData.due_date).toLocaleDateString()}`, rightMargin - 40, yPos, { align: "right" })
    if (formData.reference_number) {
      yPos += 5
      pdf.text(`Ref: ${formData.reference_number}`, rightMargin - 40, yPos, { align: "right" })
    }
    
    // Client information
    yPos += 20
    pdf.setFontSize(12)
    pdf.setFont("helvetica", "bold")
    pdf.text("Bill To:", leftMargin, yPos)
    yPos += 8
    pdf.setFont("helvetica", "normal")
    pdf.text(selectedClient.name, leftMargin, yPos)
    yPos += 5
    if (selectedClient.email) pdf.text(selectedClient.email, leftMargin, yPos)
    yPos += 5
    if (selectedClient.phone) pdf.text(selectedClient.phone, leftMargin, yPos)
    yPos += 5
    if (selectedClient.address) {
      pdf.text(selectedClient.address, leftMargin, yPos)
      yPos += 5
      if (selectedClient.city && selectedClient.state) {
        pdf.text(`${selectedClient.city}, ${selectedClient.state} ${selectedClient.zip_code || ""}`, leftMargin, yPos)
        yPos += 5
      }
      if (selectedClient.country) pdf.text(selectedClient.country, leftMargin, yPos)
    }
    
    // Items table
    yPos += 15
    pdf.setFontSize(10)
    pdf.setFont("helvetica", "bold")
    
    // Table headers
    const col1 = leftMargin
    const col2 = col1 + 65
    const col3 = col2 + 20
    const col4 = col3 + 25
    const col5 = col4 + 25
    const col6 = col5 + 35

    pdf.text("Description", col1, yPos)
    pdf.text("Qty", col2, yPos)
    pdf.text("Unit", col3, yPos)
    pdf.text("Rate", col4, yPos)
    pdf.text("Amount", col5, yPos)

    yPos += 5
    pdf.line(leftMargin, yPos, rightMargin, yPos) // Header line

    // Table rows
    yPos += 8
    pdf.setFont("helvetica", "normal")

    items.forEach((item) => {
      if (yPos > 250) { // Check if we need a new page
        pdf.addPage()
        yPos = 20
      }

      pdf.text(item.description || "Item", col1, yPos)
      pdf.text(item.quantity.toString(), col2, yPos)
      pdf.text(item.unit || "pcs", col3, yPos)
      pdf.text(formatCurrency(item.unit_price || 0), col4, yPos)
      pdf.text(formatCurrency(item.total), col5, yPos)
      yPos += 6
    })
    
    // Totals section
    yPos += 5
    pdf.line(leftMargin, yPos, rightMargin, yPos)
    yPos += 8
    
    pdf.setFont("helvetica", "bold")
    pdf.text("Subtotal:", col4, yPos)
    pdf.text(formatCurrency(subtotal), col5, yPos, { align: "right" })
    
    if (lineDiscounts > 0) {
      yPos += 5
      pdf.text("Line Discounts:", col4, yPos)
      pdf.text(`-${formatCurrency(lineDiscounts)}`, col5, yPos, { align: "right" })
    }
    
    yPos += 5
    pdf.text(`Tax (${(globalTaxRate * 100).toFixed(2)}%):`, col4, yPos)
    pdf.text(formatCurrency(taxAmount), col5, yPos, { align: "right" })
    
    if (formData.discount_amount > 0) {
      yPos += 5
      pdf.text("Additional Discount:", col4, yPos)
      pdf.text(`-${formatCurrency(formData.discount_amount)}`, col5, yPos, { align: "right" })
    }
    
    yPos += 5
    pdf.line(leftMargin, yPos, rightMargin, yPos)
    yPos += 8
    
    pdf.setFontSize(12)
    pdf.text("Total:", col4, yPos)
    pdf.text(formatCurrency(total), col5, yPos, { align: "right" })
    
    // Notes and terms
    if (formData.notes || formData.terms) {
      yPos += 20
      if (yPos > 250) {
        pdf.addPage()
        yPos = 20
      }
      
      if (formData.notes) {
        pdf.setFontSize(10)
        pdf.setFont("helvetica", "bold")
        pdf.text("Notes:", leftMargin, yPos)
        yPos += 5
        pdf.setFont("helvetica", "normal")
        const notesLines = pdf.splitTextToSize(formData.notes, 170)
        notesLines.forEach((line: string) => {
          if (yPos > 250) {
            pdf.addPage()
            yPos = 20
            }
          pdf.text(line, leftMargin, yPos)
          yPos += 5
        })
      }
      
      if (formData.terms) {
        yPos += 10
        if (yPos > 250) {
          pdf.addPage()
          yPos = 20
        }
        pdf.setFontSize(10)
        pdf.setFont("helvetica", "bold")
        pdf.text("Terms & Conditions:", leftMargin, yPos)
        yPos += 5
        pdf.setFont("helvetica", "normal")
        const termsLines = pdf.splitTextToSize(formData.terms, 170)
        termsLines.forEach((line: string) => {
          if (yPos > 250) {
            pdf.addPage()
            yPos = 20
          }
          pdf.text(line, leftMargin, yPos)
          yPos += 5
        })
      }
    }
    
    // Convert PDF to base64 string for display
    const pdfBase64 = pdf.output('datauristring')
    
    onPreview?.({ pdfData: pdfBase64 })
  }

  const [showNewClientDialog, setShowNewClientDialog] = useState(false)
  const [newClientData, setNewClientData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
  })

  const handleAddNewClient = () => {
    if (newClientData.name && newClientData.email) {
      onAddClient?.(newClientData)
      setNewClientData({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        country: "",
      })
      setShowNewClientDialog(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left side - Client Information Only */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <div className="flex gap-2">
                  <Select
                    value={formData.client_id}
                    onValueChange={(value) => setFormData({ ...formData, client_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog open={showNewClientDialog} onOpenChange={setShowNewClientDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-none">
                      <DialogHeader>
                        <DialogTitle>Add New Client</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="client-name">Name *</Label>
                            <Input
                              id="client-name"
                              value={newClientData.name}
                              onChange={(e) => setNewClientData({ ...newClientData, name: e.target.value })}
                              placeholder="Client name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="client-email">Email *</Label>
                            <Input
                              id="client-email"
                              type="email"
                              value={newClientData.email}
                              onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
                              placeholder="client@example.com"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="client-phone">Phone</Label>
                          <Input
                            id="client-phone"
                            value={newClientData.phone}
                            onChange={(e) => setNewClientData({ ...newClientData, phone: e.target.value })}
                            placeholder="Phone number"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="client-address">Address</Label>
                          <Input
                            id="client-address"
                            value={newClientData.address}
                            onChange={(e) => setNewClientData({ ...newClientData, address: e.target.value })}
                            placeholder="Street address"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="client-city">City</Label>
                            <Input
                              id="client-city"
                              value={newClientData.city}
                              onChange={(e) => setNewClientData({ ...newClientData, city: e.target.value })}
                              placeholder="City"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="client-state">State</Label>
                            <Input
                              id="client-state"
                              value={newClientData.state}
                              onChange={(e) => setNewClientData({ ...newClientData, state: e.target.value })}
                              placeholder="State"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="client-zip">Zip Code</Label>
                            <Input
                              id="client-zip"
                              value={newClientData.zip_code}
                              onChange={(e) => setNewClientData({ ...newClientData, zip_code: e.target.value })}
                              placeholder="Zip code"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="client-country">Country</Label>
                            <Input
                              id="client-country"
                              value={newClientData.country}
                              onChange={(e) => setNewClientData({ ...newClientData, country: e.target.value })}
                              placeholder="Country"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" onClick={() => setShowNewClientDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddNewClient} disabled={!newClientData.name || !newClientData.email}>
                            Add Client
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            {/* Right side - Invoice Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invoice_number">Invoice Number</Label>
                <Input
                  id="invoice_number"
                  value={formData.invoice_number}
                  onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reference_number">Reference Number</Label>
                <Input
                  id="reference_number"
                  value={formData.reference_number}
                  onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                  placeholder="Optional reference number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issue_date">Issue Date</Label>
                <Input
                  id="issue_date"
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle>Line Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Qty</TableHead>
                <TableHead className="w-[100px]">Unit</TableHead>
                <TableHead className="w-[120px]">Unit Price</TableHead>
                <TableHead className="w-[100px]">Discount %</TableHead>
                <TableHead className="w-[120px]">Total</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) => updateItem(index, "description", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", Number.parseInt(e.target.value) || 1)}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={item.unit}
                      onValueChange={(value) => updateItem(index, "unit", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pcs">pcs</SelectItem>
                        <SelectItem value="box">box</SelectItem>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="lbs">lbs</SelectItem>
                        <SelectItem value="m">m</SelectItem>
                        <SelectItem value="ft">ft</SelectItem>
                        <SelectItem value="cm">cm</SelectItem>
                        <SelectItem value="in">in</SelectItem>
                        <SelectItem value="l">l</SelectItem>
                        <SelectItem value="ml">ml</SelectItem>
                        <SelectItem value="gal">gal</SelectItem>
                        <SelectItem value="hr">hr</SelectItem>
                        <SelectItem value="day">day</SelectItem>
                        <SelectItem value="sqm">sqm</SelectItem>
                        <SelectItem value="sqft">sqft</SelectItem>
                        <SelectItem value="pack">pack</SelectItem>
                        <SelectItem value="set">set</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unit_price ?? ""}
                      onChange={(e) => updateItem(index, "unit_price", e.target.value === "" ? null : Number.parseFloat(e.target.value) || 0)}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={item.tax_rate.toString()}
                      onValueChange={(value) => updateItem(index, "tax_rate", Number.parseFloat(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0%</SelectItem>
                        <SelectItem value="0.05">5%</SelectItem>
                        <SelectItem value="0.10">10%</SelectItem>
                        <SelectItem value="0.15">15%</SelectItem>
                        <SelectItem value="0.20">20%</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(item.total)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => removeItem(index)} disabled={items.length === 1}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 mb-6">
            <Button onClick={addItem} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>

          <div className="space-y-2 max-w-sm ml-auto">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {lineDiscounts > 0 && (
              <div className="flex justify-between">
                <span>Line Discounts:</span>
                <span>-{formatCurrency(lineDiscounts)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax ({(globalTaxRate * 100).toFixed(2)}%):</span>
              <span>{formatCurrency(taxAmount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <Label htmlFor="discount">Additional Discount:</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                step="0.01"
                value={formData.discount_amount}
                onChange={(e) => setFormData({ ...formData, discount_amount: Number.parseFloat(e.target.value) || 0 })}
                className="w-24 text-right"
              />
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tax_rate">Tax Rate (%)</Label>
              <Input
                id="tax_rate"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={currentTaxRate * 100}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || value === ".") {
                    setCurrentTaxRate(0);
                  } else {
                    const numericValue = Number.parseFloat(value);
                    if (!isNaN(numericValue)) {
                      setCurrentTaxRate(numericValue / 100);
                    }
                  }
                }}
                placeholder="8.00"
              />
              <p className="text-sm text-muted-foreground">
                Default: {(sampleUser.default_tax_rate * 100).toFixed(2)}%
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes for the client"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="terms">Terms & Conditions</Label>
            <Textarea
              id="terms"
              placeholder="Payment terms and conditions"
              value={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-end">
        <Button variant="outline" onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save as Draft
        </Button>
        <Button variant="outline" onClick={handleGeneratePDF}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
        <Button variant="outline" onClick={handlePreview}>
          <FileText className="mr-2 h-4 w-4" />
          Preview
        </Button>
        <Button onClick={handleSend}>
          <Send className="mr-2 h-4 w-4" />
          Send Invoice
        </Button>
      </div>
    </div>
  )
}
