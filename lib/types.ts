export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
  company_name: string
  company_address: string
  company_logo_url?: string
  default_currency: string
  default_payment_terms: number
  tax_id?: string
  bank_details?: string
}

export interface BankAccount {
  id: string
  bankName: string
  accountNumber: string
  bicSwift: string
}

export interface Client {
  id: string
  user_id: string
  name: string
  email: string
  address: string
  phone?: string
  created_at: string
  updated_at: string
}

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue"

export interface Invoice {
  id: string
  user_id: string
  client_id: string
  invoice_number: string
  issue_date: string
  due_date: string
  status: InvoiceStatus
  subtotal: number
  tax_amount: number
  discount_amount: number
  total_amount: number
  notes?: string
  terms?: string
  created_at: string
  updated_at: string
  client?: Client
  items?: InvoiceItem[]
  payments?: Payment[]
}

export interface InvoiceItem {
  id: string
  invoice_id: string
  description: string
  quantity: number
  unit_price: number
  tax_rate: number
  total: number
}

export interface Payment {
  id: string
  invoice_id: string
  amount: number
  payment_date: string
  payment_method: string
  notes?: string
  created_at: string
}

export interface DashboardMetrics {
  monthly_revenue: number
  monthly_revenue_change: number
  total_invoices_this_month: number
  outstanding_invoices: number
  recent_payments: number
}

export interface ChartData {
  month: string
  revenue: number
  invoices: number
}
