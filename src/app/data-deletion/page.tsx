import { Metadata } from "next";
import Link from "next/link";
import { Mail, Clock, CheckCircle, AlertCircle, Trash2 } from "lucide-react";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "Data Deletion Request | PostReach",
  description:
    "Request deletion of your PostReach account data or your Facebook/Instagram data collected through our app.",
};

const CONTACT_EMAIL = "privacy@postreach.app";
const RESPONSE_DAYS = 30;

interface StepProps {
  number: number;
  title: string;
  description: string;
}

function Step({ number, title, description }: StepProps) {
  return (
    <div className="flex gap-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-dark to-accent-brand text-sm font-bold text-white shadow-sm">
        {number}
      </div>
      <div>
        <p className="font-semibold text-black">{title}</p>
        <p className="mt-0.5 text-sm text-black/60">{description}</p>
      </div>
    </div>
  );
}

interface DataTypeCardProps {
  title: string;
  items: string[];
  timeline: string;
}

function DataTypeCard({ title, items, timeline }: DataTypeCardProps) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <h3 className="mb-3 font-semibold text-black">{title}</h3>
      <ul className="mb-4 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-black/60">
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
            {item}
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-2 rounded-lg bg-black/[0.03] px-3 py-2">
        <Clock className="h-3.5 w-3.5 shrink-0 text-black/40" />
        <span className="text-xs text-black/50">{timeline}</span>
      </div>
    </div>
  );
}

export default function DataDeletionPage() {
  return (
    <main className="flex min-h-screen flex-col text-foreground">
      <Navbar />

      {/* Hero */}
      <div className="border-b border-black/10 bg-gradient-to-b from-orange-50 to-white px-6 py-16 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-dark to-accent-brand shadow-md">
          <Trash2 className="h-7 w-7 text-white" />
        </div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent-brand">
          Legal
        </p>
        <h1 className="text-4xl font-bold text-black md:text-5xl">
          Data Deletion Request
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-black/50">
          You have the right to request deletion of your personal data from PostReach at any
          time. This page explains how.
        </p>
      </div>

      <div className="mx-auto w-full max-w-4xl px-6 py-14 space-y-14">

        {/* Facebook / Meta specific notice */}
        <section>
          <div className="rounded-2xl border border-blue-200 bg-blue-50 px-6 py-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
              <div>
                <p className="font-semibold text-blue-900">Facebook / Instagram Users</p>
                <p className="mt-1 text-sm text-blue-800/80">
                  If you connected your Facebook or Instagram account to PostReach and would like
                  to remove the data we collected through the Facebook Login, send us a deletion
                  request using the steps below. We will process it within {RESPONSE_DAYS} days
                  and confirm by email once complete.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What data we delete */}
        <section>
          <h2 className="mb-6 text-2xl font-bold text-black">What Data We Delete</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DataTypeCard
              title="Account Data"
              items={[
                "Name and email address",
                "Profile information",
                "Account preferences and settings",
              ]}
              timeline="Deleted within 30 days"
            />
            <DataTypeCard
              title="Social Media Data"
              items={[
                "OAuth access tokens",
                "Connected account profiles",
                "Scheduled and published posts",
              ]}
              timeline="Tokens revoked immediately; records deleted within 30 days"
            />
            <DataTypeCard
              title="Usage & Analytics"
              items={[
                "Activity logs and session data",
                "Post performance data",
                "Feature usage history",
              ]}
              timeline="Deleted from live systems within 30 days; purged from backups within 90 days"
            />
          </div>
        </section>

        {/* How to request deletion */}
        <section>
          <h2 className="mb-6 text-2xl font-bold text-black">How to Request Deletion</h2>

          <div className="mb-6 rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
            <p className="mb-6 text-sm text-black/60">
              To request deletion of your data, send us an email and we&apos;ll take care of the
              rest. No account login required.
            </p>
            <div className="space-y-4">
              <Step
                number={1}
                title="Send us an email"
                description={`Email ${CONTACT_EMAIL} with the subject line "Data Deletion Request".`}
              />
              <Step
                number={2}
                title="Include your account email"
                description="Provide the email address associated with your PostReach account so we can locate your data."
              />
              <Step
                number={3}
                title="Specify what to delete"
                description="Let us know if you want to delete your full account or specific data only (e.g. only your Facebook/Instagram data)."
              />
              <Step
                number={4}
                title="We confirm and process"
                description={`We'll confirm receipt within 5 business days and complete the deletion within ${RESPONSE_DAYS} days.`}
              />
            </div>
          </div>
        </section>

        {/* Email CTA */}
        <section>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent-dark to-accent-brand px-8 py-10 text-center text-white shadow-lg">
            {/* Decorative circles */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/10" />

            <div className="relative z-10">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h2 className="mb-2 text-2xl font-bold">Ready to submit a request?</h2>
              <p className="mb-6 text-white/80">
                Email us directly and we&apos;ll handle your request within {RESPONSE_DAYS} days.
              </p>
              <a
                id="data-deletion-email-cta"
                href={`mailto:${CONTACT_EMAIL}?subject=Data Deletion Request&body=Hello PostReach team,%0A%0AI would like to request deletion of my data.%0A%0AAccount email: %0AData to delete (all / Facebook only / other): %0A%0AThank you`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-accent-dark shadow-sm transition hover:shadow-md hover:opacity-95"
              >
                <Mail className="h-4 w-4" />
                Email {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </section>

        {/* Timeline & what's NOT deleted */}
        <section className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent-brand" />
              <h3 className="font-semibold text-black">Processing Timeline</h3>
            </div>
            <ul className="space-y-3 text-sm text-black/60">
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Access tokens revoked <strong>immediately</strong>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Live database records deleted within <strong>30 days</strong>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Backup copies purged within <strong>90 days</strong>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                Confirmation email sent once complete
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <h3 className="font-semibold text-black">What We May Retain</h3>
            </div>
            <ul className="space-y-3 text-sm text-black/60">
              <li className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                Billing records required for <strong>legal/tax compliance</strong>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                Anonymised, aggregated analytics (no personal identifiers)
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                Data required to resolve active legal disputes
              </li>
            </ul>
          </div>
        </section>

        {/* More questions */}
        <section className="rounded-2xl border border-black/10 bg-black/[0.02] px-6 py-6 text-center">
          <p className="text-sm text-black/60">
            Have questions about your data or this process?{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-accent-brand underline"
            >
              {CONTACT_EMAIL}
            </a>{" "}
            — or read our{" "}
            <Link href="/privacy-policy" className="font-medium text-accent-brand underline">
              Privacy Policy
            </Link>{" "}
            for full details on how we handle your data.
          </p>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-black/10 bg-white px-6 py-8 text-center text-sm text-black/40">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6">
          <Link href="/privacy-policy" className="hover:text-black transition">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="hover:text-black transition">
            Terms of Service
          </Link>
          <Link href="/data-deletion" className="font-medium text-accent-brand">
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
