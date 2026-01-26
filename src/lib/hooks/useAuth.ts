import { useEffect, useState, useCallback } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../auth/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [signingOut, setSigningOut] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check active session on mount
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          setError(error.message)
          setLoading(false)
          return
        }
        setUser(session?.user ?? null)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })

    // Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
        setError(null)
      }
    )

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe()
  }, [])

  // Sign out function
  const signOut = useCallback(async () => {
    setSigningOut(true)
    const { error } = await supabase.auth.signOut()
    if (error) {
      setError(error.message)
      setSigningOut(false)
    } else {
      setUser(null)
      setSigningOut(false)
    }
  }, [])

  return {
    user,                        // Current user object or null
    loading,                     // Initial loading (checking session)
    signingOut,                  // Loading state for logout action
    error,                       // Any error message
    isAuthenticated: !!user,     // Boolean helper: is user logged in?
    signOut                      // Function to log out
  }
}