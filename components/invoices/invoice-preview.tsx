"use client"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, formatDate } from "@/lib/utils"
import { sampleCompany } from "@/lib/sample-data"

interface InvoicePreviewProps {
  invoice: {
    invoiceNumber: string
    date: string
    dueDate: string
    client: any
    items: Array<{
      description: string
      quantity: number
      rate: number
      amount: number
    }>
    subtotal: number
    taxRate: number
    taxAmount: number
    discount: number
    total: number
    notes: string
    terms: string
  }
}

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  return (
    <div className="mx-auto bg-white text-black relative" style={{ 
      width: '210mm', 
      minHeight: '297mm', 
      aspectRatio: '1 / 1.414',
      padding: '20mm',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      margin: '20px auto'
    }}>
      {/* Company Header - Left side */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-2" style={{ fontSize: '24px' }}>INVOICE</h1>
        <div className="text-sm">
          <p className="font-semibold">{sampleCompany.name}</p>
          <p>{sampleCompany.address}</p>
          <p>{sampleCompany.city}, {sampleCompany.state} {sampleCompany.zipCode}</p>
          <p>Phone: {sampleCompany.phone}</p>
          <p>Email: {sampleCompany.email}</p>
        </div>
      </div>

      {/* Invoice Details - Right side */}
      <div className="absolute top-5 right-5 text-right text-sm">
        <div className="space-y-1">
          <p><span className="font-semibold">Invoice #:</span> {invoice.invoiceNumber}</p>
          <p><span className="font-semibold">Date:</span> {formatDate(invoice.date)}</p>
          <p><span className="font-semibold">Due Date:</span> {formatDate(invoice.dueDate)}</p>
        </div>
      </div>

      {/* Client Information */}
      <div className="mb-8 mt-16">
        <h3 className="font-semibold text-sm mb-2">Bill To:</h3>
        <div className="text-sm">
          <p className="font-semibold">{invoice.client?.name}</p>
          <p>{invoice.client?.email}</p>
          <p>{invoice.client?.phone}</p>
          {invoice.client?.address && (
            <div>
              <p>{invoice.client.address}</p>
              <p>{invoice.client.city}, {invoice.client.state} {invoice.client.zipCode}</p>
              <p>{invoice.client.country}</p>
            </div>
          )}
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-2 font-semibold">Description</th>
              <th className="text-right py-2 font-semibold w-16">Qty</th>
              <th className="text-right py-2 font-semibold w-20">Rate</th>
              <th className="text-right py-2 font-semibold w-20">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-2">{item.description}</td>
                <td className="text-right py-2">{item.quantity}</td>
                <td className="text-right py-2">{formatCurrency(item.rate)}</td>
                <td className="text-right py-2">{formatCurrency(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-6">
        <div className="w-48 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(invoice.subtotal)}</span>
          </div>
          {invoice.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount:</span>
              <span>-{formatCurrency(invoice.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Tax ({invoice.taxRate}%):</span>
            <span>{formatCurrency(invoice.taxAmount)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>

      {/* Notes and Terms */}
      {(invoice.notes || invoice.terms) && (
        <div className="space-y-3 text-sm">
          <Separator />
          {invoice.notes && (
            <div>
              <h4 className="font-semibold mb-1">Notes:</h4>
              <p className="text-gray-600">{invoice.notes}</p>
            </div>
          )}
          {invoice.terms && (
            <div>
              <h4 className="font-semibold mb-1">Terms & Conditions:</h4>
              <p className="text-gray-600">{invoice.terms}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
