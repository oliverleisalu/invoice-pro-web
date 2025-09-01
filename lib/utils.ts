import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))


}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function calculateInvoiceTotal(subtotal: number, taxAmount: number, discountAmount = 0): number {
  return subtotal + taxAmount - discountAmount
}

export function getInvoiceStatusColor(status: string): string {
  switch (status) {
    case "paid":
      return "text-green-600 bg-green-50"
    case "sent":
      return "text-blue-600 bg-blue-50"
    case "overdue":
      return "text-red-600 bg-red-50"
    case "draft":
      return "text-gray-600 bg-gray-50"
    default:
      return "text-gray-600 bg-gray-50"
  }
}

export function isInvoiceOverdue(dueDate: string, status: string): boolean {
  if (status === "paid") return false
  return new Date(dueDate) < new Date()
}

