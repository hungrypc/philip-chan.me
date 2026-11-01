import { useCallback, useEffect, useRef, useState } from 'react'

import Head from 'next/head'

import { SEO } from '@components/SEO'

const API_URL = process.env.NEXT_PUBLIC_VALHEIM_API_URL
const STORAGE_KEY = 'valheim-control-password'
const POLL_MS = 5000
const CODE_POLL_MS = 10000
const CODE_POLL_MAX_MS = 10 * 60 * 1000

type ServerStatus = {
  state: string
  ip: string | null
  port: number
  joinCode?: string | null
}

type Action = 'status' | 'start' | 'stop'

class UnauthorizedError extends Error {}

const readStoredPassword = (): string | null => {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

const storePassword = (value: string) => {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, value)
  } catch {
    // storage unavailable: the page still works for this render
  }
}

const clearStoredPassword = () => {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // storage unavailable
  }
}

const callApi = async (password: string, action: Action): Promise<ServerStatus> => {
  if (!API_URL) {
    throw new Error('API URL is not configured')
  }
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-control-password': password },
    body: JSON.stringify({ action }),
  })
  if (res.status === 401) {
    throw new UnauthorizedError()
  }
  if (!res.ok) {
    throw new Error(`Server returned ${res.status}`)
  }
  return (await res.json()) as ServerStatus
}

const Valheim: React.FC = () => {
  const [password, setPassword] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<ServerStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState<'code' | 'ip' | null>(null)
  const [codeGaveUp, setCodeGaveUp] = useState(false)
  const passwordRef = useRef<string | null>(null)
  const failuresRef = useRef(0)

  const lock = useCallback(() => {
    clearStoredPassword()
    passwordRef.current = null
    setPassword(null)
    setStatus(null)
  }, [])

  const run = useCallback(
    async (pw: string, action: Action) => {
      setBusy(true)
      try {
        const next = await callApi(pw, action)
        // Ignore the result if the user locked the page while the request was in flight.
        if (passwordRef.current === pw) {
          failuresRef.current = 0
          setStatus(next)
          setError(null)
        }
      } catch (e) {
        if (passwordRef.current !== pw) {
          // A late failure from a previous session must not affect the current one.
        } else if (e instanceof UnauthorizedError) {
          lock()
          setError('Wrong password')
        } else {
          failuresRef.current += 1
          setError('Could not reach the server controller. Try again in a moment.')
        }
      } finally {
        setBusy(false)
      }
    },
    [lock],
  )

  const unlock = useCallback(
    (pw: string) => {
      passwordRef.current = pw
      failuresRef.current = 0
      setPassword(pw)
      setError(null)
      storePassword(pw)
      void run(pw, 'status')
    },
    [run],
  )

  useEffect(() => {
    const stored = readStoredPassword()
    if (stored) {
      unlock(stored)
    }
  }, [unlock])

  const state = status?.state
  const transitioning = state === 'pending' || state === 'stopping'

  useEffect(() => {
    if (!password || !transitioning) {
      return
    }
    const id = setInterval(() => {
      // Stop hammering the API after repeated failures; the buttons and a reload still work.
      if (failuresRef.current < 6) void run(password, 'status')
    }, POLL_MS)
    return () => clearInterval(id)
  }, [password, transitioning, run])

  // While running with no join code yet, poll every 10 s for up to 10 min.
  const joinCode = status?.joinCode ?? null
  const waitingForCode = !!password && state === 'running' && !joinCode && !codeGaveUp
  useEffect(() => {
    if (!waitingForCode || !password) {
      return
    }
    const poll = setInterval(() => {
      if (failuresRef.current < 6) void run(password, 'status')
    }, CODE_POLL_MS)
    const giveUp = setTimeout(() => setCodeGaveUp(true), CODE_POLL_MAX_MS)
    return () => {
      clearInterval(poll)
      clearTimeout(giveUp)
    }
  }, [waitingForCode, password, run])

  useEffect(() => {
    if (state !== 'running') {
      setCodeGaveUp(false)
    }
  }, [state])

  const address = status?.ip ? `${status.ip}:${status.port}` : null

  const copy = async (what: 'code' | 'ip', text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(what)
      setTimeout(() => setCopied(null), 1500)
    } catch {
      setError('Could not copy. Select the text and copy it manually.')
    }
  }

  return (
    <>
      <SEO title='Valheim | Phil Chan' />
      <Head>
        <meta name='robots' content='noindex, nofollow' />
      </Head>
      <div className='mx-auto flex max-w-[75ch] flex-col gap-6 py-12 px-5'>
        <h1 className='text-3xl'>Valheim server</h1>

        {!password ? (
          <form
            className='flex flex-col gap-4'
            onSubmit={e => {
              e.preventDefault()
              if (input) {
                unlock(input)
                setInput('')
              }
            }}
          >
            <label className='flex flex-col gap-2'>
              <span>Password</span>
              <input
                type='password'
                autoComplete='current-password'
                className='rounded-sm border-2 border-stone-200 bg-transparent p-2 dark:border-stone-500'
                value={input}
                onInput={e => setInput((e.target as HTMLInputElement).value)}
              />
            </label>
            <button type='submit' className='link-btn self-start py-1 px-3'>
              unlock
            </button>
          </form>
        ) : (
          <div className='flex flex-col gap-4'>
            <p>
              State: <strong>{state ?? 'loading...'}</strong>
              {transitioning && ' (checking every 5s)'}
            </p>
            {state === 'running' && (
              <div className='flex flex-col gap-3'>
                {joinCode ? (
                  <p className='flex flex-wrap items-center gap-3'>
                    <span>Join code:</span>
                    <code className='text-3xl font-semibold'>{joinCode}</code>
                    <button type='button' className='link-btn py-1 px-3' onClick={() => void copy('code', joinCode)}>
                      {copied === 'code' ? 'copied' : 'copy'}
                    </button>
                  </p>
                ) : (
                  <p>
                    {codeGaveUp
                      ? 'No join code yet. Reload the page to check again, or use the IP below.'
                      : 'Join code appears once the world loads.'}
                  </p>
                )}
                {address && (
                  <p className='flex flex-wrap items-center gap-3 text-sm'>
                    <span>Steam fallback (Join by IP):</span>
                    <code>{address}</code>
                    <button type='button' className='link-btn py-1 px-3' onClick={() => void copy('ip', address)}>
                      {copied === 'ip' ? 'copied' : 'copy'}
                    </button>
                  </p>
                )}
              </div>
            )}
            <div className='flex gap-3'>
              <button
                type='button'
                className='link-btn py-1 px-3 disabled:opacity-40'
                disabled={busy || state !== 'stopped'}
                onClick={() => void run(password, 'start')}
              >
                start
              </button>
              <button
                type='button'
                className='link-btn py-1 px-3 disabled:opacity-40'
                disabled={busy || state !== 'running'}
                onClick={() => void run(password, 'stop')}
              >
                stop
              </button>
              <button type='button' className='link-btn py-1 px-3' onClick={lock}>
                lock
              </button>
            </div>
          </div>
        )}

        {error && <p role='alert'>{error}</p>}
      </div>
    </>
  )
}

export default Valheim
