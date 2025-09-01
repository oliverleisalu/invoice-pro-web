// Quick test to verify Supabase connection
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envFile = fs.readFileSync('.env.local', 'utf8')
const urlMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)
const keyMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/)

const supabaseUrl = urlMatch[1]
const supabaseKey = keyMatch[1]

console.log('Testing Supabase connection...')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseKey.substring(0, 20) + '...')

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    const { data, error } = await supabase.auth.getSession()
    console.log('Connection successful!')
    console.log('Session:', data.session ? 'Found' : 'None')
    if (error) {
      console.log('Auth error:', error.message)
    }
  } catch (err) {
    console.log('Connection failed:', err.message)
  }
}

testConnection()
