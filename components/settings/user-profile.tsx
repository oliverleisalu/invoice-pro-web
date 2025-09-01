"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "@/lib/types"
import { Upload, Save, Key, Shield } from "lucide-react"
import { supabase, getCurrentUser } from "@/lib/supabase"
import type { Database } from "@/types/database"

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"]
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"]

interface UserProfileProps {
  user: User
  onSave?: (data: Partial<User>) => void
}

export function UserProfile({ user, onSave }: UserProfileProps) {
  const [formData, setFormData] = useState({
    email: user.email || "",
    first_name: "",
    last_name: "",
    phone: "",
    profile_image: "",
  })

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true)
      setError(null)
      try {
        const authUser = await getCurrentUser()
        if (!authUser) {
          setError("Not authenticated")
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("email, full_name, phone, logo_url")
          .eq("id", authUser.id)
          .single()

        const profile = data as ProfileRow | null

        if (error || !profile) {
          // If no row exists yet, initialize with auth values
          setFormData((prev) => ({
            ...prev,
            email: authUser.email ?? prev.email,
            first_name: (authUser.user_metadata?.full_name || "").split(" ")[0] || "",
            last_name: ((authUser.user_metadata?.full_name || "").split(" ").slice(1).join(" ") || "").trim(),
            phone: "",
            profile_image: "",
          }))
        } else if (profile) {
          const fullName = profile.full_name || ""
          const [first, ...rest] = fullName.split(" ")
          setFormData({
            email: profile.email || authUser.email || "",
            first_name: first || "",
            last_name: rest.join(" ") || "",
            phone: profile.phone || "",
            profile_image: profile.logo_url || "",
          })
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const authUser = await getCurrentUser()
      if (!authUser) {
        setError("Not authenticated")
        setSaving(false)
        return
      }

      const full_name = `${formData.first_name} ${formData.last_name}`.trim()

      const payload: ProfileInsert = {
        id: authUser.id,
        email: formData.email,
        full_name,
        phone: formData.phone,
        logo_url: formData.profile_image,
      }

      const { error } = await supabase
        .from("profiles")
        .upsert(payload as any, { onConflict: "id" })

      if (error) {
        setError(error.message)
      } else {
        onSave?.({ email: formData.email })
      }
    } catch (e: any) {
      setError(e?.message || "Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert("New passwords don't match")
      return
    }
    // Handle password change
    console.log("Password change requested")
    setPasswordData({ current_password: "", new_password: "", confirm_password: "" })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={formData.profile_image || "/placeholder.svg"} alt="Profile" />
                  <AvatarFallback className="text-lg">
                    {`${formData.first_name[0]}${formData.last_name[0]}`.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button type="button" variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photo
                </Button>
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange("first_name", e.target.value)}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange("last_name", e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <div className="flex justify-end">
              <Button type="submit" disabled={loading || saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current_password">Current Password</Label>
              <Input
                id="current_password"
                type="password"
                value={passwordData.current_password}
                onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                placeholder="Enter current password"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new_password">New Password</Label>
                <Input
                  id="new_password"
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">
                <Key className="mr-2 h-4 w-4" />
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
