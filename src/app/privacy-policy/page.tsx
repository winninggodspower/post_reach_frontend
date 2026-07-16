import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "Privacy Policy | PostReach",
  description:
    "Learn how PostReach collects, uses, and protects your personal data and social media information.",
};

const LAST_UPDATED = "July 16, 2025";
const CONTACT_EMAIL = "privacy@postreach.app";

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
  { id: "information-we-collect", label: "Information We Collect" },
  { id: "how-we-use", label: "How We Use Your Information" },
  { id: "social-media-data", label: "Social Media Data" },
  { id: "data-sharing", label: "Data Sharing" },
  { id: "data-retention", label: "Data Retention" },
  { id: "your-rights", label: "Your Rights" },
  { id: "security", label: "Security" },
  { id: "cookies", label: "Cookies" },
  { id: "third-party-links", label: "Third-Party Links" },
  { id: "children", label: "Children's Privacy" },
  { id: "changes", label: "Changes to This Policy" },
  { id: "contact", label: "Contact Us" },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="flex min-h-screen flex-col text-foreground">
      <Navbar />

      {/* Hero */}
      <div className="border-b border-black/10 bg-gradient-to-b from-orange-50 to-white px-6 py-16 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent-brand">
          Legal
        </p>
        <h1 className="text-4xl font-bold text-black md:text-5xl">
          Privacy Policy
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
              PostReach (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is a social media management platform.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your
              information when you use our service. Please read it carefully.
            </p>
          </div>

          <Section id="information-we-collect" title="1. Information We Collect">
            <p>We collect information you provide directly:</p>
            <ul className="ml-5 mt-2 list-disc space-y-1.5">
              <li>
                <strong>Account information:</strong> Name, email address, and password when you
                create an account.
              </li>
              <li>
                <strong>Profile information:</strong> Optional profile photo, bio, or business
                details.
              </li>
              <li>
                <strong>Content:</strong> Posts, captions, images, videos, and other media you
                upload or schedule through our platform.
              </li>
              <li>
                <strong>Payment information:</strong> Billing details processed securely through
                our payment providers (we do not store card numbers).
              </li>
            </ul>
            <p className="mt-3">We also collect information automatically:</p>
            <ul className="ml-5 mt-2 list-disc space-y-1.5">
              <li>
                <strong>Usage data:</strong> Pages visited, features used, time spent, clicks, and
                other interaction data.
              </li>
              <li>
                <strong>Device data:</strong> IP address, browser type, operating system, and
                device identifiers.
              </li>
              <li>
                <strong>Log data:</strong> Server logs, error reports, and diagnostic data.
              </li>
            </ul>
          </Section>

          <Section id="how-we-use" title="2. How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul className="ml-5 mt-2 list-disc space-y-1.5">
              <li>Provide, operate, and maintain our service</li>
              <li>Process and schedule your social media posts</li>
              <li>Manage your connected social media accounts</li>
              <li>Send transactional emails (account confirmations, post alerts)</li>
              <li>Respond to your support requests</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Analyse usage to improve our product</li>
              <li>
                Send promotional communications where you have opted in (you may opt out at any
                time)
              </li>
            </ul>
          </Section>

          <Section id="social-media-data" title="3. Social Media Data">
            <p>
              When you connect a social media account (e.g. Instagram, Facebook, X, TikTok,
              YouTube) to PostReach, we request OAuth access tokens from that platform. We use
              these tokens solely to:
            </p>
            <ul className="ml-5 mt-2 list-disc space-y-1.5">
              <li>Publish, schedule, and manage posts on your behalf</li>
              <li>Retrieve basic profile information (username, profile picture, follower count)</li>
              <li>Fetch analytics and performance data for posts you have published via PostReach</li>
            </ul>
            <p className="mt-3">
              We do not read, store, or share your private messages, contacts, or any data beyond
              what is explicitly required for the features you use.
            </p>
            <p className="mt-3">
              Access tokens are encrypted at rest and in transit. You can revoke our access at any
              time from the connected platform&apos;s own settings, or from your PostReach account
              under <strong>Settings → Connected Accounts</strong>.
            </p>
          </Section>

          <Section id="data-sharing" title="4. Data Sharing">
            <p>
              We do <strong>not</strong> sell your personal data. We may share information with:
            </p>
            <ul className="ml-5 mt-2 list-disc space-y-1.5">
              <li>
                <strong>Service providers:</strong> Hosting, database, analytics, and email
                providers that process data on our behalf under strict agreements.
              </li>
              <li>
                <strong>Social media platforms:</strong> Only the data necessary to fulfil your
                publishing requests.
              </li>
              <li>
                <strong>Legal compliance:</strong> If required by law or to protect the rights,
                property, or safety of PostReach, our users, or others.
              </li>
              <li>
                <strong>Business transfers:</strong> In connection with a merger, acquisition, or
                sale of assets, your data may be transferred (you will be notified).
              </li>
            </ul>
          </Section>

          <Section id="data-retention" title="5. Data Retention">
            <p>
              We retain your personal data for as long as your account is active, or as needed to
              provide you services. If you delete your account:
            </p>
            <ul className="ml-5 mt-2 list-disc space-y-1.5">
              <li>
                Your account data is deleted within <strong>30 days</strong>.
              </li>
              <li>
                Social media access tokens are revoked and deleted immediately upon account
                deletion or disconnection.
              </li>
              <li>
                Backups may retain data for up to <strong>90 days</strong> before being purged.
              </li>
            </ul>
            <p className="mt-3">
              You may also request deletion of specific data without closing your account — see
              Your Rights below.
            </p>
          </Section>

          <Section id="your-rights" title="6. Your Rights">
            <p>
              Depending on your location, you may have the following rights regarding your personal
              data:
            </p>
            <ul className="ml-5 mt-2 list-disc space-y-1.5">
              <li>
                <strong>Access:</strong> Request a copy of the data we hold about you.
              </li>
              <li>
                <strong>Correction:</strong> Request correction of inaccurate data.
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your data (see our{" "}
                <Link href="/data-deletion" className="font-medium text-accent-brand underline">
                  Data Deletion page
                </Link>
                ).
              </li>
              <li>
                <strong>Portability:</strong> Request an export of your data in a common format.
              </li>
              <li>
                <strong>Objection:</strong> Object to certain processing activities.
              </li>
              <li>
                <strong>Opt-out:</strong> Unsubscribe from marketing emails at any time.
              </li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-accent-brand underline"
              >
                {CONTACT_EMAIL}
              </a>
              . We will respond within 30 days.
            </p>
          </Section>

          <Section id="security" title="7. Security">
            <p>
              We implement industry-standard technical and organisational measures to protect your
              data, including:
            </p>
            <ul className="ml-5 mt-2 list-disc space-y-1.5">
              <li>TLS encryption for all data in transit</li>
              <li>AES-256 encryption for sensitive data at rest (e.g. OAuth tokens)</li>
              <li>Role-based access controls and least-privilege principles</li>
              <li>Regular security audits and dependency updates</li>
            </ul>
            <p className="mt-3">
              No method of transmission over the internet is 100% secure. If you discover a
              security vulnerability, please report it to{" "}
              <a
                href="mailto:security@postreach.app"
                className="font-medium text-accent-brand underline"
              >
                security@postreach.app
              </a>
              .
            </p>
          </Section>

          <Section id="cookies" title="8. Cookies">
            <p>
              We use cookies and similar tracking technologies to operate and improve our service:
            </p>
            <ul className="ml-5 mt-2 list-disc space-y-1.5">
              <li>
                <strong>Essential cookies:</strong> Required for authentication and session
                management.
              </li>
              <li>
                <strong>Analytics cookies:</strong> Help us understand how users interact with our
                product (e.g. page views, feature usage).
              </li>
              <li>
                <strong>Preference cookies:</strong> Store your settings such as theme or
                language.
              </li>
            </ul>
            <p className="mt-3">
              You can control cookies through your browser settings. Disabling essential cookies
              may affect the functionality of the service.
            </p>
          </Section>

          <Section id="third-party-links" title="9. Third-Party Links">
            <p>
              Our service may contain links to third-party websites or services that we do not
              control. This Privacy Policy does not apply to those sites. We encourage you to
              review the privacy policies of any third-party services you visit.
            </p>
          </Section>

          <Section id="children" title="10. Children's Privacy">
            <p>
              PostReach is not directed to children under the age of 13 (or 16 in the EU/EEA). We
              do not knowingly collect personal information from children. If you believe we have
              collected data from a child, please contact us immediately at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-accent-brand underline"
              >
                {CONTACT_EMAIL}
              </a>{" "}
              and we will delete it promptly.
            </p>
          </Section>

          <Section id="changes" title="11. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. When we do, we will update the
              &quot;Last updated&quot; date at the top of this page and, for material changes, notify you
              by email or an in-app notification. Your continued use of the service after the
              effective date constitutes your acceptance of the revised policy.
            </p>
          </Section>

          <Section id="contact" title="12. Contact Us">
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy,
              please contact us:
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
          <Link href="/privacy-policy" className="font-medium text-accent-brand">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="hover:text-black transition">
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
