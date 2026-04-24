export function getPublicAppUrl(request: Request): string {
    const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
    if (envUrl) {
        return envUrl.replace(/\/$/, '');
    }

    const url = new URL(request.url);
    const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim();
    const forwardedProto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim();
    const host = forwardedHost || request.headers.get('host') || url.host;
    const proto = forwardedProto || url.protocol.replace(':', '');

    return `${proto}://${host}`.replace(/\/$/, '');
}

