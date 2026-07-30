import { LinkIssue } from "./types";

export function parseLinkinator(result: any) {
  const issues: LinkIssue[] = [];

  result.links.forEach((link: any) => {
    issues.push({
      url: link.url,

      parent: link.parent,

      status: link.status,

      state: link.state,

      internal: link.internal,

      redirected: link.redirected,
    });
  });

  return issues;
}