"use client"

import { useState } from "react"
import { Check, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getApiBaseDomain } from "../api/developer-api"

export function ApiReference() {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null)
  const [activeSnippetTab, setActiveSnippetTab] = useState<"curl" | "ts" | "python">("curl")

  const baseDomain = getApiBaseDomain()

  const swaggerUrl = `${baseDomain}/api/v1/docs/`
  const redocUrl = `${baseDomain}/api/v1/redoc/`
  const swaggerJsonUrl = `${baseDomain}/api/v1/swagger.json`
  const swaggerYamlUrl = `${baseDomain}/api/v1/swagger.yaml`

  const endpoints = [
    {
      method: "GET",
      path: "/api/v1/brands/",
      scope: "accounts:read",
      description: "List brands accessible to the OAuth token.",
      params: "-",
    },
    {
      method: "GET",
      path: "/api/v1/accounts/",
      scope: "accounts:read",
      description: "List connected social accounts (Instagram, TikTok, X, YouTube, etc.).",
      params: "?brand_id=<id>",
    },
    {
      method: "GET",
      path: "/api/v1/posts/",
      scope: "posts:read",
      description: "List upcoming scheduled, draft, or published posts.",
      params: "?brand_id=&platform=&content_type=&limit=",
    },
    {
      method: "POST",
      path: "/api/v1/posts/",
      scope: "posts:write",
      description: "Create or schedule a new post across selected channels.",
      params: "Body: { caption, platforms, scheduled_at }",
    },
    {
      method: "GET",
      path: "/api/v1/posts/calendar/",
      scope: "posts:read",
      description: "Retrieve posts arranged by date for calendar view.",
      params: "?brand_id=&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD",
    },
    {
      method: "GET",
      path: "/api/v1/posts/{post_id}/",
      scope: "posts:read",
      description: "Get detailed status and per-platform metrics for a post.",
      params: "Path: post_id",
    },
    {
      method: "PATCH",
      path: "/api/v1/posts/{post_id}/",
      scope: "posts:write",
      description: "Edit post caption, reschedule time, or adjust destination platforms.",
      params: "Body: { caption?, scheduled_at?, platforms? }",
    },
    {
      method: "DELETE",
      path: "/api/v1/posts/{post_id}/",
      scope: "posts:write",
      description: "Cancel an upcoming scheduled post or delete a draft.",
      params: "Path: post_id",
    },
  ]

  const snippets = {
    curl: `# 1. Fetch connected accounts
curl -X GET "${baseDomain}/api/v1/accounts/" \\
  -H "Authorization: Bearer YOUR_OAUTH_TOKEN" \\
  -H "Accept: application/json"

# 2. Schedule a post
curl -X POST "${baseDomain}/api/v1/posts/" \\
  -H "Authorization: Bearer YOUR_OAUTH_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "caption": "Exciting news! Launching our new feature tomorrow. 🚀 #innovation",
    "platforms": ["twitter", "linkedin", "instagram"],
    "scheduled_at": "2026-11-01T15:00:00Z"
  }'`,

    ts: `// Using TypeScript / fetch
async function scheduleSocialPost(token: string) {
  const response = await fetch("${baseDomain}/api/v1/posts/", {
    method: "POST",
    headers: {
      "Authorization": \`Bearer \${token}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      caption: "Exciting news! Launching our new feature tomorrow. 🚀 #innovation",
      platforms: ["twitter", "linkedin"],
      scheduled_at: "2026-11-01T15:00:00Z",
    }),
  });

  const { data } = await response.json();
  console.log("Scheduled post ID:", data.id);
  return data;
}`,

    python: `import requests

OAUTH_TOKEN = "YOUR_OAUTH_TOKEN"
API_BASE = "${baseDomain}/api/v1"

headers = {
    "Authorization": f"Bearer {OAUTH_TOKEN}",
    "Content-Type": "application/json"
}

# Schedule post
payload = {
    "caption": "Exciting news! Launching our new feature tomorrow. 🚀 #innovation",
    "platforms": ["twitter", "linkedin"],
    "scheduled_at": "2026-11-01T15:00:00Z"
}

response = requests.post(f"{API_BASE}/posts/", json=payload, headers=headers)
print("Response:", response.json())`,
  }

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedSnippet(id)
    setTimeout(() => setCopiedSnippet(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Interactive Docs & Schema Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <a
          href={swaggerUrl}
          target="_blank"
          rel="noreferrer"
          className="group rounded-xl border border-black/8 dark:border-white/8 bg-white dark:bg-slate-900 p-3.5 shadow-2xs hover:border-slate-400 dark:hover:border-slate-600 transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
              Swagger UI
            </h4>
            <ExternalLink className="size-3 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition" />
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            Interactive test runner & playground
          </p>
        </a>

        <a
          href={redocUrl}
          target="_blank"
          rel="noreferrer"
          className="group rounded-xl border border-black/8 dark:border-white/8 bg-white dark:bg-slate-900 p-3.5 shadow-2xs hover:border-slate-400 dark:hover:border-slate-600 transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
              ReDoc UI
            </h4>
            <ExternalLink className="size-3 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition" />
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            Structured three-panel reference
          </p>
        </a>

        <a
          href={swaggerJsonUrl}
          target="_blank"
          rel="noreferrer"
          className="group rounded-xl border border-black/8 dark:border-white/8 bg-white dark:bg-slate-900 p-3.5 shadow-2xs hover:border-slate-400 dark:hover:border-slate-600 transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
              OpenAPI (JSON)
            </h4>
            <ExternalLink className="size-3 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition" />
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            Export schema for Postman / SDKs
          </p>
        </a>

        <a
          href={swaggerYamlUrl}
          target="_blank"
          rel="noreferrer"
          className="group rounded-xl border border-black/8 dark:border-white/8 bg-white dark:bg-slate-900 p-3.5 shadow-2xs hover:border-slate-400 dark:hover:border-slate-600 transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
              OpenAPI (YAML)
            </h4>
            <ExternalLink className="size-3 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition" />
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            Raw YAML specification
          </p>
        </a>
      </div>

      {/* Endpoints Table */}
      <div className="rounded-xl border border-black/8 dark:border-white/8 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-black/5 dark:border-white/5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Public v1 Endpoints
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Authenticate by passing <code className="font-mono text-slate-700 dark:text-slate-300">Authorization: Bearer &lt;token&gt;</code>
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5 bg-slate-50/70 dark:bg-slate-950 text-slate-500">
                <th className="py-2.5 px-4 font-semibold uppercase tracking-wider text-[10px]">Method</th>
                <th className="py-2.5 px-4 font-semibold uppercase tracking-wider text-[10px]">Endpoint</th>
                <th className="py-2.5 px-4 font-semibold uppercase tracking-wider text-[10px]">Scope</th>
                <th className="py-2.5 px-4 font-semibold uppercase tracking-wider text-[10px]">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {endpoints.map((ep) => (
                <tr key={`${ep.method}-${ep.path}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-block rounded px-2 py-0.5 font-mono text-[10px] font-semibold ${
                        ep.method === "GET"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                          : ep.method === "POST"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                          : ep.method === "PATCH"
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                      }`}
                    >
                      {ep.method}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-mono font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap select-all">
                    {ep.path}
                  </td>
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                      {ep.scope}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">
                    <p>{ep.description}</p>
                    {ep.params !== "-" && (
                      <p className="mt-0.5 font-mono text-[11px] text-slate-400">
                        {ep.params}
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Snippets Section */}
      <div className="rounded-xl border border-black/8 dark:border-white/8 bg-white dark:bg-slate-900 p-4 space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Code Examples
            </h3>
            <p className="text-xs text-slate-500">
              Quick start requests for integrating with the API.
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5">
            <button
              type="button"
              onClick={() => setActiveSnippetTab("curl")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition cursor-pointer ${
                activeSnippetTab === "curl"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              cURL
            </button>
            <button
              type="button"
              onClick={() => setActiveSnippetTab("ts")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition cursor-pointer ${
                activeSnippetTab === "ts"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              TypeScript
            </button>
            <button
              type="button"
              onClick={() => setActiveSnippetTab("python")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition cursor-pointer ${
                activeSnippetTab === "python"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Python
            </button>
          </div>
        </div>

        <div className="relative group">
          <pre className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-950 p-4 font-mono text-xs text-slate-100 overflow-x-auto leading-relaxed">
            <code>{snippets[activeSnippetTab]}</code>
          </pre>
          <Button
            type="button"
            size="sm"
            onClick={() => handleCopy(snippets[activeSnippetTab], activeSnippetTab)}
            className="absolute top-3 right-3 h-7 text-xs gap-1.5 cursor-pointer bg-slate-800 hover:bg-slate-700 text-white"
          >
            {copiedSnippet === activeSnippetTab ? (
              <>
                <Check className="size-3 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-3" />
                <span>Copy</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
