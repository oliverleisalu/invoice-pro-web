import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import type { Database } from '@/types/database'

type Payment = Database['public']['Tables']['payments']['Row'] & {
  invoice?: Database['public']['Tables']['invoices']['Row']
}
type PaymentInsert = Database['public']['Tables']['payments']['Insert']
type PaymentUpdate = Database['public']['Tables']['payments']['Update']

export function usePayments() {
  const { user } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all payments with invoice data
  const fetchPayments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          invoice:invoices(*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPayments(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payments')
    } finally {
      setLoading(false)
    }
  }

  // Add new payment
  const addPayment = async (paymentData: PaymentInsert) => {
    try {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('payments')
        .insert([{ ...paymentData, user_id: user.id }])
        .select(`
          *,
          invoice:invoices(*)
        `)
        .single()

      if (error) throw error
      setPayments(prev => [data, ...prev])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add payment')
      throw err
    }
  }

  // Update payment
  const updatePayment = async (id: string, updates: PaymentUpdate) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          invoice:invoices(*)
        `)
        .single()

      if (error) throw error
      setPayments(prev => prev.map(payment =>
        payment.id === id ? data : payment
      ))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update payment')
      throw err
    }
  }

  // Delete payment
  const deletePayment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', id)

      if (error) throw error
      setPayments(prev => prev.filter(payment => payment.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete payment')
      throw err
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  return {
    payments,
    loading,
    error,
    addPayment,
    updatePayment,
    deletePayment,
    refetch: fetchPayments
  }
}
