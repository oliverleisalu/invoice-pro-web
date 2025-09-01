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
    company_logo_url: user.company_logo_url || "",
    tax_id: user.tax_id || "",
    email: user.email || "",
    phone: "",
    website: "",
    street_address: "",
    city: "",
    postal_code: "",
    country: "",
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={formData.company_logo_url || "/placeholder.svg"} alt="Company Logo" />
            <AvatarFallback className="text-lg font-semibold">
              {formData.company_name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "CO"}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{formData.company_name || "My company"}</CardTitle>
          </div>
        </div>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Basic information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name" className="text-sm text-muted-foreground">Company name</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange("company_name", e.target.value)}
                  placeholder="Enter company name"
                  className="border-0 border-b border-gray-200 rounded-none px-0 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax_id" className="text-sm text-muted-foreground">Register code</Label>
                <Input
                  id="tax_id"
                  value={formData.tax_id}
                  onChange={(e) => handleInputChange("tax_id", e.target.value)}
                  placeholder="Enter register code"
                  className="border-0 border-b border-gray-200 rounded-none px-0 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vat_number" className="text-sm text-muted-foreground">VAT number</Label>
                <Input
                  id="vat_number"
                  value=""
                  onChange={(e) => handleInputChange("vat_number", e.target.value)}
                  placeholder="Enter VAT number"
                  className="border-0 border-b border-gray-200 rounded-none px-0 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-muted-foreground">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                  className="border-0 border-b border-gray-200 rounded-none px-0 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm text-muted-foreground">Telephone number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                  className="border-0 border-b border-gray-200 rounded-none px-0 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website" className="text-sm text-muted-foreground">Web page</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="Enter website URL"
                  className="border-0 border-b border-gray-200 rounded-none px-0 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="additional_row" className="text-sm text-muted-foreground">Additional row</Label>
                <Input
                  id="additional_row"
                  value=""
                  onChange={(e) => handleInputChange("additional_row", e.target.value)}
                  placeholder=""
                  className="border-0 border-b border-gray-200 rounded-none px-0 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="street_address" className="text-sm text-muted-foreground">Street address</Label>
                <Input
                  id="street_address"
                  value={formData.street_address}
                  onChange={(e) => handleInputChange("street_address", e.target.value)}
                  placeholder="Enter street address"
                  className="border-0 border-b border-gray-200 rounded-none px-0 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal_code" className="text-sm text-muted-foreground">Postal code</Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(e) => handleInputChange("postal_code", e.target.value)}
                  placeholder="Enter postal code"
                  className="border-0 border-b border-gray-200 rounded-none px-0 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm text-muted-foreground">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Enter city"
                  className="border-0 border-b border-gray-200 rounded-none px-0 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm text-muted-foreground">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  placeholder="Enter country"
                  className="border-0 border-b border-gray-200 rounded-none px-0 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
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
