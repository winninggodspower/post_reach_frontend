export type AgentId = "claude-desktop" | "chatgpt"

export interface AgentOption {
  id: AgentId
  name: string
  icon: (props: { className?: string }) => React.JSX.Element
}

export const MCP_ENDPOINT = "https://api.postglee.com/mcp"
export const CLAUDE_CONNECTOR_URL = "https://claude.ai/customize/connectors"
