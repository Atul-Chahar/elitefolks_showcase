import { Permission, Role, Query } from 'node-appwrite';

/**
 * Checks if a user is "new" by verifying if they have any XP or enrolled courses.
 */
export async function isUserNew(databases: any, dbId: string, userId: string): Promise<boolean> {
    try {
        const statsRes = await databases.listDocuments(dbId, 'user_stats', [
            Query.equal('user_id', userId),
            Query.limit(1),
        ]);

        if (statsRes.total > 0 && statsRes.documents[0].xp > 0) {
            return false;
        }

        const progressRes = await databases.listDocuments(dbId, 'user_course_progress', [
            Query.equal('user_id', userId),
            Query.limit(1),
        ]);

        if (progressRes.total > 0) {
            return false;
        }

        return true;
    } catch (e) {
        console.warn('[isUserNew] Check failed:', e);
        return false; // Default to false if we can't check
    }
}

/**
 * Auto-remap migrated Supabase data to a newly generated Appwrite user ID.
 * Finds any old profile matching the email that has a UUID format.
 */
export async function autoRemapByEmail(databases: any, dbId: string, email: string, newUserId: string): Promise<void> {
    if (!email) return;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    try {
        const oldProfiles = await databases.listDocuments(dbId, 'profiles', [
            Query.equal('email', email.toLowerCase()),
            Query.limit(5),
        ]);

        for (const oldProfile of oldProfiles.documents) {
            const oldId = oldProfile.$id;
            if (uuidRegex.test(oldId) && oldId !== newUserId) {
                console.log(`[Auth] Remapping migrated data: ${oldId} → ${newUserId}`);
                await remapUserData(databases, dbId, oldId, newUserId, oldProfile);
                break;
            }
        }
    } catch (e) {
        console.warn('[AutoRemap] check warning:', e);
    }
}

/**
 * Remap migrated Supabase data from oldUserId → newUserId.
 */
export async function remapUserData(databases: any, dbId: string, oldUserId: string, newUserId: string, oldProfile: any) {
    try {
        await databases.getDocument(dbId, 'profiles', newUserId);
        await databases.updateDocument(dbId, 'profiles', newUserId, {
            full_name: oldProfile.full_name || '',
            email: oldProfile.email || '',
            avatar_url: oldProfile.avatar_url || undefined,
        });
    } catch (e: any) {
        if (e.code === 404) {
            await databases.createDocument(dbId, 'profiles', newUserId, {
                full_name: oldProfile.full_name || '',
                email: oldProfile.email || '',
                avatar_url: oldProfile.avatar_url || undefined,
            }, [
                Permission.read(Role.user(newUserId)),
                Permission.update(Role.user(newUserId)),
            ]);
        }
    }

    try {
        const oldStats = await databases.listDocuments(dbId, 'user_stats', [
            Query.equal('user_id', oldUserId), Query.limit(1),
        ]);
        if (oldStats.total > 0) {
            const stat = oldStats.documents[0];
            const newStats = await databases.listDocuments(dbId, 'user_stats', [
                Query.equal('user_id', newUserId), Query.limit(1),
            ]);
            if (newStats.total > 0) {
                const newDoc = newStats.documents[0];
                if (stat.xp > (newDoc.xp || 0)) {
                    await databases.updateDocument(dbId, 'user_stats', newDoc.$id, {
                        xp: stat.xp || 0, coins: stat.coins || 0, level: stat.level || 1,
                        current_streak: stat.current_streak || 0, longest_streak: stat.longest_streak || 0,
                        lessons_completed: stat.lessons_completed || 0,
                    });
                }
            } else {
                await databases.updateDocument(dbId, 'user_stats', stat.$id, { user_id: newUserId });
            }
        }
    } catch (e) { console.warn('[Auth Remap] user_stats:', e); }

    try {
        const oldProgress = await databases.listDocuments(dbId, 'user_course_progress', [
            Query.equal('user_id', oldUserId), Query.limit(100),
        ]);
        for (const doc of oldProgress.documents) {
            try {
                await databases.updateDocument(dbId, 'user_course_progress', doc.$id, { user_id: newUserId }, [
                    Permission.read(Role.user(newUserId)),
                    Permission.update(Role.user(newUserId)),
                    Permission.delete(Role.user(newUserId)),
                ]);
            } catch { /* skip */ }
        }
    } catch (e) { console.warn('[Auth Remap] progress:', e); }

    try {
        const oldActivity = await databases.listDocuments(dbId, 'activity_log', [
            Query.equal('user_id', oldUserId), Query.limit(500),
        ]);
        for (const doc of oldActivity.documents) {
            try {
                await databases.updateDocument(dbId, 'activity_log', doc.$id, { user_id: newUserId });
            } catch { /* skip */ }
        }
    } catch (e) { console.warn('[Auth Remap] activity_log:', e); }

    console.log(`[Auth] Successfully remapped data from ${oldUserId} → ${newUserId}`);
}
