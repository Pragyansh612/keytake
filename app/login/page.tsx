import type { Metadata } from "next"
import LoginClient from "./LoginClient"

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Keytake account",
}

export default function LoginPage() {
  return <LoginClient />
}