let rssCache = [];
let lastFetchTime = 0;

export async function getRssFeedPosts() {
    if (rssCache.length > 0 && Date.now() - lastFetchTime < 300000) {
        return rssCache;
    }

    try {
        const res = await fetch("https://www.novaedgedigitallabs.tech/rss.xml", {
            cache: "no-store"
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch RSS feed: ${res.status}`);
        }

        const xmlText = await res.text();
        const items = parseRssXml(xmlText);
        if (items.length > 0) {
            rssCache = items;
            lastFetchTime = Date.now();
        }
        return items;
    } catch (error) {
        console.error("Error fetching RSS feed:", error);
        return rssCache;
    }
}

export async function getRssPostByIdOrSlug(idOrSlug) {
    const posts = await getRssFeedPosts();
    const decoded = decodeURIComponent(idOrSlug);
    return posts.find(
        (p) => p._id === decoded || p.slug === decoded || p._id === idOrSlug
    ) || null;
}

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

function cleanCdata(str) {
    if (!str) return "";
    return str.replace(/^<!\[CDATA\[/g, "").replace(/\]\]>$/g, "").trim();
}

function cleanContent(str) {
    if (!str) return "";
    let cleaned = cleanCdata(str);
    cleaned = cleaned.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
    return cleaned;
}

function parseRssXml(xmlString) {
    if (typeof window !== "undefined" && window.DOMParser) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, "text/xml");
            const items = xmlDoc.querySelectorAll("item");

            if (items && items.length > 0) {
                return Array.from(items).map((item, index) => {
                    const title = cleanCdata(item.querySelector("title")?.textContent || "Untitled Article");
                    const link = item.querySelector("link")?.textContent?.trim() || "https://www.novaedgedigitallabs.tech/blog";
                    const pubDate = item.querySelector("pubDate")?.textContent?.trim() || new Date().toISOString();
                    const description = cleanCdata(item.querySelector("description")?.textContent || "").replace(/<[^>]+>/g, "").trim();
                    
                    // Extract namespaced content:encoded
                    let encodedContent = "";
                    const contentNode = item.getElementsByTagNameNS("http://purl.org/rss/1.0/modules/content/", "encoded")[0] 
                        || item.getElementsByTagName("content:encoded")[0];
                    
                    if (contentNode) {
                        encodedContent = contentNode.textContent || contentNode.innerHTML || "";
                    }

                    const rawContent = encodedContent.trim() || item.querySelector("description")?.textContent || description;
                    const category = item.querySelector("category")?.textContent?.trim() || "Technology";
                    
                    const enclosure = item.querySelector("enclosure");
                    const image = enclosure?.getAttribute("url") || "/Header_logo.webp";

                    const slug = slugify(title) || `article-${index}`;

                    return {
                        _id: slug,
                        slug: slug,
                        title,
                        link,
                        excerpt: description,
                        content: cleanContent(rawContent),
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

    let index = 0;
    while ((match = itemRegex.exec(xmlString)) !== null) {
        const itemContent = match[1];
        
        const titleMatch = itemContent.match(/<title>([\s\S]*?)<\/title>/i);
        const linkMatch = itemContent.match(/<link>([\s\S]*?)<\/link>/i);
        const dateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);
        const descMatch = itemContent.match(/<description>([\s\S]*?)<\/description>/i);
        const contentMatch = itemContent.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/i);
        const catMatch = itemContent.match(/<category>([\s\S]*?)<\/category>/i);
        const encMatch = itemContent.match(/<enclosure[^>]+url=["'](.*?)["']/i);

        const title = titleMatch ? cleanCdata(titleMatch[1]) : "Untitled Article";
        const slug = slugify(title) || `article-${index}`;
        const excerpt = descMatch ? cleanCdata(descMatch[1]).replace(/<[^>]+>/g, "").trim() : "";
        const rawContent = contentMatch ? cleanCdata(contentMatch[1]) : (descMatch ? cleanCdata(descMatch[1]) : excerpt);

        items.push({
            _id: slug,
            slug: slug,
            title,
            link: linkMatch ? cleanCdata(linkMatch[1]) : `/blog/${slug}`,
            excerpt,
            content: cleanContent(rawContent),
            category: catMatch ? cleanCdata(catMatch[1]) : "Technology",
            image: encMatch ? encMatch[1] : "/Header_logo.webp",
            createdAt: dateMatch ? cleanCdata(dateMatch[1]) : new Date().toISOString(),
            readTime: "5 min read",
            author: "NovaEdge Digital Labs",
            isRss: true,
        });
        index++;
    }

    return items;
}
