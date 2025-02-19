'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
    const router = useRouter()

    useEffect(() => {
        const handleAuthCallback = async () => {
            const { error } = await supabase.auth.getSession()
            if (error) {
                console.error('Error during auth callback:', error)
            }
            router.push('/')
        }

        handleAuthCallback()
    }, [router])

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-semibold mb-4">Redirecting...</h1>
                <p className="text-muted-foreground">Please wait while we complete your sign in.</p>
            </div>
        </div>
    )
} 