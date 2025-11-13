/**
 * File: thumbnail.js
 * Author: Nick Hanson
 * Created On: June 10, 2025
 * Last Updated: June 10, 2025
 * Description: Utility functions for handling video thumbnails.
 *
 * Props:
 * - None
 *
 * Functions:
 * - getYouTubeId: Extracts the YouTube video ID from a given URL.
 * - getYouTubeThumbnail: Returns the thumbnail URL for a given YouTube video ID.
 *
 * Notes:
 * - This utility is used to standardize thumbnail retrieval across the app.
 *
 * Dependencies:
 * - None
 */

export function getYouTubeId(url) {
    try {
        const u = new URL(url);
        if (u.hostname === "youtu.be") return u.pathname.slice(1);
        if (u.hostname.includes("youtube.com")) {
            if (u.pathname === "/watch") return u.searchParams.get("v");
            // e.g., /embed/VIDEOID or /v/VIDEOID
            const parts = u.pathname.split("/");
            const idx = parts.findIndex((p) => p === "embed" || p === "v");
            if (idx >= 0) return parts[idx + 1];
        }
    } catch {
        /* ignore */
    }
    return null;
}

export async function getYouTubeMetadata(url) {
    const id = getYouTubeId(url);
    if (!id) return null;

    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;

    try {
        const res = await fetch(oembedUrl);
        if (!res.ok) throw new Error(`oEmbed HTTP ${res.status}`);
        const data = await res.json();

        return {
            id,
            title: data.title,
            author: data.author_name,
            thumbnail:
                data.thumbnail_url ??
                `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
            embedUrl: `https://www.youtube.com/embed/${id}`,
        };
    } catch (err) {
        // Fallback if oEmbed fails (network/CORS/etc.)
        return {
            id,
            title: null,
            author: null,
            thumbnail: getYouTubeThumb(url),
            embedUrl: `https://www.youtube.com/embed/${id}`,
            error: String(err),
        };
    }
}

export function getYouTubeThumb(url, quality = "hqdefault") {
    const id = getYouTubeId(url);
    if (!id) return null;
    return `https://img.youtube.com/vi/${id}/${quality}.jpg`;
}
