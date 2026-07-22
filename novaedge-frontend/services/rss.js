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

function parseRssXml(xmlString) {
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;

    let index = 0;
    while ((match = itemRegex.exec(xmlString)) !== null) {
        const itemContent = match[1];
        
        const titleMatch = itemContent.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/i);
        const dateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/i);
        const descMatch = itemContent.match(/<description>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/description>/i);
        const contentMatch = itemContent.match(/<content:encoded>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/content:encoded>/i);
        const catMatch = itemContent.match(/<category>(.*?)<\/category>/i);
        const encMatch = itemContent.match(/<enclosure[^>]+url=["'](.*?)["']/i);

        const title = titleMatch ? titleMatch[1].replace(/^<!\[CDATA\[|\]\]>$/g, "").trim() : "Untitled Article";
        const slug = slugify(title) || `article-${index}`;
        const excerpt = descMatch ? descMatch[1].replace(/^<!\[CDATA\[|\]\]>$/g, "").replace(/<[^>]+>/g, "").trim() : "";
        const rawContent = contentMatch ? contentMatch[1].replace(/^<!\[CDATA\[|\]\]>$/g, "").trim() : (descMatch ? descMatch[1].replace(/^<!\[CDATA\[|\]\]>$/g, "").trim() : excerpt);

        items.push({
            _id: slug,
            slug: slug,
            title,
            excerpt,
            content: rawContent,
            category: catMatch ? catMatch[1].trim() : "Technology",
            image: encMatch ? encMatch[1] : "/Header_logo.webp",
            createdAt: dateMatch ? dateMatch[1].trim() : new Date().toISOString(),
            readTime: "5 min read",
            author: "NovaEdge Digital Labs",
            isRss: true,
        });
        index++;
    }

    return items;
}
