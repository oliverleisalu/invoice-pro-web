"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "@/lib/types"
import { Upload, Save } from "lucide-react"

interface CompanySettingsProps {
  user: User
  onSave?: (data: Partial<User>) => void
}

export function CompanySettings({ user, onSave }: CompanySettingsProps) {
  const [formData, setFormData] = useState({
    company_name: user.company_name || "",
    company_address: user.company_address || "",
    company_logo_url: user.company_logo_url || "",
    tax_id: user.tax_id || "",
    email: user.email || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave?.(formData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <Card className="shadow-2xl">
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={formData.company_logo_url || "/placeholder.svg"} alt="Company Logo" />
                <AvatarFallback className="text-lg">
                  {formData.company_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "CO"}
                </AvatarFallback>
              </Avatar>
              <Button type="button" variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Upload Logo
              </Button>
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange("company_name", e.target.value)}
                  placeholder="Enter company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Company Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter company email"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_address">Company Address</Label>
            <Textarea
              id="company_address"
              value={formData.company_address}
              onChange={(e) => handleInputChange("company_address", e.target.value)}
              placeholder="Enter full company address"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tax_id">Tax ID / Registration Number</Label>
            <Input
              id="tax_id"
              value={formData.tax_id}
              onChange={(e) => handleInputChange("tax_id", e.target.value)}
              placeholder="Enter tax ID or registration number"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Save Company Information
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
