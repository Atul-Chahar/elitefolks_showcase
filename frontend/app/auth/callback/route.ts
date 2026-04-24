import { NextResponse } from 'next/server';
import { createAdminClient, SESSION_COOKIE } from '@/lib/appwrite-server';
import { Users, Permission, Role, ID, Query, Avatars } from 'node-appwrite';
import { cookies } from 'next/headers';
import { autoRemapByEmail, isUserNew } from '@/lib/auth-utils';

const DB = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'elitefolks-db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const secret = searchParams.get('secret');

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin).replace(/\/$/, '');

    if (!userId || !secret) {
        return NextResponse.redirect(`${appUrl}/login?error=OAuth+authentication+failed`);
    }

    try {
        const { account, databases, client } = createAdminClient();

        // Official pattern: Admin client exchanges the OAuth token for a session
        const session = await account.createSession(userId, secret);

        // Set the session cookie
        const cookieStore = await cookies();
        cookieStore.set(SESSION_COOKIE, session.secret, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(session.expire),
        });

        // ── Provision user profile and stats ──────────────────────────
        try {
            const users = new Users(client);
            const user = await users.get(userId);
            const userEmail = (user.email || '').toLowerCase();

            // Auto-remap migrated Supabase data using shared utility
            if (userEmail) {
                await autoRemapByEmail(databases, DB, userEmail, user.$id);
            }

            // Ensure profile exists
            try {
                await databases.getDocument(DB, 'profiles', user.$id);
            } catch (e: any) {
                if (e.code === 404) {
                    let avatarUrl = '';
                    try {
                        // Check if the provider has an avatar we can use
                        const avatars = new Avatars(client);
                        avatarUrl = avatars.getInitials(user.name || user.email).toString();
                        
                        // Note: For real production Google avatars, we usually need the user's provider token
                        // or Appwrite's Identities service. For now, initials are better than a broken link.
                    } catch (e) {
                        avatarUrl = '';
                    }
                    
                    await databases.createDocument(DB, 'profiles', user.$id, {
                        full_name: user.name || user.email?.split('@')[0] || 'User',
                        email: user.email || '',
                        avatar_url: avatarUrl
                    }, [
                        Permission.read(Role.user(user.$id)),
                        Permission.update(Role.user(user.$id)),
                    ]);
                }
            }

            // Ensure user_stats exists
            const statsRes = await databases.listDocuments(DB, 'user_stats', [
                Query.equal('user_id', user.$id),
                Query.limit(1),
            ]);
            if (statsRes.total === 0) {
                await databases.createDocument(DB, 'user_stats', ID.unique(), {
                    user_id: user.$id,
                    xp: 0, coins: 0, level: 1, current_streak: 0, longest_streak: 0, lessons_completed: 0,
                    skill_js: 0, skill_python: 0, skill_voice: 0, skill_logic: 0, skill_speed: 0,
                    active_theme: 'default', subscription_tier: 'free',
                    joined_at: new Date().toISOString(),
                }, [
                    Permission.read(Role.user(user.$id)),
                    Permission.update(Role.user(user.$id)),
                ]);
            }
        } catch (dbErr) {
            console.error('[Auth] Database provisioning warning:', dbErr);
        }

        // Determine where to redirect based on user history
        const isNew = await isUserNew(databases, DB, userId);
        const destination = isNew ? '/courses' : '/dashboard';

        return NextResponse.redirect(`${appUrl}${destination}`);
    } catch (error: any) {
        console.error('[Auth] Callback error:', error);
        return NextResponse.redirect(`${appUrl}/login?error=OAuth+failed&msg=${encodeURIComponent(error.message || 'Unknown')}`);
    }
}

