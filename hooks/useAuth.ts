'use client'

import { useEffect, useState } from 'react'
import { supabase, phoneToEmail } from '@/lib/supabase'
import { User } from '@/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error;
        
        if (session && mounted) {
          await loadProfile(session.user.id)
        } else if (mounted) {
          setLoading(false)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        if (mounted) setLoading(false)
      }
    }

    initAuth()

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id)
        if (session && mounted) {
          await loadProfile(session.user.id)
        } else if (mounted) {
          setUser(null)
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false;
      listener.subscription.unsubscribe()
    }
  }, [])

  async function loadProfile(authId: string) {
    console.log('Loading profile for:', authId)
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authId)
        .maybeSingle()
      
      if (error) {
        console.error('Error loading profile:', error)
        setUser(null)
      } else if (!data) {
        console.warn('No profile found for authId:', authId)
        setUser(null)
      } else {
        console.log('Profile loaded:', data.name)
        setUser(data)
      }
    } catch (error) {
      console.error('Unexpected error loading profile:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  async function signUp(userData: {
    name: string
    email: string
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
    const { data: authData, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: { emailRedirectTo: undefined }
    })
    
    if (error) throw error
 
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        auth_id: authData.user!.id,
        name: userData.name,
        email: userData.email,
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
 
  async function signIn(identifier: string, password: string) {
    let email = identifier
    
    // Check if identifier is a phone number (starts with 01 and is 11 digits)
    if (identifier.startsWith('01') && identifier.length === 11) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('phone', identifier)
        .single()
      
      if (userError || !userData) {
        throw new Error('এই মোবাইল নম্বর দিয়ে কোনো একাউন্ট পাওয়া যায়নি।')
      }
      email = userData.email
    }

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
