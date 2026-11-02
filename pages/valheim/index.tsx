import { useCallback, useEffect, useRef, useState } from 'react'

import Head from 'next/head'

import { SEO } from '@components/SEO'

const API_URL = process.env.NEXT_PUBLIC_VALHEIM_API_URL
const STORAGE_KEY = 'valheim-control-password'
const POLL_MS = 5000
const CODE_POLL_MS = 10000
const CODE_POLL_MAX_MS = 10 * 60 * 1000
const IDLE_POLL_MS = 60000
const WORLD_NAME = 'aaaaa'

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
  const [checkedAt, setCheckedAt] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [confirmStop, setConfirmStop] = useState(false)
  const passwordRef = useRef<string | null>(null)
  const failuresRef = useRef(0)

  const lock = useCallback(() => {
    clearStoredPassword()
    passwordRef.current = null
    setPassword(null)
    setStatus(null)
    setCheckedAt(null)
    setConfirmStop(false)
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
          setCheckedAt(Date.now())
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

  // A slow background refresh keeps the page honest while it sits open (idle stop, nightly stop).
  useEffect(() => {
    if (!password || transitioning || waitingForCode) {
      return
    }
    const id = setInterval(() => {
      if (!document.hidden && failuresRef.current < 6) void run(password, 'status')
    }, IDLE_POLL_MS)
    return () => clearInterval(id)
  }, [password, transitioning, waitingForCode, run])

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (state !== 'running') {
      setConfirmStop(false)
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

  const phase = phaseOf(state, !!joinCode)
  const view = PHASES[phase]

  return (
    <>
      <SEO title='Valheim | Phil Chan' />
      <Head>
        <meta name='robots' content='noindex, nofollow' />
      </Head>
      <div className='mx-auto flex max-w-[70ch] flex-col gap-6 py-12 px-5'>
        <header className='flex flex-wrap items-end justify-between gap-3'>
          <div>
            <p className='text-sm uppercase tracking-[0.2em] opacity-60'>Server status</p>
            <h1 className='text-3xl font-semibold'>Valheim</h1>
          </div>
          {password && (
            <div className='flex items-center gap-2 text-sm'>
              <span className='opacity-60'>{checkedAt ? `Checked ${ago(now - checkedAt)}` : 'Checking...'}</span>
              <IconButton label='Refresh' disabled={busy} onClick={() => void run(password, 'status')}>
                <RefreshIcon spinning={busy} />
              </IconButton>
              <IconButton label='Lock' onClick={lock}>
                <LockIcon />
              </IconButton>
            </div>
          )}
        </header>

        {!password ? (
          <Card className='flex flex-col items-center gap-5 py-12 text-center'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-stone-200/70 dark:bg-stone-700/60'>
              <LockIcon />
            </div>
            <div>
              <p className='text-lg font-semibold'>Private server</p>
              <p className='text-sm opacity-60'>Enter the password to see and control the server.</p>
            </div>
            <form
              className='flex w-full max-w-xs flex-col gap-3'
              onSubmit={e => {
                e.preventDefault()
                if (input) {
                  unlock(input)
                  setInput('')
                }
              }}
            >
              <input
                type='password'
                aria-label='Password'
                placeholder='Password'
                autoComplete='current-password'
                className='rounded-md border border-stone-300 bg-transparent px-3 py-2 text-center outline-none transition-colors focus:border-stone-500 dark:border-stone-600 dark:focus:border-stone-400'
                value={input}
                onInput={e => setInput((e.target as HTMLInputElement).value)}
              />
              <button
                type='submit'
                disabled={!input}
                className='rounded-md bg-stone-800 py-2 font-semibold text-stone-50 transition-opacity disabled:opacity-40 hover:opacity-90 dark:bg-stone-100 dark:text-stone-900'
              >
                Unlock
              </button>
            </form>
          </Card>
        ) : (
          <>
            <section className={`flex items-center gap-4 rounded-xl border p-5 ${view.banner}`} aria-live='polite'>
              <StatusDot tone={view.tone} pulse={view.pulse} large />
              <div className='flex flex-col'>
                <span className='text-xl font-semibold'>{view.title}</span>
                <span className='text-sm opacity-75'>
                  {phase === 'loading' && codeGaveUp
                    ? 'Still no join code. Reload to check again, or join by IP.'
                    : view.detail}
                </span>
              </div>
            </section>

            {(phase === 'booting' || phase === 'loading') && <StartSteps phase={phase} />}

            {state === 'running' && (
              <Card className='flex flex-col gap-5'>
                <div className='flex flex-col gap-2'>
                  <span className='text-sm uppercase tracking-[0.15em] opacity-60'>Crossplay join code</span>
                  {joinCode ? (
                    <div className='flex flex-wrap items-center gap-4'>
                      <div className='flex gap-1.5' aria-label={`Join code ${joinCode}`}>
                        {joinCode.split('').map((ch, i) => (
                          <span
                            key={i}
                            className='flex h-14 w-10 items-center justify-center rounded-md border border-stone-300 bg-stone-100 text-3xl font-semibold dark:border-stone-600 dark:bg-stone-800'
                          >
                            {ch}
                          </span>
                        ))}
                      </div>
                      <CopyButton copied={copied === 'code'} onClick={() => void copy('code', joinCode)} />
                    </div>
                  ) : (
                    <div className='flex gap-1.5'>
                      {Array.from({ length: 6 }, (_, i) => (
                        <span
                          key={i}
                          className='h-14 w-10 animate-pulse rounded-md border border-dashed border-stone-300 dark:border-stone-600'
                        />
                      ))}
                    </div>
                  )}
                  <span className='text-sm opacity-60'>In Valheim: Join game, Add server, enter the code.</span>
                </div>
                {address && (
                  <div className='flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 pt-4 dark:border-stone-700'>
                    <div className='flex flex-col'>
                      <span className='text-sm opacity-60'>Steam: join by IP</span>
                      <code className='text-base'>{address}</code>
                    </div>
                    <CopyButton copied={copied === 'ip'} onClick={() => void copy('ip', address)} />
                  </div>
                )}
              </Card>
            )}

            <Card className='flex flex-col divide-y divide-stone-200 p-0 dark:divide-stone-700'>
              <ComponentRow name='Server' sub='EC2 · us-west-2' status={serverStatus(state)} />
              <ComponentRow name='World' sub={WORLD_NAME} status={worldStatus(state, !!joinCode, codeGaveUp)} />
            </Card>

            <div className='flex flex-wrap gap-3'>
              {state === 'running' || state === 'stopping' ? (
                confirmStop ? (
                  <>
                    <ActionButton
                      tone='danger'
                      disabled={busy}
                      onClick={() => void run(password, 'stop').then(() => setConfirmStop(false))}
                    >
                      Yes, stop it
                    </ActionButton>
                    <ActionButton tone='plain' onClick={() => setConfirmStop(false)}>
                      Cancel
                    </ActionButton>
                    <span className='self-center text-sm opacity-60'>
                      Anyone online gets kicked. The world saves first.
                    </span>
                  </>
                ) : (
                  <ActionButton
                    tone='plain'
                    disabled={busy || state !== 'running'}
                    onClick={() => setConfirmStop(true)}
                  >
                    Stop server
                  </ActionButton>
                )
              ) : (
                <ActionButton
                  tone='go'
                  disabled={busy || state !== 'stopped'}
                  onClick={() => void run(password, 'start')}
                >
                  {state === 'pending' ? 'Starting...' : 'Start server'}
                </ActionButton>
              )}
            </div>

            <ul className='flex flex-col gap-1 text-sm opacity-60'>
              <li>Shuts itself down after 30 minutes with nobody online.</li>
              <li>Also stops every night at 5:00 AM Pacific.</li>
              <li>The world backs up hourly and on every shutdown.</li>
            </ul>
          </>
        )}

        {error && (
          <p
            role='alert'
            className='rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-800 dark:bg-rose-900/40 dark:text-rose-200'
          >
            {error}
          </p>
        )}
      </div>
    </>
  )
}

type Phase = 'checking' | 'booting' | 'loading' | 'online' | 'stopping' | 'offline'
type Tone = 'green' | 'amber' | 'grey'

const phaseOf = (state: string | undefined, hasCode: boolean): Phase => {
  if (!state) return 'checking'
  if (state === 'pending') return 'booting'
  if (state === 'running') return hasCode ? 'online' : 'loading'
  if (state === 'stopping' || state === 'shutting-down') return 'stopping'
  return 'offline'
}

const BANNER: Record<Tone, string> = {
  green:
    'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100',
  amber: 'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-900/40 dark:text-amber-100',
  grey: 'border-stone-300 bg-stone-100 text-stone-800 dark:border-stone-700 dark:bg-stone-800/60 dark:text-stone-100',
}

const PHASES: Record<Phase, { title: string; detail: string; tone: Tone; pulse: boolean; banner: string }> = {
  checking: {
    title: 'Checking...',
    detail: 'Asking the server how it is doing.',
    tone: 'grey',
    pulse: true,
    banner: BANNER.grey,
  },
  booting: {
    title: 'Starting up',
    detail: 'Booting the machine. This takes a minute or two.',
    tone: 'amber',
    pulse: true,
    banner: BANNER.amber,
  },
  loading: {
    title: 'Loading the world',
    detail: 'The join code shows up once the world is loaded.',
    tone: 'amber',
    pulse: true,
    banner: BANNER.amber,
  },
  online: { title: 'Online', detail: 'Ready to join.', tone: 'green', pulse: true, banner: BANNER.green },
  stopping: {
    title: 'Shutting down',
    detail: 'Saving the world and backing it up.',
    tone: 'amber',
    pulse: true,
    banner: BANNER.amber,
  },
  offline: { title: 'Offline', detail: 'Start the server to play.', tone: 'grey', pulse: false, banner: BANNER.grey },
}

type RowStatus = { label: string; tone: Tone }

const serverStatus = (state: string | undefined): RowStatus => {
  if (state === 'running') return { label: 'Running', tone: 'green' }
  if (state === 'pending') return { label: 'Booting', tone: 'amber' }
  if (state === 'stopping' || state === 'shutting-down') return { label: 'Stopping', tone: 'amber' }
  if (!state) return { label: 'Unknown', tone: 'grey' }
  return { label: 'Stopped', tone: 'grey' }
}

const worldStatus = (state: string | undefined, hasCode: boolean, gaveUp: boolean): RowStatus => {
  if (state !== 'running') return { label: state ? 'Not loaded' : 'Unknown', tone: 'grey' }
  if (hasCode) return { label: 'Loaded', tone: 'green' }
  return { label: gaveUp ? 'No join code' : 'Loading', tone: 'amber' }
}

const ago = (ms: number) => {
  const s = Math.max(0, Math.round(ms / 1000))
  if (s < 5) return 'just now'
  if (s < 60) return `${s}s ago`
  return `${Math.floor(s / 60)}m ago`
}

const DOT: Record<Tone, string> = { green: 'bg-emerald-500', amber: 'bg-amber-500', grey: 'bg-stone-400' }

const StatusDot: React.FC<{ tone: Tone; pulse?: boolean; large?: boolean }> = ({ tone, pulse, large }) => (
  <span className={`relative flex shrink-0 ${large ? 'h-4 w-4' : 'h-2.5 w-2.5'}`}>
    {pulse && (
      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${DOT[tone]}`} />
    )}
    <span className={`relative inline-flex h-full w-full rounded-full ${DOT[tone]}`} />
  </span>
)

const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <section
    className={`rounded-xl border border-stone-200 bg-white/60 p-5 dark:border-stone-700 dark:bg-stone-900/40 ${className}`}
  >
    {children}
  </section>
)

const ComponentRow: React.FC<{ name: string; sub: string; status: RowStatus }> = ({ name, sub, status }) => (
  <div className='flex items-center justify-between gap-3 px-5 py-4'>
    <div className='flex flex-col'>
      <span className='font-semibold'>{name}</span>
      <span className='text-sm opacity-60'>{sub}</span>
    </div>
    <span className='flex items-center gap-2 text-sm'>
      <StatusDot tone={status.tone} />
      {status.label}
    </span>
  </div>
)

const StartSteps: React.FC<{ phase: Phase }> = ({ phase }) => {
  const steps = ['Boot', 'Load world', 'Ready']
  const current = phase === 'booting' ? 0 : 1
  return (
    <ol className='flex items-center gap-2 text-sm'>
      {steps.map((step, i) => (
        <li key={step} className='flex flex-1 items-center gap-2'>
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs ${
              i < current
                ? 'border-emerald-500 bg-emerald-500 text-white'
                : i === current
                ? 'animate-pulse border-amber-500 text-amber-600 dark:text-amber-300'
                : 'border-stone-300 opacity-60 dark:border-stone-600'
            }`}
          >
            {i < current ? <CheckIcon /> : i + 1}
          </span>
          <span className={i > current ? 'opacity-60' : ''}>{step}</span>
          {i < steps.length - 1 && <span className='h-px flex-1 bg-stone-300 dark:bg-stone-600' />}
        </li>
      ))}
    </ol>
  )
}

const ACTION: Record<'go' | 'danger' | 'plain', string> = {
  go: 'bg-emerald-600 text-white hover:bg-emerald-700',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
  plain: 'border border-stone-300 hover:bg-stone-100 dark:border-stone-600 dark:hover:bg-stone-800',
}

const ActionButton: React.FC<{
  tone: 'go' | 'danger' | 'plain'
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}> = ({ tone, disabled, onClick, children }) => (
  <button
    type='button'
    disabled={disabled}
    onClick={onClick}
    className={`rounded-md px-5 py-2 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${ACTION[tone]}`}
  >
    {children}
  </button>
)

const IconButton: React.FC<{ label: string; disabled?: boolean; onClick: () => void; children: React.ReactNode }> = ({
  label,
  disabled,
  onClick,
  children,
}) => (
  <button
    type='button'
    title={label}
    aria-label={label}
    disabled={disabled}
    onClick={onClick}
    className='flex h-8 w-8 items-center justify-center rounded-md border border-stone-300 transition-colors disabled:opacity-40 hover:bg-stone-100 dark:border-stone-600 dark:hover:bg-stone-800'
  >
    {children}
  </button>
)

const CopyButton: React.FC<{ copied: boolean; onClick: () => void }> = ({ copied, onClick }) => (
  <button
    type='button'
    onClick={onClick}
    className='rounded-md border border-stone-300 px-3 py-1 text-sm transition-colors hover:bg-stone-100 dark:border-stone-600 dark:hover:bg-stone-800'
  >
    {copied ? 'Copied' : 'Copy'}
  </button>
)

const CheckIcon: React.FC = () => (
  <svg
    width='12'
    height='12'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='3'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
  >
    <path d='M5 12l5 5L20 7' />
  </svg>
)

const LockIcon: React.FC = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
  >
    <rect x='4' y='11' width='16' height='10' rx='2' />
    <path d='M8 11V7a4 4 0 0 1 8 0v4' />
  </svg>
)

const RefreshIcon: React.FC<{ spinning?: boolean }> = ({ spinning }) => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
    className={spinning ? 'animate-spin' : ''}
  >
    <path d='M21 12a9 9 0 1 1-3-6.7L21 8' />
    <path d='M21 3v5h-5' />
  </svg>
)

export default Valheim
