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

export default async function middleware(): Promise<Response | undefined> {
    try {
        const upstream = await fetch(`${FRAMER_ORIGIN}/`, {
            headers: { accept: 'text/html' },
        });

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
