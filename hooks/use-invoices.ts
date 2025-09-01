import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import type { Database } from '@/types/database'

type Invoice = Database['public']['Tables']['invoices']['Row'] & {
  client?: Database['public']['Tables']['clients']['Row']
  invoice_items?: Database['public']['Tables']['invoice_items']['Row'][]
}
type InvoiceInsert = Database['public']['Tables']['invoices']['Insert']
type InvoiceUpdate = Database['public']['Tables']['invoices']['Update']

export function useInvoices() {
  const { user } = useAuth()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all invoices with client and items data
  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          client:clients(*),
          invoice_items(*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setInvoices(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invoices')
    } finally {
      setLoading(false)
    }
  }

  // Add new invoice
  const addInvoice = async (invoiceData: InvoiceInsert) => {
    try {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('invoices')
        .insert([{ ...invoiceData, user_id: user.id }])
        .select(`
          *,
          client:clients(*)
        `)
        .single()

      if (error) throw error
      setInvoices(prev => [data, ...prev])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add invoice')
      throw err
    }
  }

  // Update invoice
  const updateInvoice = async (id: string, updates: InvoiceUpdate) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          client:clients(*),
          invoice_items(*)
        `)
        .single()

      if (error) throw error
      setInvoices(prev => prev.map(invoice =>
        invoice.id === id ? data : invoice
      ))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update invoice')
      throw err
    }
  }

  // Delete invoice
  const deleteInvoice = async (id: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id)

      if (error) throw error
      setInvoices(prev => prev.filter(invoice => invoice.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete invoice')
      throw err
    }
  }

  // Add invoice items
  const addInvoiceItems = async (invoiceId: string, items: any[]) => {
    try {
      const { data, error } = await supabase
        .from('invoice_items')
        .insert(items.map(item => ({ ...item, invoice_id: invoiceId })))
        .select()

      if (error) throw error

      // Update the invoice with new items
      setInvoices(prev => prev.map(invoice =>
        invoice.id === invoiceId
          ? { ...invoice, invoice_items: [...(invoice.invoice_items || []), ...data] }
          : invoice
      ))

      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add invoice items')
      throw err
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [])

  return {
    invoices,
    loading,
    error,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    addInvoiceItems,
    refetch: fetchInvoices
  }
}
