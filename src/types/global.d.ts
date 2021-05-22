const Fetch = import('node-fetch').default

declare global {
  namespace NodeJS {
    interface Global {
      fetch: Fetch // For node-fetch
    }
  }
}

export {}
