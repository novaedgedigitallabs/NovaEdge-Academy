export async function getRssFeedPosts() {
    try {
        const res = await fetch("https://www.novaedgedigitallabs.tech/rss.xml", {
            cache: "no-store"
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch RSS feed: ${res.status}`);
        }

        const xmlText = await res.text();
        return parseRssXml(xmlText);
    } catch (error) {
        console.error("Error fetching RSS feed:", error);
        return [];
    }
}

function parseRssXml(xmlString) {
    if (typeof window !== "undefined" && window.DOMParser) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, "text/xml");
            const items = xmlDoc.querySelectorAll("item");

            if (items && items.length > 0) {
                return Array.from(items).map((item, index) => {
                    const title = item.querySelector("title")?.textContent?.replace(/^<!\[CDATA\[|\]\]>$/g, "").trim() || "Untitled Article";
                    const link = item.querySelector("link")?.textContent?.trim() || "https://www.novaedgedigitallabs.tech/blog";
                    const pubDate = item.querySelector("pubDate")?.textContent?.trim() || new Date().toISOString();
                    const description = item.querySelector("description")?.textContent?.replace(/^<!\[CDATA\[|\]\]>$/g, "").replace(/<[^>]+>/g, "").trim() || "";
                    const category = item.querySelector("category")?.textContent?.trim() || "Technology";
                    
                    const enclosure = item.querySelector("enclosure");
                    const image = enclosure?.getAttribute("url") || "/Header_logo.webp";

                    return {
                        _id: `rss-${index}`,
                        title,
                        link,
                        excerpt: description,
                        category,
                        image,
                        createdAt: pubDate,
                        readTime: "5 min read",
                        author: "NovaEdge Digital Labs",
                        isRss: true,
                    };
                });
            }
        } catch (e) {
            console.error("DOMParser error:", e);
        }
    }

    // Fallback regex parsing
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;

    while ((match = itemRegex.exec(xmlString)) !== null) {
        const itemContent = match[1];
        
        const titleMatch = itemContent.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/i);
        const linkMatch = itemContent.match(/<link>(.*?)<\/link>/i);
        const dateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/i);
        const descMatch = itemContent.match(/<description>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/description>/i);
        const catMatch = itemContent.match(/<category>(.*?)<\/category>/i);
        const encMatch = itemContent.match(/<enclosure[^>]+url=["'](.*?)["']/i);

        items.push({
            _id: `rss-regex-${items.length}`,
            title: titleMatch ? titleMatch[1].replace(/^<!\[CDATA\[|\]\]>$/g, "").trim() : "Untitled Article",
            link: linkMatch ? linkMatch[1].trim() : "https://www.novaedgedigitallabs.tech/blog",
            excerpt: descMatch ? descMatch[1].replace(/^<!\[CDATA\[|\]\]>$/g, "").replace(/<[^>]+>/g, "").trim() : "",
            category: catMatch ? catMatch[1].trim() : "Technology",
            image: encMatch ? encMatch[1] : "/Header_logo.webp",
            createdAt: dateMatch ? dateMatch[1].trim() : new Date().toISOString(),
            readTime: "5 min read",
            author: "NovaEdge Digital Labs",
            isRss: true,
        });
    }

    return items;
}
