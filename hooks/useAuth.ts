'use client'

import { useEffect, useState } from 'react'
import { supabase, phoneToEmail } from '@/lib/supabase'
import { User } from '@/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) loadProfile(data.session.user.id)
      else setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        if (session) loadProfile(session.user.id)
        else { setUser(null); setLoading(false) }
      }
    )
    return () => listener.subscription.unsubscribe()
  }, [])

  async function loadProfile(authId: string) {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authId)
      .single()
    setUser(data)
    setLoading(false)
  }

  async function signUp(userData: {
    name: string
    phone: string
    password: string
    blood_group: string
    district: string
    upazila: string
    bio?: string
    is_doctor: boolean
    doctor_speciality?: string
    chamber_address?: string
    visit_fee?: string
    is_ambulance: boolean
    vehicle_type?: string
    vehicle_number?: string
    lat?: number
    lng?: number
  }) {
    const email = phoneToEmail(userData.phone)
    
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password: userData.password,
      options: { emailRedirectTo: undefined }
    })
    
    if (error) throw error

    const { error: profileError } = await supabase
      .from('users')
      .insert({
        auth_id: authData.user!.id,
        name: userData.name,
        phone: userData.phone,
        blood_group: userData.blood_group,
        district: userData.district,
        upazila: userData.upazila,
        bio: userData.bio || null,
        is_donor: true,
        is_doctor: userData.is_doctor,
        doctor_speciality: userData.doctor_speciality || null,
        chamber_address: userData.chamber_address || null,
        visit_fee: userData.visit_fee || null,
        is_ambulance: userData.is_ambulance,
        vehicle_type: userData.vehicle_type || null,
        vehicle_number: userData.vehicle_number || null,
        lat: userData.lat || null,
        lng: userData.lng || null,
      })

    if (profileError) throw profileError
    return authData
  }

  async function signIn(phone: string, password: string) {
    const email = phoneToEmail(phone)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = '/'
  }

  async function updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    if (error) throw error
  }

  return { user, loading, signUp, signIn, signOut, updatePassword }
}
