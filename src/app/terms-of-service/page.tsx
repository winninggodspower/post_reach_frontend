import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "Terms of Service | PostReach",
  description:
    "Read the Terms of Service governing your use of PostReach — the social media management platform.",
};

const LAST_UPDATED = "July 16, 2025";
const CONTACT_EMAIL = "legal@postreach.app";

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="mb-10 scroll-mt-24">
      <h2 className="mb-4 text-xl font-bold text-black">{title}</h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-black/70">
        {children}
      </div>
    </section>
  );
}

const TOC = [
  { id: "acceptance", label: "Acceptance of Terms" },
  { id: "eligibility", label: "Eligibility" },
  { id: "account", label: "Your Account" },
  { id: "service", label: "Use of the Service" },
  { id: "content", label: "Your Content" },
  { id: "social-accounts", label: "Connected Social Accounts" },
  { id: "payment", label: "Payment & Subscriptions" },
  { id: "termination", label: "Termination" },
  { id: "disclaimers", label: "Disclaimers" },
  { id: "limitation", label: "Limitation of Liability" },
  { id: "indemnification", label: "Indemnification" },
  { id: "governing-law", label: "Governing Law" },
  { id: "changes", label: "Changes to Terms" },
  { id: "contact", label: "Contact Us" },
];

export default function TermsOfServicePage() {
  return (
    <main className="flex min-h-screen flex-col text-foreground">
      <Navbar />

      {/* Hero */}
      <div className="border-b border-black/10 bg-gradient-to-b from-orange-50 to-white px-6 py-16 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent-brand">
          Legal
        </p>
        <h1 className="text-4xl font-bold text-black md:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-base text-black/50">
          Last updated: {LAST_UPDATED}
        </p>
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 py-14 lg:flex lg:gap-16">
        {/* Sticky sidebar TOC */}
        <aside className="hidden lg:block lg:w-64 shrink-0">
          <div className="sticky top-28">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-black/40">
              On this page
            </p>
            <nav className="space-y-1">
              {TOC.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block rounded-lg px-3 py-1.5 text-sm text-black/60 transition hover:bg-orange-50 hover:text-accent-brand"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <div className="mb-10 rounded-2xl border border-orange-200 bg-orange-50 px-6 py-5">
            <p className="text-sm text-black/70">
              These Terms of Service (&quot;Terms&quot;) govern your access to and use of PostReach
              (&quot;Service&quot;), operated by PostReach (&quot;Company,&quot; &quot;we,&quot; or &quot;us&quot;).
              By accessing or using our Service, you agree to be bound by these Terms.
            </p>
          </div>

          <Section id="acceptance" title="1. Acceptance of Terms">
            <p>
              By creating an account, accessing, or using PostReach, you confirm that you have
              read, understood, and agree to be bound by these Terms and our{" "}
              <Link href="/privacy-policy" className="font-medium text-accent-brand underline">
                Privacy Policy
              </Link>
              . If you do not agree, you must not use the Service.
            </p>
          </Section>

          <Section id="eligibility" title="2. Eligibility">
            <p>You must meet all of the following to use PostReach:</p>
            <ul className="ml-5 mt-2 list-disc space-y-1.5">
              <li>Be at least 13 years old (or 16 in the EU/EEA)</li>
              <li>
                Have the legal capacity to enter into a binding contract in your jurisdiction
              </li>
              <li>Not be prohibited from using our Service under applicable laws</li>
              <li>
                If using on behalf of an organisation, have authority to bind that organisation
                to these Terms
              </li>
            </ul>
          </Section>

          <Section id="account" title="3. Your Account">
            <p>
              You are responsible for maintaining the confidentiality of your account credentials
              and for all activity that occurs under your account. You agree to:
            </p>
            <ul className="ml-5 mt-2 list-disc space-y-1.5">
              <li>Provide accurate and complete information when registering</li>
              <li>Keep your password secure and not share it with others</li>
              <li>Notify us immediately of any unauthorised use of your account</li>
              <li>
                Not create multiple accounts for the purpose of circumventing restrictions or
                bans
              </li>
            </ul>
            <p className="mt-3">
              We reserve the right to suspend or terminate accounts that violate these Terms.
            </p>
          </Section>

          <Section id="service" title="4. Use of the Service">
            <p>
              You agree to use PostReach only for lawful purposes and in accordance with these
              Terms. You must <strong>not</strong>:
            </p>
            <ul className="ml-5 mt-2 list-disc space-y-1.5">
              <li>
                Violate any applicable law, regulation, or the terms of service of connected
                social media platforms
              </li>
              <li>
                Post, schedule, or distribute spam, misleading content, hate speech, or illegal
                material
              </li>
              <li>
                Attempt to gain unauthorised access to our systems or other users&apos; accounts
              </li>
              <li>
                Reverse engineer, decompile, or disassemble any part of the Service
              </li>
              <li>
                Use automated tools (other than our own API) to access or scrape the Service
              </li>
              <li>
                Resell or sublicense the Service without our written consent
              </li>
              <li>
                Use the Service in a way that could harm PostReach, our users, or third parties
              </li>
            </ul>
          </Section>

          <Section id="content" title="5. Your Content">
            <p>
              You retain ownership of all content you submit, upload, or publish through
              PostReach (&quot;Your Content&quot;). By using the Service, you grant PostReach a
              limited, non-exclusive, royalty-free licence to:
            </p>
            <ul className="ml-5 mt-2 list-disc space-y-1.5">
              <li>Store and process Your Content to provide the Service</li>
              <li>Transmit Your Content to connected social media platforms on your behalf</li>
            </ul>
            <p className="mt-3">You represent and warrant that:</p>
            <ul className="ml-5 mt-2 list-disc space-y-1.5">
              <li>
                You own or have the rights to all content you post through PostReach
              </li>
              <li>
                Your Content does not infringe any third party&apos;s intellectual property, privacy,
                or other rights
              </li>
              <li>
                Your Content complies with these Terms and all applicable laws
              </li>
            </ul>
            <p className="mt-3">
              We reserve the right to remove any content that violates these Terms without
              notice.
            </p>
          </Section>

          <Section id="social-accounts" title="6. Connected Social Accounts">
            <p>
              PostReach allows you to connect third-party social media accounts. By connecting an
              account you:
            </p>
            <ul className="ml-5 mt-2 list-disc space-y-1.5">
              <li>
                Authorise PostReach to act on your behalf as permitted by the respective
                platform&apos;s API
              </li>
              <li>
                Agree to comply with the terms of service of each connected platform
              </li>
              <li>
                Acknowledge that PostReach is not affiliated with or endorsed by any social
                media platform
              </li>
            </ul>
            <p className="mt-3">
              You may disconnect a social account at any time from{" "}
              <strong>Settings → Connected Accounts</strong>. PostReach will immediately cease
              publishing to that account and revoke the stored access token.
            </p>
            <p className="mt-3">
              We are not responsible for changes to third-party platform APIs, policies, or
              availability that may affect our ability to provide the Service.
            </p>
          </Section>

          <Section id="payment" title="7. Payment & Subscriptions">
            <p>
              Some features of PostReach require a paid subscription. By subscribing you agree
              that:
            </p>
            <ul className="ml-5 mt-2 list-disc space-y-1.5">
              <li>
                Subscription fees are billed in advance on a recurring basis (monthly or
                annually)
              </li>
              <li>
                All fees are non-refundable unless required by applicable law or explicitly
                stated in our refund policy
              </li>
              <li>
                We may change pricing at any time with at least 30 days&apos; notice to existing
                subscribers
              </li>
              <li>
                Failure to pay may result in suspension or downgrade of your account
              </li>
            </ul>
          </Section>

          <Section id="termination" title="8. Termination">
            <p>
              Either party may terminate the agreement at any time. You may close your account
              through <strong>Settings → Account</strong>. We may suspend or terminate your
              account without notice if:
            </p>
            <ul className="ml-5 mt-2 list-disc space-y-1.5">
              <li>You breach these Terms</li>
              <li>We are required to do so by law</li>
              <li>We discontinue the Service</li>
            </ul>
            <p className="mt-3">
              Upon termination, your right to use the Service immediately ceases. Data deletion
              will follow the timeline described in our{" "}
              <Link href="/privacy-policy" className="font-medium text-accent-brand underline">
                Privacy Policy
              </Link>
              .
            </p>
          </Section>

          <Section id="disclaimers" title="9. Disclaimers">
            <p>
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY
              KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>
            <p className="mt-3">
              We do not warrant that the Service will be uninterrupted, error-free, or free from
              viruses. We make no guarantees about the accuracy or completeness of any analytics
              or data provided through the Service.
            </p>
          </Section>

          <Section id="limitation" title="10. Limitation of Liability">
            <p>
              TO THE FULLEST EXTENT PERMITTED BY LAW, POSTREACH SHALL NOT BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS
              OF PROFITS, DATA, OR GOODWILL, ARISING FROM:
            </p>
            <ul className="ml-5 mt-2 list-disc space-y-1.5">
              <li>Your use of or inability to use the Service</li>
              <li>Any changes to or discontinuation of the Service</li>
              <li>Unauthorised access to your account or data</li>
              <li>
                Actions of third-party social media platforms affecting your content or account
              </li>
            </ul>
            <p className="mt-3">
              Our total aggregate liability shall not exceed the greater of (a) the amount you
              paid us in the 12 months prior to the event giving rise to the claim, or (b) £100.
            </p>
          </Section>

          <Section id="indemnification" title="11. Indemnification">
            <p>
              You agree to indemnify, defend, and hold harmless PostReach and its officers,
              directors, employees, and agents from any claims, damages, losses, or expenses
              (including legal fees) arising from:
            </p>
            <ul className="ml-5 mt-2 list-disc space-y-1.5">
              <li>Your use of the Service</li>
              <li>Your Content</li>
              <li>Your violation of these Terms or applicable law</li>
              <li>Your infringement of any third-party rights</li>
            </ul>
          </Section>

          <Section id="governing-law" title="12. Governing Law">
            <p>
              These Terms shall be governed by and construed in accordance with applicable law.
              Any disputes arising from these Terms or your use of the Service shall be subject
              to the exclusive jurisdiction of the competent courts in the applicable territory.
            </p>
          </Section>

          <Section id="changes" title="13. Changes to Terms">
            <p>
              We reserve the right to modify these Terms at any time. We will notify you of
              material changes by email or through an in-app notification at least 14 days before
              they take effect. Your continued use of the Service after the effective date
              constitutes acceptance of the updated Terms.
            </p>
          </Section>

          <Section id="contact" title="14. Contact Us">
            <p>
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="mt-4 rounded-xl border border-black/10 bg-black/[0.02] px-5 py-4">
              <p className="font-semibold text-black">PostReach</p>
              <p className="mt-1">
                Email:{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-medium text-accent-brand underline"
                >
                  {CONTACT_EMAIL}
                </a>
              </p>
            </div>
          </Section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-black/10 bg-white px-6 py-8 text-center text-sm text-black/40">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6">
          <Link href="/privacy-policy" className="hover:text-black transition">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="font-medium text-accent-brand">
            Terms of Service
          </Link>
          <Link href="/data-deletion" className="hover:text-black transition">
            Data Deletion
          </Link>
          <Link href="/" className="hover:text-black transition">
            Home
          </Link>
        </div>
        <p className="mt-4">© {new Date().getFullYear()} PostReach. All rights reserved.</p>
      </footer>
    </main>
  );
}
