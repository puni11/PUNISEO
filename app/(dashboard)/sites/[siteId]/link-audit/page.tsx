"use client";

import { useState } from "react";

export default function LinkAuditPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleScan() {
    if (!url) {
      alert("Please enter a website URL");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/audit/linkinator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const text = await res.text();

      try {
        const data = JSON.parse(text);
        setResult(data);
      } catch {
        console.error("Failed to parse JSON:", text);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // Helper variables assuming standard linkinator output format
  const links = result?.links || [];
  const brokenLinks = links.filter((l: any) => l.state === "BROKEN");
  const okLinks = links.filter((l: any) => l.state === "OK");

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Website Link Audit</h1>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            Scan your website to instantly identify broken links, redirects, and missing pages to improve your SEO.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Target URL to Scan
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                placeholder="https://your-website.com"
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors sm:text-sm"
              />
            </div>
            <button
              onClick={handleScan}
              disabled={loading}
              className={`inline-flex items-center justify-center px-8 py-3 border border-transparent text-sm font-medium rounded-xl text-white transition-all ${
                loading 
                  ? "bg-blue-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Scanning...
                </>
              ) : (
                "Run Audit"
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Stats Overview */}
            {links.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Links Scanned</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{links.length}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-red-100 p-6 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-500">Broken Links</p>
                    <p className="text-3xl font-bold text-red-600 mt-1">{brokenLinks.length}</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg text-red-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-green-100 p-6 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Healthy Links</p>
                    <p className="text-3xl font-bold text-green-600 mt-1">{okLinks.length}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg text-green-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                </div>
              </div>
            )}

            {/* List of Broken Links */}
            {brokenLinks.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
                <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                  <h3 className="text-lg font-semibold text-red-800 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    Broken Links Found
                  </h3>
                </div>
                <ul className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                  {brokenLinks.map((link: any, idx: number) => (
                    <li key={idx} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="overflow-hidden flex-1">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Target (Broken URL)</p>
                          <a href={link.url} target="_blank" rel="noreferrer" className="text-red-600 font-medium hover:underline break-all">
                            {link.url}
                          </a>
                          
                          {/* NEW: Where the link was found */}
                          {link.parent && (
                            <div className="mt-3 bg-gray-100/50 p-3 rounded-lg border border-gray-100">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                Found on Page
                              </p>
                              <a href={link.parent} target="_blank" rel="noreferrer" className="text-sm text-gray-600 hover:text-blue-600 hover:underline break-all">
                                {link.parent}
                              </a>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3 whitespace-nowrap mt-2 sm:mt-0">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                            Status: {link.status || "Unknown"}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Raw JSON Fallback / Developer View */}
            <details className="group bg-white border border-gray-200 rounded-xl shadow-sm">
              <summary className="flex items-center justify-between cursor-pointer p-6 font-medium text-gray-700">
                <span>View Raw API Response</span>
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="p-6 pt-0 border-t border-gray-100">
                <pre className="text-xs bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto max-h-96">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </details>
            
          </div>
        )}
      </div>
    </div>
  );
}