'use client'

import { useEffect, useState } from 'react'
import { supabase, phoneToEmail } from '@/lib/supabase'
import { User } from '@/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadProfile(session: any) {
      console.log('useAuth: loadProfile called for session:', session.user.id)
      if (!session?.user || !mounted) return

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', session.user.id)
          .maybeSingle()
        
        if (error) {
          console.error('useAuth: loadProfile - Supabase error:', error)
          throw error
        }

        console.log('useAuth: loadProfile - Data received:', data)
        if (data) {
          console.log('useAuth: loadProfile - Profile found:', data)
          if (mounted) setUser(data)
        } else {
          console.warn('useAuth: loadProfile - No profile found for user:', session.user.id)
          if (mounted) setUser(null)
        }
      } catch (error) {
        console.error('useAuth: loadProfile - Catch block error:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        loadProfile(session)
      } else {
        console.log('useAuth: No session found, setting loading to false')
        if (mounted) setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuth: Auth state changed:', event, session)
        if (session) {
          await loadProfile(session)
        } else {
          console.log('useAuth: No session in auth state change, setting user null and loading false')
          if (mounted) {
            setUser(null)
            setLoading(false)
          }
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function signUp(userData: any) {
    const email = phoneToEmail(userData.phone)
    console.log('useAuth: signUp - Attempting auth for:', email)
    
    // Auth ইউজার তৈরি
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: userData.password,
    })
    
    if (authError) {
      console.error('useAuth: signUp - Auth error:', authError)
      throw authError
    }
    
    if (!authData.user) throw new Error('Auth user creation failed')
 
    console.log('useAuth: signUp - Auth success, user ID:', authData.user.id)

    // প্রোফাইল ইনসার্ট
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        auth_id: authData.user.id,
        name: userData.name,
        email: email,
        phone: userData.phone,
        blood_group: userData.blood_group,
        district: userData.district,
        upazila: userData.upazila,
        is_donor: true,
      })
 
    if (profileError) {
      console.error('useAuth: signUp - Profile creation error:', profileError)
      await supabase.auth.signOut()
      throw profileError
    }

    console.log('useAuth: signUp - Profile creation success')
    
    // প্রোফাইল ইনসার্ট হওয়ার পর ম্যানুয়ালি ইউজার সেট করুন
    setUser({
      auth_id: authData.user.id,
      name: userData.name,
      email: email,
      phone: userData.phone,
      blood_group: userData.blood_group,
      district: userData.district,
      upazila: userData.upazila,
      is_donor: true,
    } as any)

    return authData
  }
  
  async function signIn(identifier: string, password: string) {
    console.log('useAuth: signIn called with identifier:', identifier)
    // Check if identifier is a phone number
    const isPhone = /^\d+$/.test(identifier.replace(/\D/g, '')) && identifier.length >= 10
    const email = isPhone ? phoneToEmail(identifier) : identifier
    console.log('useAuth: signIn - Computed email:', email)

    console.log('useAuth: signIn - Calling supabase.auth.signInWithPassword...')
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      console.error('useAuth: signIn - Supabase error:', error)
      throw error
    }
    console.log('useAuth: signIn - Supabase success, data:', data)
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
