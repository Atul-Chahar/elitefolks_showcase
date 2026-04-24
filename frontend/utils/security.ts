/**
 * Security utilities for the application.
 */

/**
 * Sanitizes a string by removing HTML tags to prevent XSS/HTML injection.
 * @param str The string to sanitize
 * @returns The sanitized string
 */
export const sanitizeString = (str: string): string => {
    if (!str) return '';
    // Remove all HTML tags using a regular expression
    return str.replace(/<[^>]*>?/gm, '');
};
