"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2, CreditCard } from "lucide-react"
import type { BankAccount } from "@/lib/types"

interface BankAccountsProps {
  bankAccounts: BankAccount[]
  onAddAccount?: (account: Omit<BankAccount, "id">) => void
  onRemoveAccount?: (id: string) => void
}

export function BankAccounts({ bankAccounts, onAddAccount, onRemoveAccount }: BankAccountsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newAccount, setNewAccount] = useState({
    bankName: "",
    accountNumber: "",
    bicSwift: "",
  })

  const handleAddAccount = () => {
    if (newAccount.bankName && newAccount.accountNumber && newAccount.bicSwift) {
      const account: Omit<BankAccount, "id"> = {
        bankName: newAccount.bankName,
        accountNumber: newAccount.accountNumber,
        bicSwift: newAccount.bicSwift,
      }
      onAddAccount?.(account)
      setNewAccount({
        bankName: "",
        accountNumber: "",
        bicSwift: "",
      })
      setIsDialogOpen(false)
    }
  }

  const handleRemoveAccount = (id: string) => {
    onRemoveAccount?.(id)
  }

  return (
    <Card className="shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Bank Accounts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {bankAccounts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No bank accounts added yet</p>
            <p className="text-sm">Add your first bank account to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bankAccounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <p className="font-medium">{account.bankName}</p>
                  <p className="text-sm text-muted-foreground">
                    Account: ****{account.accountNumber.slice(-4)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    BIC/SWIFT: {account.bicSwift}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveAccount(account.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Bank Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Bank Account</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name *</Label>
                <Input
                  id="bankName"
                  value={newAccount.bankName}
                  onChange={(e) => setNewAccount({ ...newAccount, bankName: e.target.value })}
                  placeholder="e.g., Bank of America"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number *</Label>
                <Input
                  id="accountNumber"
                  value={newAccount.accountNumber}
                  onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
                  placeholder="Enter full account number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bicSwift">BIC/SWIFT *</Label>
                <Input
                  id="bicSwift"
                  value={newAccount.bicSwift}
                  onChange={(e) => setNewAccount({ ...newAccount, bicSwift: e.target.value })}
                  placeholder="e.g., BOFAUS3N"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddAccount}
                  disabled={!newAccount.bankName || !newAccount.accountNumber || !newAccount.bicSwift}
                >
                  Add Account
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
