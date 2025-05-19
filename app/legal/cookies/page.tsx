import type { Metadata } from "next"
import Link from "next/link"
import { GlassPanel } from "@/components/glass-panel"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Cookie Policy | Keytake",
  description: "Learn how Keytake uses cookies and similar technologies",
  openGraph: {
    title: "Cookie Policy | Keytake",
    description: "Learn how Keytake uses cookies and similar technologies",
    url: "https://keytake.com/legal/cookies",
    type: "website",
  },
}

export default function CookiePolicyPage() {
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
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Cookie Policy</h1>
              <p className="text-foreground/70">Last updated: April 29, 2023</p>
            </div>

            {/* Content */}
            <GlassPanel className="p-8 md:p-12 mb-12 border-foreground/10">
              <div className="prose dark:prose-invert max-w-none">
                <p>
                  This Cookie Policy explains how Keytake ("we", "us", or "our") uses cookies and similar technologies
                  to recognize you when you visit our website. It explains what these technologies are and why we use
                  them, as well as your rights to control our use of them.
                </p>

                <h2>What Are Cookies?</h2>
                <p>
                  Cookies are small data files that are placed on your computer or mobile device when you visit a
                  website. Cookies are widely used by website owners to make their websites work, or to work more
                  efficiently, as well as to provide reporting information.
                </p>
                <p>
                  Cookies set by the website owner (in this case, Keytake) are called "first-party cookies". Cookies set
                  by parties other than the website owner are called "third-party cookies". Third-party cookies enable
                  third-party features or functionality to be provided on or through the website (e.g., advertising,
                  interactive content, and analytics). The parties that set these third-party cookies can recognize your
                  computer both when it visits the website in question and also when it visits certain other websites.
                </p>

                <h2>Why Do We Use Cookies?</h2>
                <p>
                  We use first-party and third-party cookies for several reasons. Some cookies are required for
                  technical reasons in order for our website to operate, and we refer to these as "essential" or
                  "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our
                  users to enhance the experience on our website. Third parties serve cookies through our website for
                  advertising, analytics, and other purposes.
                </p>

                <h2>Types of Cookies We Use</h2>
                <p>
                  The specific types of first and third-party cookies served through our website and the purposes they
                  perform are described below:
                </p>

                <h3>Essential Cookies</h3>
                <p>
                  These cookies are strictly necessary to provide you with services available through our website and to
                  use some of its features, such as access to secure areas. Because these cookies are strictly necessary
                  to deliver the website, you cannot refuse them without impacting how our website functions.
                </p>
                <ul>
                  <li>
                    <strong>Session Cookies:</strong> These cookies are temporary and expire once you close your
                    browser.
                  </li>
                  <li>
                    <strong>Persistent Cookies:</strong> These cookies remain on your device until you delete them or
                    they expire.
                  </li>
                </ul>

                <h3>Performance and Functionality Cookies</h3>
                <p>
                  These cookies are used to enhance the performance and functionality of our website but are
                  non-essential to their use. However, without these cookies, certain functionality may become
                  unavailable.
                </p>
                <ul>
                  <li>
                    <strong>Preference Cookies:</strong> These cookies remember your preferences and settings.
                  </li>
                  <li>
                    <strong>State Management Cookies:</strong> These cookies help maintain the state of your application
                    (e.g., whether you're logged in).
                  </li>
                </ul>

                <h3>Analytics and Customization Cookies</h3>
                <p>
                  These cookies collect information that is used either in aggregate form to help us understand how our
                  website is being used or how effective our marketing campaigns are, or to help us customize our
                  website for you.
                </p>
                <ul>
                  <li>
                    <strong>Google Analytics:</strong> We use Google Analytics to understand how visitors interact with
                    our website.
                  </li>
                  <li>
                    <strong>Hotjar:</strong> We use Hotjar to better understand our users' needs and to optimize this
                    service and experience.
                  </li>
                </ul>

                <h3>Advertising Cookies</h3>
                <p>
                  These cookies are used to make advertising messages more relevant to you. They perform functions like
                  preventing the same ad from continuously reappearing, ensuring that ads are properly displayed, and in
                  some cases selecting advertisements that are based on your interests.
                </p>

                <h2>How Can You Control Cookies?</h2>
                <p>
                  You have the right to decide whether to accept or reject cookies. You can exercise your cookie
                  preferences by clicking on the appropriate opt-out links provided in the cookie banner on our website.
                </p>
                <p>
                  You can also set or amend your web browser controls to accept or refuse cookies. If you choose to
                  reject cookies, you may still use our website though your access to some functionality and areas of
                  our website may be restricted. As the means by which you can refuse cookies through your web browser
                  controls vary from browser to browser, you should visit your browser's help menu for more information.
                </p>
                <p>
                  In addition, most advertising networks offer you a way to opt out of targeted advertising. If you
                  would like to find out more information, please visit{" "}
                  <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
                    http://www.aboutads.info/choices/
                  </a>{" "}
                  or{" "}
                  <a href="http://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer">
                    http://www.youronlinechoices.com
                  </a>
                  .
                </p>

                <h2>Do Not Track</h2>
                <p>
                  Some browsers have a "Do Not Track" feature that lets you tell websites that you do not want to have
                  your online activities tracked. At this time, we do not respond to browser "Do Not Track" signals.
                </p>

                <h2>How Often Will We Update This Cookie Policy?</h2>
                <p>
                  We may update this Cookie Policy from time to time in order to reflect, for example, changes to the
                  cookies we use or for other operational, legal, or regulatory reasons. Please therefore re-visit this
                  Cookie Policy regularly to stay informed about our use of cookies and related technologies.
                </p>
                <p>The date at the top of this Cookie Policy indicates when it was last updated.</p>

                <h2>Contact Us</h2>
                <p>If you have any questions about our use of cookies or other technologies, please contact us at:</p>
                <p>
                  Email: privacy@keytake.com
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
