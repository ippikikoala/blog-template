"use client";

import { useEffect, useRef } from "react";

interface InstagramProps {
    url: string;
    caption?: boolean;
}

declare global {
    interface Window {
        instgrm?: {
            Embeds: {
                process: () => void;
            };
        };
    }
}

export default function Instagram({ url, caption = true }: InstagramProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load Instagram embed script if not already loaded
        const loadInstagramScript = () => {
            if (document.querySelector('script[src*="instagram.com/embed.js"]')) {
                // Script already loaded, just process
                window.instgrm?.Embeds.process();
                return;
            }

            const script = document.createElement("script");
            script.src = "https://www.instagram.com/embed.js";
            script.async = true;
            script.onload = () => {
                window.instgrm?.Embeds.process();
            };
            document.body.appendChild(script);
        };

        loadInstagramScript();
    }, [url]);

    // Extract post ID from URL
    const getEmbedUrl = (inputUrl: string): string => {
        // Remove trailing slash and add /embed
        const cleanUrl = inputUrl.replace(/\/$/, "");
        return `${cleanUrl}/embed${caption ? "" : "/?hidecaption=true"}`;
    };

    return (
        <div
            ref={containerRef}
            className="instagram-embed-container my-8 flex justify-center"
        >
            <blockquote
                className="instagram-media"
                data-instgrm-captioned={caption ? "true" : undefined}
                data-instgrm-permalink={url}
                data-instgrm-version="14"
                style={{
                    background: "#FFF",
                    border: "0",
                    borderRadius: "3px",
                    boxShadow: "0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)",
                    margin: "1px",
                    maxWidth: "540px",
                    minWidth: "326px",
                    padding: "0",
                    width: "calc(100% - 2px)",
                }}
            >
                <div style={{ padding: "16px" }}>
                    <a
                        href={url}
                        style={{
                            background: "#FFFFFF",
                            lineHeight: "0",
                            padding: "0 0",
                            textAlign: "center",
                            textDecoration: "none",
                            width: "100%",
                        }}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Instagramで表示
                    </a>
                </div>
            </blockquote>
        </div>
    );
}
