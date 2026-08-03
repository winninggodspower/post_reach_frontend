import { Metadata } from "next"
import Link from "next/link"

import Navbar from "@/components/navbar"

export const metadata: Metadata = {
  title: "Terms of Service | PostGlee",
  description: "Read the terms that apply when you use PostGlee.",
}

const LAST_UPDATED = "August 3, 2026"
const CONTACT_EMAIL = "privacy@postglee.app"

interface SectionProps {
  id: string
  title: string
  children: React.ReactNode
}

function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-xl font-semibold text-black">{title}</h2>
      <div className="mt-4 space-y-3 text-[15px] leading-7 text-black/70">{children}</div>
    </section>
  )
}

export default function TermsOfServicePage() {
  return (
    <main className="flex min-h-screen flex-col text-foreground">
      <Navbar />

      <section className="border-b border-black/8 bg-[linear-gradient(180deg,#fff8f1_0%,#fffdf9_55%,#ffffff_100%)] px-6 py-16 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-accent-brand">
          Legal
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-black md:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-black/45">Last updated: {LAST_UPDATED}</p>
      </section>

      <div className="mx-auto grid w-full max-w-4xl gap-10 px-6 py-12">
        <p className="text-[15px] leading-7 text-black/70">
          PostGlee is a content scheduling platform. These terms explain how the service works,
          what you can expect from us, and what we expect from you.
        </p>

        <p className="text-[15px] leading-7 text-black/70">
          When you use PostGlee, you agree to these terms and our{" "}
          <Link href="/privacy-policy" className="font-medium text-accent-brand underline">
            Privacy Policy
          </Link>
          . If these terms are not a fit, you should not use the service.
        </p>

        <Section id="acceptance" title="Acceptance">
          <p>By creating an account, accessing the site, or using the service, you agree to these terms.</p>
        </Section>

        <Section id="eligibility" title="Eligibility">
          <p>You need to be old enough to enter a contract where you live, and at least 13 years old.</p>
          <p>
            If you use PostGlee for a company or a team, you need permission to agree to these
            terms on their behalf.
          </p>
        </Section>

        <Section id="account" title="Your Account">
          <p>Keep your account details accurate and your login private.</p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>Use a real name and email address when you sign up.</li>
            <li>Do not share your login with other people.</li>
            <li>Tell us right away if you think someone else has access to your account.</li>
            <li>Do not create extra accounts to dodge limits or restrictions.</li>
          </ul>
          <p>We may suspend or close accounts that break these terms.</p>
        </Section>

        <Section id="service" title="Using the Service">
          <p>
            Use PostGlee for lawful purposes and in line with the platforms you connect.
          </p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>Spam, misleading content, hate speech, and illegal material are not allowed.</li>
            <li>Do not try to break into accounts or systems you are not allowed to access.</li>
            <li>Do not scrape, reverse engineer, or copy the service without permission.</li>
            <li>Do not resell or sublicense the service.</li>
            <li>Do not use the service in a way that harms PostGlee, our users, or third parties.</li>
          </ul>
        </Section>

        <Section id="content" title="Your Content">
          <p>
            You own the content you upload or schedule through PostGlee. We only get the limited
            right we need to store, process, and send that content where you ask us to.
          </p>
          <p>You promise that:</p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>You have the rights needed to use the content you submit.</li>
            <li>Your content does not violate someone else&apos;s rights or the law.</li>
            <li>Your content follows these terms and any platform rules that apply.</li>
          </ul>
          <p>We may remove content that breaks these terms.</p>
        </Section>

        <Section id="social-accounts" title="Connected Accounts">
          <p>
            PostGlee lets you connect third-party social accounts so you can publish and schedule
            content from one place.
          </p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>You allow us to act on your behalf only as needed for the connected feature.</li>
            <li>You agree to follow the terms of each platform you connect.</li>
            <li>You can disconnect an account anytime from your settings.</li>
          </ul>
          <p>If a platform changes its rules or API, that may affect features we can offer.</p>
        </Section>

        <Section id="payment" title="Payments">
          <p>Some parts of PostGlee may require a paid subscription.</p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>Fees are billed in advance on a recurring monthly or yearly basis.</li>
            <li>Fees are non-refundable unless the law says otherwise or we say otherwise.</li>
            <li>We may change pricing with reasonable notice.</li>
            <li>If payment fails, your account may be suspended or downgraded.</li>
          </ul>
        </Section>

        <Section id="termination" title="Termination">
          <p>You can stop using PostGlee at any time by closing your account.</p>
          <p>We may suspend or end access if:</p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>you break these terms</li>
            <li>we are required to do so by law</li>
            <li>we stop offering the service</li>
          </ul>
          <p>
            If your account ends, your right to use the service ends too. Data deletion is handled
            under our{" "}
            <Link href="/privacy-policy" className="font-medium text-accent-brand underline">
              Privacy Policy
            </Link>
            .
          </p>
        </Section>

        <Section id="disclaimers" title="Disclaimers">
          <p>
            PostGlee is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We do not promise
            the service will always be uninterrupted, error-free, or free from bugs.
          </p>
          <p>
            We also do not guarantee that analytics, reports, or third-party platform data will
            always be complete or accurate.
          </p>
        </Section>

        <Section id="liability" title="Limitation of Liability">
          <p>
            To the fullest extent allowed by law, PostGlee will not be liable for indirect,
            incidental, special, consequential, or punitive damages.
          </p>
          <p>This includes loss of profits, data, goodwill, or business opportunities.</p>
          <p>
            Our total liability for any claim will not exceed the greater of the amount you paid
            us in the 12 months before the claim or $100.
          </p>
        </Section>

        <Section id="changes" title="Changes to These Terms">
          <p>
            We may update these terms from time to time. If we make a material change, we will let
            you know in the app or by email before it takes effect.
          </p>
        </Section>

        <Section id="contact" title="Contact">
          <p>
            If you have questions about these terms, email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-accent-brand underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </Section>
      </div>

      <footer className="border-t border-black/8 bg-white px-6 py-8 text-center text-sm text-black/40">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6">
          <Link href="/privacy-policy" className="transition hover:text-black">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="font-medium text-accent-brand">
            Terms of Service
          </Link>
          <Link href="/data-deletion" className="transition hover:text-black">
            Data Deletion
          </Link>
          <Link href="/" className="transition hover:text-black">
            Home
          </Link>
        </div>
        <p className="mt-4">© {new Date().getFullYear()} PostGlee. All rights reserved.</p>
      </footer>
    </main>
  )
}
