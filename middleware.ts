/**
 * Vercel Edge Middleware.
 *
 * The `/` route is rewritten to the Framer-hosted landing page (see
 * `vercel.json`), whose HTML declares `zenstack.framer.website` as the
 * canonical/og:url. This middleware proxies the page and rewrites those
 * URLs to `https://zenstack.dev` so search engines index the real domain.
 *
 * If anything goes wrong it returns `undefined`, falling through to the
 * plain rewrite in `vercel.json` (unmodified page instead of an error).
 */

const FRAMER_ORIGIN = 'https://zenstack.framer.website';
const CANONICAL_ORIGIN = 'https://zenstack.dev';

export const config = { matcher: '/' };

export default async function middleware(request: Request): Promise<Response | undefined> {
    try {
        // preserve the original query string; forward only headers that may
        // affect the HTML Framer serves (never cookie/host)
        const { search } = new URL(request.url);
        const requestHeaders = new Headers({ accept: 'text/html' });
        for (const name of ['user-agent', 'accept-language']) {
            const value = request.headers.get(name);
            if (value) {
                requestHeaders.set(name, value);
            }
        }

        const upstream = await fetch(`${FRAMER_ORIGIN}/${search}`, { headers: requestHeaders });

        const contentType = upstream.headers.get('content-type') ?? '';
        if (!upstream.ok || !contentType.includes('text/html')) {
            return undefined;
        }

        const html = await upstream.text();
        const rewritten = html.split(FRAMER_ORIGIN).join(CANONICAL_ORIGIN);

        const headers = new Headers(upstream.headers);
        // the body was re-encoded, so the upstream encoding/length no longer apply
        headers.delete('content-encoding');
        headers.delete('content-length');

        return new Response(rewritten, { status: upstream.status, headers });
    } catch {
        return undefined;
    }
}
