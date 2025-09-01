"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import type { User } from "@/lib/types"
import { Save, Plus, Trash2 } from "lucide-react"

interface ApplicationSettingsProps {
  user: User
  onSave?: (data: Partial<User>) => void
}

interface TaxRate {
  id: string
  name: string
  rate: number
}

export function ApplicationSettings({ user, onSave }: ApplicationSettingsProps) {
  const [formData, setFormData] = useState({
    default_currency: user.default_currency || "USD",
    default_payment_terms: user.default_payment_terms || 30,
  })

  const [taxRates, setTaxRates] = useState<TaxRate[]>([
    { id: "1", name: "Standard Rate", rate: 8.0 },
    { id: "2", name: "Reduced Rate", rate: 5.0 },
    { id: "3", name: "Zero Rate", rate: 0.0 },
  ])

  const [invoiceSettings, setInvoiceSettings] = useState({
    invoice_prefix: "INV",
    invoice_number_format: "YYYY-NNN",
    auto_send_reminders: true,
    reminder_days_before: 3,
    reminder_days_after: 7,
  })

  const [notifications, setNotifications] = useState({
    email_notifications: true,
    payment_received: true,
    invoice_overdue: true,
    new_client: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave?.({
      ...formData,
      // In a real app, these would be stored in separate settings tables
    })
  }

  const addTaxRate = () => {
    const newRate: TaxRate = {
      id: Date.now().toString(),
      name: "New Tax Rate",
      rate: 0,
    }
    setTaxRates([...taxRates, newRate])
  }

  const updateTaxRate = (id: string, field: keyof TaxRate, value: string | number) => {
    setTaxRates(taxRates.map((rate) => (rate.id === id ? { ...rate, [field]: value } : rate)))
  }

  const removeTaxRate = (id: string) => {
    setTaxRates(taxRates.filter((rate) => rate.id !== id))
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="default_currency">Default Currency</Label>
                <Select
                  value={formData.default_currency}
                  onValueChange={(value) => setFormData({ ...formData, default_currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="default_payment_terms">Default Payment Terms (Days)</Label>
                <Select
                  value={formData.default_payment_terms.toString()}
                  onValueChange={(value) => setFormData({ ...formData, default_payment_terms: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="45">45 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tax Rates</CardTitle>
          <Button onClick={addTaxRate} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Tax Rate
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {taxRates.map((rate) => (
              <div key={rate.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <Input
                    value={rate.name}
                    onChange={(e) => updateTaxRate(rate.id, "name", e.target.value)}
                    placeholder="Tax rate name"
                  />
                </div>
                <div className="w-32">
                  <div className="flex items-center">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={rate.rate}
                      onChange={(e) => updateTaxRate(rate.id, "rate", Number.parseFloat(e.target.value) || 0)}
                      className="text-right"
                    />
                    <span className="ml-2 text-muted-foreground">%</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeTaxRate(rate.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle>Invoice Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoice_prefix">Invoice Number Prefix</Label>
              <Input
                id="invoice_prefix"
                value={invoiceSettings.invoice_prefix}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, invoice_prefix: e.target.value })}
                placeholder="INV"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoice_format">Number Format</Label>
              <Select
                value={invoiceSettings.invoice_number_format}
                onValueChange={(value) => setInvoiceSettings({ ...invoiceSettings, invoice_number_format: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="YYYY-NNN">YYYY-001 (Year-Number)</SelectItem>
                  <SelectItem value="NNN">001 (Sequential)</SelectItem>
                  <SelectItem value="YYYY-MM-NNN">YYYY-MM-001 (Year-Month-Number)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-send Payment Reminders</Label>
                <p className="text-sm text-muted-foreground">Automatically send reminders for overdue invoices</p>
              </div>
              <Switch
                checked={invoiceSettings.auto_send_reminders}
                onCheckedChange={(checked) => setInvoiceSettings({ ...invoiceSettings, auto_send_reminders: checked })}
              />
            </div>

            {invoiceSettings.auto_send_reminders && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                <div className="space-y-2">
                  <Label htmlFor="reminder_before">Days Before Due Date</Label>
                  <Input
                    id="reminder_before"
                    type="number"
                    min="0"
                    value={invoiceSettings.reminder_days_before}
                    onChange={(e) =>
                      setInvoiceSettings({
                        ...invoiceSettings,
                        reminder_days_before: Number.parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reminder_after">Days After Due Date</Label>
                  <Input
                    id="reminder_after"
                    type="number"
                    min="0"
                    value={invoiceSettings.reminder_days_after}
                    onChange={(e) =>
                      setInvoiceSettings({
                        ...invoiceSettings,
                        reminder_days_after: Number.parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive email notifications for important events</p>
            </div>
            <Switch
              checked={notifications.email_notifications}
              onCheckedChange={(checked) => setNotifications({ ...notifications, email_notifications: checked })}
            />
          </div>

          {notifications.email_notifications && (
            <div className="space-y-4 ml-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Payment Received</Label>
                  <p className="text-sm text-muted-foreground">When a payment is received</p>
                </div>
                <Switch
                  checked={notifications.payment_received}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, payment_received: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Invoice Overdue</Label>
                  <p className="text-sm text-muted-foreground">When an invoice becomes overdue</p>
                </div>
                <Switch
                  checked={notifications.invoice_overdue}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, invoice_overdue: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Client Added</Label>
                  <p className="text-sm text-muted-foreground">When a new client is added</p>
                </div>
                <Switch
                  checked={notifications.new_client}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, new_client: checked })}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSubmit}>
          <Save className="mr-2 h-4 w-4" />
          Save All Settings
        </Button>
      </div>
    </div>
  )
}
