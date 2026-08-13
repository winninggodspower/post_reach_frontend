import { Metadata } from "next"
import Link from "next/link"

import Navbar from "@/components/navbar"

export const metadata: Metadata = {
  title: "Privacy Policy | PostGlee",
  description: "Learn how PostGlee collects, uses, shares, and protects your information.",
}

const LAST_UPDATED = "August 3, 2026"
const CONTACT_EMAIL = "winninggodspower@gmail.com"

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

export default function PrivacyPolicyPage() {
  return (
    <main className="flex min-h-screen flex-col text-foreground">
      <Navbar />

      <section className="border-b border-black/8 bg-[linear-gradient(180deg,#fff8f1_0%,#fffdf9_55%,#ffffff_100%)] px-6 py-16 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-accent-brand">
          Legal
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-black md:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-black/45">Last updated: {LAST_UPDATED}</p>
      </section>

      <div className="mx-auto grid w-full max-w-4xl gap-10 px-6 py-12">
        <p className="text-[15px] leading-7 text-black/70">
          PostGlee is a content scheduling platform. It uses the information needed to run your
          account, publish your content, and keep the service working smoothly.
        </p>

        <Section id="what-we-collect" title="What We Collect">
          <p>Here are the basics we collect to keep the product working:</p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              <strong>Account details:</strong> your name, email address, and sign-in information.
            </li>
            <li>
              <strong>Content you create:</strong> captions, images, videos, scheduled posts, and
              connected account details needed to publish them.
            </li>
            <li>
              <strong>Payment information:</strong> if you subscribe, billing is handled by our
              payment provider. We do not store your card number.
            </li>
          </ul>
        </Section>

        <Section id="how-we-use" title="How We Use It">
          <p>We use that information to:</p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>let you create, schedule, and publish posts</li>
            <li>connect the social accounts you choose</li>
            <li>show your post history and results inside the app</li>
            <li>send account, product, and support emails</li>
            <li>keep the service secure and prevent abuse</li>
          </ul>
          <p>In short, PostGlee uses your data to operate the service and deliver the features you ask for.</p>
        </Section>

        <Section id="sharing" title="How We Share Data">
          <p>We use trusted providers that help run PostGlee when needed:</p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              <strong>Service providers:</strong> tools and services that help us host the app,
              store data, deliver emails, and process payments.
            </li>
            <li>
              <strong>Social platforms:</strong> the networks you connect, when you ask us to
              publish or sync content to them.
            </li>
            <li>
              <strong>Legal reasons:</strong> if required by a legally-binding request from public authorities (such as law enforcement or a court order). We strictly review the legality of all requests, challenge them if they are considered unlawful, practice data minimization to disclose only the minimum information necessary, and document all requests along with our responses.
            </li>

          </ul>
        </Section>

        <Section id="data-security" title="Data Security & Protection">
          <p>
            Security procedures are in place to protect the confidentiality of your data. We take the
            security of your personal and sensitive information seriously and use industry-standard
            technical and organizational measures to keep it safe:
          </p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              <strong>Encryption:</strong> We use encryption to protect your information. All data transmitted
              between your browser and our servers is secured using HTTPS/TLS encryption. Sensitive data, such as
              social media credentials and OAuth access tokens, is encrypted at rest using industry-standard
              cryptographic protocols.
            </li>
            <li>
              <strong>Access Control:</strong> Access to personal and sensitive data is strictly restricted to
              authorized systems and personnel who require it to run and maintain the service.
            </li>
            <li>
              <strong>Secure Storage & Audits:</strong> Your data is stored on secure cloud servers. We regularly
              monitor our infrastructure to identify vulnerabilities, prevent unauthorized access, and ensure security compliance.
            </li>
            <li>
              <strong>No Sale of Data:</strong> We do not sell, rent, or trade your personal or sensitive data, including
              any information received from connected third-party platforms or Google APIs, to any third parties.
            </li>
          </ul>
        </Section>

        <Section id="google-api-data" title="Google API Services User Data">
          <p>
            If you connect your Google or YouTube account to PostGlee to publish or schedule content, we access and
            process only the specific data necessary to perform those actions.
          </p>
          <p>
            PostGlee&apos;s use and transfer of information received from Google APIs to any other app will adhere to the{" "}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent-brand underline"
            >
              Google API Services User Data Policy
            </a>
            , including the Limited Use requirements.
          </p>
        </Section>

        <Section id="retention" title="How Long We Keep It">
          <p>We keep your information only for as long as it serves the service.</p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>Account data stays while your account is active.</li>
            <li>When you delete your account, we remove personal data within 30 days.</li>
            <li>Social access tokens are removed when you disconnect them or delete your account.</li>
            <li>Backups may keep copies for a limited time before they are fully purged.</li>
          </ul>
        </Section>

        <Section id="controls" title="Your Choices">
          <p>You can control your data in a few ways.</p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>Disconnect connected accounts anytime from your settings.</li>
            <li>Delete posts and uploaded media from the dashboard.</li>
            <li>Request access, correction, export, or deletion of your data.</li>
            <li>Revoke access from the connected social platform if you want to stop sharing there.</li>
          </ul>
          <p>
            For account deletion, see our{" "}
            <Link href="/data-deletion" className="font-medium text-accent-brand underline">
              Data Deletion page
            </Link>
            .
          </p>
        </Section>

        <Section id="children" title="Children&apos;s Privacy">
          <p>PostGlee is not intended for children under 13.</p>
        </Section>

        <Section id="changes" title="Changes to This Policy">
          <p>
            We may update this policy from time to time. If we make a material change, we will
            update the date above and let you know in the app or by email.
          </p>
        </Section>

        <Section id="contact" title="Contact">
          <p>
            If you need help with this policy, email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-accent-brand underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
          <p>
            For security issues, contact{" "}
            <a
              href="mailto:security@postglee.app"
              className="font-medium text-accent-brand underline"
            >
              security@postglee.app
            </a>
            .
          </p>
        </Section>
      </div>

      <footer className="border-t border-black/8 bg-white px-6 py-8 text-center text-sm text-black/40">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6">
          <Link href="/privacy-policy" className="font-medium text-accent-brand">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="transition hover:text-black">
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
