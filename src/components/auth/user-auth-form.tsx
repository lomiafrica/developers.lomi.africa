"use client"

import { HTMLAttributes, useState } from 'react'
import Link from 'next/link'
import { z } from 'zod'
import { IconBrandGithub } from '@tabler/icons-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/ui/password-input'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/lib/hooks/use-toast'
import { AlertCircle } from "lucide-react"
import { Spinner } from '@/components/ui/spinner'

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(7),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isGithubLoading, setIsGithubLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isValidEmail, setIsValidEmail] = useState(false)
  const [isValidPassword, setIsValidPassword] = useState(false)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setIsValidEmail(formSchema.shape.email.safeParse(e.target.value).success)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setIsValidPassword(formSchema.shape.password.safeParse(e.target.value).success)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isValidEmail && isValidPassword) {
      setIsLoading(true)
      setErrorMessage('')
      try {
        const { data: signInData, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          let message = 'An error occurred during sign in'
          if (error.message.includes('Invalid login credentials')) {
            message = 'Invalid email or password'
          } else if (error.message.includes('Email not confirmed')) {
            message = 'Please confirm your email address'
          }
          setErrorMessage(message)
        } else if (signInData.user) {
          toast({
            title: 'Success',
            description: 'You have successfully signed in',
          })

          // Refresh the page to update the authentication state
          window.location.reload();
        }
      } catch (error) {
        console.error('Error during sign in:', error)
        setErrorMessage('An unexpected error occurred')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleOAuthSignIn = async (provider: 'github' | 'google') => {
    try {
      if (provider === 'google') setIsGoogleLoading(true)
      if (provider === 'github') setIsGithubLoading(true)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      if (error) throw error
      if (!data.url) throw new Error('No URL returned from Supabase')

      // Use window.location.href to ensure a full page reload
      window.location.href = data.url;
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error)
      setErrorMessage(`Error signing in with ${provider}`)
      if (provider === 'google') setIsGoogleLoading(false)
      if (provider === 'github') setIsGithubLoading(false)
    }
  }

  return (
    <div className={cn('grid gap-6 w-[300px] sm:w-full', className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className='grid gap-2'>
          <Input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            className={cn(
              'h-12 border rounded-none focus:border-blue-500 focus:ring-blue-500 bg-white text-black dark:bg-gray-800 dark:text-white',
              {
                'border-gray-300 dark:border-gray-600': !isValidEmail && email === '',
                'border-red-500 dark:border-red-500': !isValidEmail && email !== '',
                'border-green-500 dark:border-green-500': isValidEmail,
              }
            )}
            autoComplete="username"
          />
          <div className='flex justify-end mb-1'>
            <Link
              href='/forgot-password'
              className='text-sm font-medium text-blue-600 hover:text-blue-600 whitespace-nowrap'
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            className={cn(
              'h-12 border rounded-none focus:border-blue-500 focus:ring-blue-500 bg-white text-black dark:bg-gray-800 dark:text-white',
              {
                'border-gray-300 dark:border-gray-600': !isValidPassword && password === '',
                'border-red-500 dark:border-red-500': !isValidPassword && password !== '',
                'border-green-500 dark:border-green-500': isValidPassword,
              }
            )}
            autoComplete="current-password"
          />
          {errorMessage && (
            <div className="flex items-center gap-2 bg-red-50 text-red-900 px-4 py-3 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-sm font-medium">{errorMessage}</p>
            </div>
          )}
          <Button
            className='w-full h-12'
            type='submit'
            disabled={isLoading || !isValidEmail || !isValidPassword}
          >
            {isLoading ? (
              <Spinner className="w-4 h-4" />
            ) : (
              <span className="text-base font-semibold">Sign in</span>
            )}
          </Button>
        </div>
      </form>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t border-gray-300 dark:border-gray-600' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background px-2 text-gray-500'>
            Or continue with
          </span>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        <Button
          className="w-full h-12"
          variant="outline"
          onClick={() => handleOAuthSignIn('google')}
          disabled={isGoogleLoading || isGithubLoading}
        >
          {isGoogleLoading ? (
            <Spinner className="w-4 h-4" />
          ) : (
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          <span>&nbsp;Google</span>
        </Button>

        <Button
          variant='outline'
          className='w-full h-12'
          type='button'
          disabled={isGoogleLoading || isGithubLoading}
          onClick={() => handleOAuthSignIn('github')}
        >
          {isGithubLoading ? (
            <Spinner className="w-4 h-4" />
          ) : (
            <IconBrandGithub className='h-6 w-6 mr-2' />
          )}
          <span>&nbsp;GitHub</span>
        </Button>
      </div>
      <p className='px-8 text-center text-sm text-muted-foreground'>
        Don&apos;t have an account?{' '}
        <Link
          href='/sign-up'
          className='underline underline-offset-4 text-blue-600 hover:text-blue-600'
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}