import type { Metadata } from "next"
import Link from "next/link"
import { GlassPanel } from "@/components/glass-panel"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service | Keytake",
  description: "The terms and conditions governing your use of Keytake's services",
  openGraph: {
    title: "Terms of Service | Keytake",
    description: "The terms and conditions governing your use of Keytake's services",
    url: "https://keytake.com/legal/terms",
    type: "website",
  },
}

export default function TermsOfServicePage() {
  return (
    <div className="page-transition">
      <section className="w-full py-16 md:py-24 px-4">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <div className="mb-8">
              <Button variant="ghost" size="sm" asChild className="group">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Back to Home
                </Link>
              </Button>
            </div>

            {/* Header */}
            <div className="mb-12 text-center">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
              <p className="text-foreground/70">Last updated: April 29, 2023</p>
            </div>

            {/* Content */}
            <GlassPanel className="p-8 md:p-12 mb-12 border-foreground/10">
              <div className="prose dark:prose-invert max-w-none">
                <p>
                  Please read these Terms of Service ("Terms") carefully before using the Keytake website and services.
                </p>

                <h2>1. Agreement to Terms</h2>
                <p>
                  By accessing or using our services, you agree to be bound by these Terms. If you disagree with any
                  part of the Terms, you may not access the service.
                </p>

                <h2>2. Description of Service</h2>
                <p>
                  Keytake provides an AI-powered platform that generates structured notes from video content
                  ("Service"). The Service may include features such as note generation, organization, sharing, and
                  exporting.
                </p>

                <h2>3. User Accounts</h2>
                <p>
                  To access certain features of the Service, you must register for an account. You agree to provide
                  accurate, current, and complete information during the registration process and to update such
                  information to keep it accurate, current, and complete.
                </p>
                <p>
                  You are responsible for safeguarding the password that you use to access the Service and for any
                  activities or actions under your password. You agree not to disclose your password to any third party.
                  You must notify us immediately upon becoming aware of any breach of security or unauthorized use of
                  your account.
                </p>

                <h2>4. User Content</h2>
                <p>
                  Our Service allows you to submit, store, and share content, including but not limited to video URLs,
                  generated notes, and organizational structures ("User Content").
                </p>
                <p>
                  You retain all rights to your User Content. By submitting User Content to the Service, you grant us a
                  worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate,
                  and distribute your User Content in connection with providing and improving the Service.
                </p>
                <p>You represent and warrant that:</p>
                <ul>
                  <li>
                    You own or have the necessary rights to your User Content and have the right to grant the license
                    described above.
                  </li>
                  <li>
                    Your User Content does not violate the privacy rights, publicity rights, copyrights, contract
                    rights, or any other rights of any person or entity.
                  </li>
                </ul>

                <h2>5. Acceptable Use</h2>
                <p>You agree not to use the Service to:</p>
                <ul>
                  <li>Violate any applicable laws or regulations.</li>
                  <li>Infringe upon the rights of others.</li>
                  <li>Submit false or misleading information.</li>
                  <li>Upload or transmit viruses or malicious code.</li>
                  <li>Interfere with or disrupt the Service or servers or networks connected to the Service.</li>
                  <li>Collect or track personal information of other users.</li>
                  <li>Spam, phish, or engage in any other unwanted solicitation.</li>
                  <li>
                    Use the Service for any purpose that is harmful, threatening, abusive, harassing, defamatory, or
                    otherwise objectionable.
                  </li>
                </ul>

                <h2>6. Intellectual Property</h2>
                <p>
                  The Service and its original content (excluding User Content), features, and functionality are and
                  will remain the exclusive property of Keytake and its licensors. The Service is protected by
                  copyright, trademark, and other laws of both the United States and foreign countries.
                </p>
                <p>
                  Our trademarks and trade dress may not be used in connection with any product or service without the
                  prior written consent of Keytake.
                </p>

                <h2>7. Third-Party Links</h2>
                <p>
                  Our Service may contain links to third-party websites or services that are not owned or controlled by
                  Keytake. We have no control over, and assume no responsibility for, the content, privacy policies, or
                  practices of any third-party websites or services.
                </p>
                <p>
                  You acknowledge and agree that Keytake shall not be responsible or liable, directly or indirectly, for
                  any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on
                  any such content, goods, or services available on or through any such websites or services.
                </p>

                <h2>8. Termination</h2>
                <p>
                  We may terminate or suspend your account and bar access to the Service immediately, without prior
                  notice or liability, under our sole discretion, for any reason whatsoever, including without
                  limitation if you breach the Terms.
                </p>
                <p>
                  All provisions of the Terms which by their nature should survive termination shall survive
                  termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and
                  limitations of liability.
                </p>

                <h2>9. Limitation of Liability</h2>
                <p>
                  In no event shall Keytake, nor its directors, employees, partners, agents, suppliers, or affiliates,
                  be liable for any indirect, incidental, special, consequential, or punitive damages, including without
                  limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
                </p>
                <ul>
                  <li>Your access to or use of or inability to access or use the Service;</li>
                  <li>Any conduct or content of any third party on the Service;</li>
                  <li>Any content obtained from the Service; and</li>
                  <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
                </ul>

                <h2>10. Disclaimer</h2>
                <p>
                  Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE"
                  basis. The Service is provided without warranties of any kind, whether express or implied, including,
                  but not limited to, implied warranties of merchantability, fitness for a particular purpose,
                  non-infringement, or course of performance.
                </p>

                <h2>11. Governing Law</h2>
                <p>
                  These Terms shall be governed and construed in accordance with the laws of the State of California,
                  United States, without regard to its conflict of law provisions.
                </p>
                <p>
                  Our failure to enforce any right or provision of these Terms will not be considered a waiver of those
                  rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the
                  remaining provisions of these Terms will remain in effect.
                </p>

                <h2>12. Changes to Terms</h2>
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
                  revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
                  What constitutes a material change will be determined at our sole discretion.
                </p>

                <h2>13. Contact Us</h2>
                <p>If you have any questions about these Terms, please contact us at:</p>
                <p>
                  Email: legal@keytake.com
                  <br />
                  Address: 123 Learning Lane, San Francisco, CA 94105, USA
                </p>
              </div>
            </GlassPanel>
          </div>
        </div>
      </section>
    </div>
  )
}
