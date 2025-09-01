export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          country: string | null
          tax_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          country?: string | null
          tax_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          country?: string | null
          tax_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          user_id: string
          client_id: string | null
          invoice_number: string
          issue_date: string
          due_date: string
          status: 'draft' | 'sent' | 'paid' | 'overdue'
          subtotal_amount: number
          tax_amount: number
          discount_amount: number
          total_amount: number
          notes: string | null
          payment_terms: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id?: string | null
          invoice_number: string
          issue_date: string
          due_date: string
          status?: 'draft' | 'sent' | 'paid' | 'overdue'
          subtotal_amount: number
          tax_amount?: number
          discount_amount?: number
          total_amount: number
          notes?: string | null
          payment_terms?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string | null
          invoice_number?: string
          issue_date?: string
          due_date?: string
          status?: 'draft' | 'sent' | 'paid' | 'overdue'
          subtotal_amount?: number
          tax_amount?: number
          discount_amount?: number
          total_amount?: number
          notes?: string | null
          payment_terms?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invoice_items: {
        Row: {
          id: string
          invoice_id: string
          description: string
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          invoice_id: string
          description: string
          quantity: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          invoice_id?: string
          description?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          invoice_id: string | null
          amount: number
          payment_date: string
          payment_method: string
          reference_number: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          invoice_id?: string | null
          amount: number
          payment_date: string
          payment_method: string
          reference_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          invoice_id?: string | null
          amount?: number
          payment_date?: string
          payment_method?: string
          reference_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          company_name: string | null
          address: string | null
          phone: string | null
          tax_id: string | null
          logo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          company_name?: string | null
          address?: string | null
          phone?: string | null
          tax_id?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company_name?: string | null
          address?: string | null
          phone?: string | null
          tax_id?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
