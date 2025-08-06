import type { Metadata } from "next"
import { LoginClientPage } from "./LoginClient"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Keytake account and continue your learning journey.",
}

export default function LoginPage() {
  return <LoginClientPage />
}