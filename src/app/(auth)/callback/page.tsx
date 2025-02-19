'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/lib/contexts/auth-context'

export default function AuthCallbackPage() {
    const router = useRouter()
    const params = useSearchParams()
    const { refreshSession } = useAuth()

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                // Get the token from URL if it exists
                const token = params?.get('token')
                const type = params?.get('type')

                // If we have a token, handle OTP verification
                if (token) {
                    if (type === 'recovery') {
                        const { error } = await supabase.auth.verifyOtp({
                            token_hash: token,
                            type: 'recovery'
                        })
                        if (error) throw error
                        router.replace('/reset-password')
                        return
                    }

                    // Handle email verification
                    const { error } = await supabase.auth.verifyOtp({
                        token_hash: token,
                        type: 'signup'
                    })
                    if (error) throw error
                }

                // Get the session
                const { data: { session }, error } = await supabase.auth.getSession()

                if (error) {
                    console.error('Error during auth callback:', error)
                    router.replace('/sign-in')
                    return
                }

                if (!session) {
                    console.error('No session found')
                    router.replace('/sign-in')
                    return
                }

                // Refresh the auth context
                await refreshSession()

                // Make sure the session is properly set before redirecting
                await new Promise(resolve => setTimeout(resolve, 2000))

                // Redirect to docs
                router.replace('/docs/introduction/what-is-lomi')
            } catch (error) {
                console.error('Error during auth callback:', error)
                router.replace('/sign-in')
            }
        }

        handleAuthCallback()
    }, [router, params, refreshSession])

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-semibold mb-4">Redirecting...</h1>
                <p className="text-muted-foreground">Please wait while we complete your sign in.</p>
            </div>
        </div>
    )
} 