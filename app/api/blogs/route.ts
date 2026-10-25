import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface UnifiedArticle {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  source: "Dev.to" | "Medium" | "Official CJ";
  coverImage?: string;
  date: string;
  author: string;
  authorAvatar?: string;
  category: string;
  tags: string[];
  readTime?: number;
  reactions?: number;
}

// Category to tag mapping
const CATEGORY_TAG_MAP: Record<string, { devto: string; medium: string }> = {
  "Web Development": { devto: "webdev", medium: "web-development" },
  "App Development": { devto: "mobile", medium: "mobile-development" },
  "AI / ML": { devto: "machinelearning", medium: "machine-learning" },
  "DSA": { devto: "algorithms", medium: "data-structures" },
  "DevOps": { devto: "devops", medium: "devops" },
  "Open Source": { devto: "opensource", medium: "open-source" },
  "Career": { devto: "career", medium: "career-advice" },
};

// In-memory cache for fast responses (TTL: 1 hour)
const CACHE_TTL_MS = 60 * 60 * 1000;
const cache: Record<string, { timestamp: number; data: UnifiedArticle[] }> = {};

function cleanText(str?: string): string {
  if (!str) return "";
  return str
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

// 1. Fetch from Dev.to
async function fetchDevToArticles(tag: string, category: string): Promise<UnifiedArticle[]> {
  try {
    const res = await fetch(`https://dev.to/api/articles?tag=${tag}&per_page=8`, {
      headers: {
        "User-Agent": "CodingJunctionPlatform/2.0 (contact@coding-junction.in)",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];
    const items = await res.json();

    if (!Array.isArray(items)) return [];

    return items.map((item: any) => ({
      id: `devto-${item.id}`,
      title: cleanText(item.title),
      excerpt: cleanText(item.description),
      url: item.url,
      source: "Dev.to",
      coverImage: item.cover_image || item.social_image || undefined,
      date: item.published_at || new Date().toISOString(),
      author: item.user?.name || item.user?.username || "Dev.to Creator",
      authorAvatar: item.user?.profile_image || undefined,
      category,
      tags: Array.isArray(item.tag_list) ? item.tag_list.slice(0, 4) : [tag],
      readTime: item.reading_time_minutes || 4,
      reactions: item.positive_reactions_count || 0,
    }));
  } catch (err) {
    console.warn(`Dev.to fetch failed for tag ${tag}:`, err);
    return [];
  }
}

// 2. Fetch from Medium RSS Feed
async function fetchMediumArticles(tag: string, category: string): Promise<UnifiedArticle[]> {
  try {
    const res = await fetch(`https://medium.com/feed/tag/${tag}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];
    const xml = await res.text();

    const items: UnifiedArticle[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 6) {
      const itemContent = match[1];

      // Title
      const titleMatch = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/.exec(itemContent);
      const title = cleanText(titleMatch?.[1] || "");

      // Link
      const linkMatch = /<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/.exec(itemContent);
      const link = (linkMatch?.[1] || "").trim();

      // Creator/Author
      const authorMatch = /<dc:creator>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/dc:creator>/.exec(itemContent);
      const author = cleanText(authorMatch?.[1] || "Medium Author");

      // PubDate
      const dateMatch = /<pubDate>([\s\S]*?)<\/pubDate>/.exec(itemContent);
      const date = dateMatch?.[1] ? new Date(dateMatch[1]).toISOString() : new Date().toISOString();

      // Image Extraction from content:encoded
      const imgMatch = /<img[^>]+src=["']([^"']+)["']/i.exec(itemContent);
      const coverImage = imgMatch?.[1];

      // Excerpt extraction
      const descMatch = /<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/.exec(itemContent);
      const rawDesc = descMatch?.[1] || "";
      const excerpt = cleanText(rawDesc).slice(0, 180) + "...";

      if (title && link) {
        const slug = link.split("/").filter(Boolean).pop()?.split("?")[0] || "";
        const hash = Buffer.from(link).toString("base64url").slice(-10);
        items.push({
          id: `medium-${slug ? slug.slice(0, 24) : "art"}-${hash}`,
          title,
          excerpt: excerpt.length > 3 ? excerpt : "Read full article on Medium.",
          url: link,
          source: "Medium",
          coverImage,
          date,
          author,
          category,
          tags: [tag.replace("-", " ")],
          readTime: 5,
        });
      }
    }

    return items;
  } catch (err) {
    console.warn(`Medium fetch failed for tag ${tag}:`, err);
    return [];
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "All";

    // Check cache
    const cacheKey = category;
    const cached = cache[cacheKey];
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS && cached.data.length > 0) {
      return NextResponse.json({ articles: cached.data, cached: true });
    }

    let allArticles: UnifiedArticle[] = [];

    if (category === "All") {
      // Fetch across 3 key domains for "All"
      const [webDev, aiDev, devops] = await Promise.all([
        fetchDevToArticles("webdev", "Web Development"),
        fetchDevToArticles("machinelearning", "AI / ML"),
        fetchMediumArticles("programming", "Development"),
      ]);
      allArticles = [...webDev, ...aiDev, ...devops];
    } else {
      const mapping = CATEGORY_TAG_MAP[category] || { devto: category.toLowerCase().replace(/[^a-z]/g, ""), medium: category.toLowerCase().replace(/[^a-z]/g, "-") };
      const [devtoArticles, mediumArticles] = await Promise.all([
        fetchDevToArticles(mapping.devto, category),
        fetchMediumArticles(mapping.medium, category),
      ]);

      // Interleave results so users get both Dev.to and Medium
      const maxLen = Math.max(devtoArticles.length, mediumArticles.length);
      for (let i = 0; i < maxLen; i++) {
        if (devtoArticles[i]) allArticles.push(devtoArticles[i]);
        if (mediumArticles[i]) allArticles.push(mediumArticles[i]);
      }
    }

    // Deduplicate articles by URL and ID
    const seen = new Set<string>();
    const deduplicated = allArticles.filter((item) => {
      const key = item.url || item.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Save to cache
    if (deduplicated.length > 0) {
      cache[cacheKey] = {
        timestamp: Date.now(),
        data: deduplicated,
      };
    }

    return NextResponse.json({ articles: deduplicated, cached: false });
  } catch (err: any) {
    console.error("GET /api/blogs error:", err);
    return NextResponse.json({ error: "Failed to fetch articles." }, { status: 500 });
  }
}
