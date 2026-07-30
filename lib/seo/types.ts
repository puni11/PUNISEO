export interface LinkIssue {
  url: string;
  parent?: string;
  status: number;
  state: string;
  internal: boolean;
  redirected?: boolean;
}

export interface LinkSummary {
  scanned: number;
  broken: number;
  redirects: number;
  healthy: number;
  errors: number;
}