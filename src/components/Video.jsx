/**
 * Videos Component
 * Displays a list of video thumbnails with titles.
 * Author: Nick Hanson
 * Created On: June 10, 2025
 * Last Updated: June 10, 2025
 * Description: A component to showcase video content with thumbnails and titles.
 * 
 * Props:
 * - videos: An array of video objects containing 'title' and 'thumbnailUrl'.
 * Notes:
 * - Uses Tailwind CSS classes for styling.
 * - Responsive design included for mobile and desktop views.
 */

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getYouTubeMetadata, getYouTubeThumb } from "../utils/thumbnail.js";

const Video = ({ video = {} }) => {
    const videoLinks = video.videoLinks || [];

    const [linkMeta, setLinkMeta] = useState([]);
    const [metaLoading, setMetaLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        async function loadMeta() {
        try {
            if (!videoLinks.length) {
            setLinkMeta([]);
            return;
            }
            const metas = await Promise.all(
            videoLinks.map(l => getYouTubeMetadata(l.url))
            );
            if (!cancelled) setLinkMeta(metas);
        } finally {
            if (!cancelled) setMetaLoading(false);
        }
        }
        loadMeta();
        return () => { cancelled = true; };
    }, [videoLinks]);

    return (
        <div className="border-2 border-gray-400 p-6 rounded mb-5">
            <p className="dark:text-gray-200 text-gray-700 font-semibold text-lg mb-4">{video.title}:</p>
            <div className="mb-4">
              {video.descriptionTitle && (
                <p className="dark:text-gray-200 text-gray-700 font-semibold mb-2">{video.descriptionTitle}</p>
              )}
              {video.description && (
                video.description.map((desc, index) => (
                    <p key={index} className="dark:text-gray-200 text-gray-700 text-sm mb-2">{desc}</p>
                ))
              )}
              {
                video.descriptionBullets && (
                  <ol className={video.descriptionBullets.type === "ul" ? "list-disc list-inside" : "list-decimal list-inside"}>
                    {video.descriptionBullets.items.map((bullet, index) => (    
                      <li key={index} className="dark:text-gray-200 text-gray-700 text-sm ml-3">{bullet}</li>
                    ))}
                  </ol>
                )
              }
            </div>
            {video.descriptionTitle2 && (
              <p className="dark:text-gray-200 text-gray-700 font-semibold mb-2">{video.descriptionTitle2}</p>
            )}
            { video.descriptionBullets2 && (
              <ol className={video.descriptionBullets2.type === "ul" ? "list-disc list-inside" : "list-decimal list-inside mb-4"}>
                {video.descriptionBullets2.items.map((bullet, index) => (
                  <li key={index} className="dark:text-gray-200 text-gray-700 text-sm ml-3">{bullet}</li>
                ))}
              </ol>
            )}
            {video.description2 && (
              video.description2.map((desc, index) => (
                  <p key={index} className="dark:text-gray-200 text-gray-700 text-sm mb-2">{desc}</p>
              ))
            )}
            {video.videoLinksTitle && (
              <p className="dark:text-gray-200 text-gray-700 font-semibold mb-5">{video.videoLinksTitle}</p>
            )}
            {/* Thumbnails grid */}
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 mb-5">
                {metaLoading && <div className="text-sm text-gray-500">Loading video info…</div>}
                {!metaLoading && videoLinks.map((link, i) => {
                    const meta = linkMeta[i];
                    const fallbackThumb = getYouTubeThumb(link.url, "hqdefault");

                    const thumb = meta?.thumbnail || fallbackThumb;
                    const label = meta?.title ? `${link.title}` || `${meta.title}` : link.part;

                    return (
                        <a key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block rounded overflow-hidden bg-black/10">
                        <img
                            src={thumb}
                            alt={label}
                            loading="lazy"
                            className="w-full h-60 object-cover transition-transform group-hover:scale-[1.02]"
                        />
                        <div className="px-2 py-1 text-sm font-medium text-blue-700 dark:text-blue-300">
                            {label}
                        </div>
                        </a>
                    );
                })}
            </div>
        </div>
    );
};
Video.propTypes = {
    video: PropTypes.shape({
        url: PropTypes.string,
        metadata: PropTypes.shape({
            title: PropTypes.string,
            thumbnail: PropTypes.string,
        }),
        title: PropTypes.string.isRequired,
        descriptionTitle: PropTypes.string.isRequired,
        descriptionTitle2: PropTypes.string,
        description: PropTypes.arrayOf(PropTypes.string).isRequired,
        description2: PropTypes.arrayOf(PropTypes.string),
        descriptionBullets: PropTypes.shape({
            type: PropTypes.oneOf(['ul', 'ol']).isRequired,
            items: PropTypes.arrayOf(PropTypes.string).isRequired,
        }),
        descriptionBullets2: PropTypes.shape({
            type: PropTypes.oneOf(['ul', 'ol']).isRequired,
            items: PropTypes.arrayOf(PropTypes.string).isRequired,
        }),
        videoLinksTitle: PropTypes.string,
        videoLinks: PropTypes.arrayOf(PropTypes.shape({
            part: PropTypes.string,
            title: PropTypes.string,
            url: PropTypes.string.isRequired,
        })),
    }),
};
export default Video;