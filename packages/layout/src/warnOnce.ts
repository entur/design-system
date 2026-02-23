const warned = new Set<string>();

export function warnOnce(key: string, message: string): void {
  if (process.env.NODE_ENV !== 'production' && !warned.has(key)) {
    warned.add(key);
    console.warn(message);
  }
}
