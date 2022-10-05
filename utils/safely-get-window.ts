export const safelyGetWindow = (): typeof window | undefined => (typeof window !== 'undefined' ? window : undefined)
