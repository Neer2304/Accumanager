'use client'
import { SessionProvider } from "next-auth/react"

export default function GithubAuthLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}