"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CompanySettings } from "@/components/settings/company-settings"
import { BankAccounts } from "@/components/settings/bank-accounts"
import { ApplicationSettings } from "@/components/settings/application-settings"
import { UserProfile } from "@/components/settings/user-profile"
// Default user data - TODO: Replace with Supabase user data
const defaultUser = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  company: "Your Company",
  address: "123 Business St",
  city: "Your City",
  state: "ST",
  zipCode: "12345",
  phone: "(555) 123-4567",
  taxId: "12-3456789"
}
import type { BankAccount } from "@/lib/types"
import { Building2, Settings, User } from "lucide-react"

export default function SettingsPage() {
  const [user, setUser] = useState(defaultUser)
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])

  const handleSaveCompany = (data: any) => {
    setUser({ ...user, ...data })
    console.log("Company settings saved:", data)
  }

  const handleSaveApplication = (data: any) => {
    setUser({ ...user, ...data })
    console.log("Application settings saved:", data)
  }

  const handleSaveProfile = (data: any) => {
    setUser({ ...user, ...data })
    console.log("Profile saved:", data)
  }

  const handleAddBankAccount = (account: Omit<BankAccount, "id">) => {
    const newAccount: BankAccount = {
      ...account,
      id: `bank-${Date.now()}`,
    }
    setBankAccounts([...bankAccounts, newAccount])
    console.log("Bank account added:", newAccount)
  }

  const handleRemoveBankAccount = (id: string) => {
    setBankAccounts(bankAccounts.filter(account => account.id !== id))
    console.log("Bank account removed:", id)
  }

  return (
    <div className="flex-1 space-y-6 p-6 container mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Company
          </TabsTrigger>
          <TabsTrigger value="application" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Application
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-6">
          <CompanySettings user={user} onSave={handleSaveCompany} />
          <BankAccounts
            bankAccounts={bankAccounts}
            onAddAccount={handleAddBankAccount}
            onRemoveAccount={handleRemoveBankAccount}
          />
        </TabsContent>

        <TabsContent value="application">
          <ApplicationSettings user={user} onSave={handleSaveApplication} />
        </TabsContent>

        <TabsContent value="profile">
          <UserProfile user={user} onSave={handleSaveProfile} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
