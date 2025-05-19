import type { Metadata } from "next"
import Link from "next/link"
import { GlassPanel } from "@/components/glass-panel"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"

export const metadata: Metadata = {
  title: "Privacy Policy | Keytake",
  description:
    "Learn how Keytake collects, uses, and protects your personal information when you use our AI-powered video note-taking platform.",
  openGraph: {
    title: "Privacy Policy | Keytake",
    description:
      "Learn how Keytake collects, uses, and protects your personal information when you use our AI-powered video note-taking platform.",
    url: "https://keytake.com/legal/privacy",
    type: "website",
  },
  alternates: {
    canonical: "https://keytake.com/legal/privacy",
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="page-transition">
      <section className="w-full py-16 md:py-24 px-4">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumbs */}
            <Breadcrumbs
              className="mb-8"
              customLabels={{
                "/legal": "Legal",
                "/legal/privacy": "Privacy Policy",
              }}
            />

            {/* Header */}
            <div className="mb-12 text-center">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
              <p className="text-foreground/70">Last updated: April 29, 2023</p>
            </div>

            {/* Content */}
            <GlassPanel className="p-8 md:p-12 mb-12 border-foreground/10">
              <div className="prose dark:prose-invert max-w-none">
                <p>
                  At Keytake, we take your privacy seriously. This Privacy Policy explains how we collect, use,
                  disclose, and safeguard your information when you visit our website and use our services.
                </p>

                <h2>Information We Collect</h2>

                <h3>Personal Information</h3>
                <p>We may collect personal information that you voluntarily provide to us when you:</p>
                <ul>
                  <li>Register for an account</li>
                  <li>Sign up for our newsletter</li>
                  <li>Contact our support team</li>
                  <li>Participate in surveys or promotions</li>
                  <li>Post comments or feedback</li>
                </ul>
                <p>This information may include your name, email address, and other contact details.</p>

                <h3>Usage Information</h3>
                <p>
                  We automatically collect certain information about your device and how you interact with our services,
                  including:
                </p>
                <ul>
                  <li>IP address</li>
                  <li>Browser type</li>
                  <li>Operating system</li>
                  <li>Pages visited</li>
                  <li>Time spent on pages</li>
                  <li>Referring website</li>
                  <li>Other browsing information</li>
                </ul>

                <h3>User Content</h3>
                <p>When you use our services to generate notes from videos, we collect:</p>
                <ul>
                  <li>Video URLs you submit</li>
                  <li>Generated notes and summaries</li>
                  <li>Your interactions with the content</li>
                  <li>Folders, tags, and organizational structures you create</li>
                </ul>

                <h2>How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process and complete transactions</li>
                  <li>Send administrative information, such as updates, security alerts, and support messages</li>
                  <li>Respond to your comments, questions, and requests</li>
                  <li>Personalize your experience and deliver content relevant to your interests</li>
                  <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
                  <li>Detect, prevent, and address technical issues</li>
                  <li>Develop new products, services, features, and functionality</li>
                </ul>

                <h2>How We Share Your Information</h2>
                <p>We may share your information in the following situations:</p>
                <ul>
                  <li>
                    <strong>With Service Providers:</strong> We may share your information with third-party vendors,
                    service providers, contractors, or agents who perform services for us.
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> We may share or transfer your information in connection with,
                    or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a
                    portion of our business to another company.
                  </li>
                  <li>
                    <strong>With Your Consent:</strong> We may disclose your information for any other purpose with your
                    consent.
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> We may disclose your information where required to do so by law
                    or in response to valid requests by public authorities.
                  </li>
                </ul>

                <h2>Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect the security of your
                  personal information. However, please be aware that no method of transmission over the Internet or
                  method of electronic storage is 100% secure.
                </p>

                <h2>Your Privacy Rights</h2>
                <p>
                  Depending on your location, you may have certain rights regarding your personal information,
                  including:
                </p>
                <ul>
                  <li>The right to access your personal information</li>
                  <li>The right to rectify inaccurate information</li>
                  <li>The right to request deletion of your information</li>
                  <li>The right to restrict processing of your information</li>
                  <li>The right to data portability</li>
                  <li>The right to object to processing</li>
                </ul>
                <p>
                  To exercise these rights, please contact us using the information provided in the "Contact Us" section
                  below.
                </p>

                <h2>Children's Privacy</h2>
                <p>
                  Our services are not intended for individuals under the age of 16. We do not knowingly collect
                  personal information from children. If you are a parent or guardian and believe that your child has
                  provided us with personal information, please contact us, and we will take steps to delete such
                  information.
                </p>

                <h2>Changes to This Privacy Policy</h2>
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the
                  new Privacy Policy on this page.
                </p>

                <h2>Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at{" "}
                  <a href="mailto:support@keytake.com">support@keytake.com</a>.
                </p>
              </div>
            </GlassPanel>

            {/* Back Button */}
            <Button asChild variant="ghost" className="w-full md:w-auto justify-start">
              <Link href="/legal">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Legal
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
