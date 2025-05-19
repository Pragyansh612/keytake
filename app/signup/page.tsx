import type { Metadata } from "next"
import { SignupClientPage } from "./SignupClientPage"

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your Keytake account and start transforming videos into comprehensive notes.",
}

export default function SignupPage() {
  return <SignupClientPage />
}
