import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Fetch RSS items from NovaEdge Digital Labs
        const rssRes = await fetch("https://www.novaedgedigitallabs.tech/rss.xml", { cache: "no-store" });
        let rssXmlText = "";
        if (rssRes.ok) {
            rssXmlText = await rssRes.text();
        }

        // Return valid RSS XML response
        if (rssXmlText && rssXmlText.includes("<rss")) {
            return new NextResponse(rssXmlText, {
                headers: {
                    "Content-Type": "application/xml; charset=utf-8",
                    "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
                },
            });
        }

        // Fallback XML structure if external RSS fetch is unavailable
        const fallbackXml = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
    <channel>
        <title>NovaEdge Academy Blog Feed</title>
        <link>https://novaedgeacademy.in</link>
        <description>Latest technology insights, DevOps tutorials, AI engineering guides, and web development articles from NovaEdge Academy.</description>
        <language>en</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <item>
            <title>NovaEdge Digital Labs: Practical Technology for Growing Businesses</title>
            <link>https://www.novaedgedigitallabs.tech/blog/novaedge-digital-labs-driving-innovation</link>
            <guid>https://www.novaedgedigitallabs.tech/blog/novaedge-digital-labs-driving-innovation</guid>
            <pubDate>Wed, 17 Jun 2026 00:00:00 GMT</pubDate>
            <description>Discover how NovaEdge Digital Labs helps businesses build practical, scalable technology solutions—from custom software and web development to AI automation.</description>
            <category>Technology</category>
        </item>
    </channel>
</rss>`;

        return new NextResponse(fallbackXml, {
            headers: {
                "Content-Type": "application/xml; charset=utf-8",
                "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
            },
        });
    } catch (error) {
        return new NextResponse("Error generating RSS feed", { status: 500 });
    }
}
