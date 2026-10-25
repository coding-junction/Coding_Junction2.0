"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { sanity } from "@/lib/sanity";
import { motion, AnimatePresence } from "motion/react";
import {
  CalendarDays, Clock, ExternalLink, Search, BookOpen,
  Tag, User, Sparkles, Heart, Globe, RefreshCw
} from "lucide-react";

interface Article {
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

const categories = [
  "All",
  "Web Development",
  "App Development",
  "AI / ML",
  "DSA",
  "DevOps",
  "Open Source",
  "Career",
];

const BlogClient = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const loadArticles = async (category: string) => {
    try {
      setLoading(true);

      // 1. Fetch live articles from Dev.to & Medium via our API route
      const apiPromise = fetch(`/api/blogs?category=${encodeURIComponent(category)}`)
        .then((r) => r.json())
        .then((d) => d.articles || [])
        .catch(() => []);

      // 2. Fetch local club articles from Sanity (if any exist)
      const sanityPromise = sanity
        .fetch(
          `*[_type in ["blogPost", "post", "article"]] | order(date desc) {
            _id, title, "slug": slug.current, excerpt, description, date, author, category, tags, readTime,
            "coverImage": coalesce(image.asset->url, images[0].asset->url)
          }`
        )
        .then((posts: any[]) =>
          (posts || []).map((p: any) => ({
            id: `sanity-${p._id}`,
            title: p.title,
            excerpt: p.excerpt || p.description || "",
            url: p.slug ? `/Blog/${p.slug}` : "#",
            source: "Official CJ" as const,
            coverImage: p.coverImage,
            date: p.date || new Date().toISOString(),
            author: p.author || "Coding Junction",
            category: p.category || "General",
            tags: p.tags || ["Coding Junction"],
            readTime: p.readTime || 4,
          }))
        )
        .catch(() => []);

      const [externalArticles, sanityArticles] = await Promise.all([apiPromise, sanityPromise]);

      // Sanity official posts get placed on top, followed by aggregated articles
      const combined = [...sanityArticles, ...externalArticles];
      setArticles(combined);
    } catch (err) {
      console.error("Error loading blog articles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles(activeCategory);
  }, [activeCategory]);

  const filteredArticles = articles.filter((article) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      article.title.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query) ||
      article.author.toLowerCase().includes(query) ||
      article.tags?.some((t) => t.toLowerCase().includes(query))
    );
  });

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full px-4 md:px-8 lg:px-16 xl:px-20 pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-indigo-500/8 dark:from-indigo-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center relative z-10 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-5">
            <BookOpen className="w-3.5 h-3.5" />
            Developer Articles & Insights
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground dark:text-white tracking-tight mb-4">
            Tech{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400">
              Newsstand
            </span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto mb-8">
            Curated articles, tutorials, and engineering deep-dives from <strong>Dev.to</strong>, <strong>Medium</strong>, and the <strong>Coding Junction community</strong>.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, keyword, or author..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-[#0c0d14] border border-black/[0.08] dark:border-white/[0.08] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 transition-all shadow-sm"
            />
          </div>
        </motion.div>
      </section>

      {/* Category Filters */}
      <section className="px-4 md:px-8 lg:px-16 xl:px-20 pb-8">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide max-w-4xl mx-auto justify-center flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                  : "bg-black/[0.04] dark:bg-white/[0.04] text-muted-foreground hover:text-foreground hover:bg-black/[0.08] dark:hover:bg-white/[0.08]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="px-4 md:px-8 lg:px-16 xl:px-20 pb-24">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-24">
              <div className="w-10 h-10 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              <p className="text-xs text-muted-foreground">
                Fetching latest articles for {activeCategory}...
              </p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 dark:from-indigo-500/20 dark:to-violet-500/20 flex items-center justify-center mx-auto mb-5">
                <Sparkles className="h-7 w-7 text-indigo-400" />
              </div>
              <p className="text-foreground dark:text-white font-semibold text-lg mb-2">
                No matching articles found
              </p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                Try adjusting your search query or selecting a different category.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-xs font-semibold hover:bg-indigo-600 transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredArticles.map((article, index) => (
                  <motion.article
                    key={`${article.id}-${index}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.04,
                    }}
                  >
                    <a
                      href={article.url}
                      target={article.source === "Official CJ" ? "_self" : "_blank"}
                      rel="noopener noreferrer"
                      className="block glass-card group h-full cursor-pointer"
                    >
                      <div className="glass-card-inner p-0 h-full flex flex-col justify-between">
                        <div>
                          {/* Image */}
                          <div className="relative w-full h-48 overflow-hidden rounded-t-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-violet-500/10">
                            {article.coverImage ? (
                              <Image
                                src={article.coverImage}
                                alt={article.title}
                                fill
                                unoptimized
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <BookOpen className="w-10 h-10 text-indigo-400/40" />
                              </div>
                            )}

                            {/* Source Pill Badge */}
                            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-md shadow-sm ${
                                  article.source === "Dev.to"
                                    ? "bg-black/80 text-white border border-white/20"
                                    : article.source === "Medium"
                                    ? "bg-emerald-600/90 text-white"
                                    : "bg-indigo-600 text-white"
                                }`}
                              >
                                {article.source}
                              </span>
                            </div>

                            {/* Read Time / Category */}
                            <div className="absolute top-3 right-3 z-10">
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white/90">
                                {article.readTime || 4} min read
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5">
                            {/* Category & Tags */}
                            <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                                <Tag className="w-2.5 h-2.5" />
                                {article.category}
                              </span>
                              {article.tags?.slice(0, 2).map((t, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.04] text-muted-foreground"
                                >
                                  #{t}
                                </span>
                              ))}
                            </div>

                            {/* Title */}
                            <h2 className="text-base font-bold text-foreground dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-500 transition-colors">
                              {article.title}
                            </h2>

                            {/* Excerpt */}
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                              {article.excerpt}
                            </p>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="px-5 pb-5 pt-3 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            {article.authorAvatar ? (
                              <Image
                                src={article.authorAvatar}
                                alt={article.author}
                                width={20}
                                height={20}
                                unoptimized
                                className="rounded-full bg-black/10 flex-shrink-0"
                              />
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-[9px] text-white font-bold flex-shrink-0">
                                {article.author[0] || "U"}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-[11px] font-medium text-foreground dark:text-white truncate">
                                {article.author}
                              </p>
                              <p className="text-[9px] text-muted-foreground truncate">
                                {new Date(article.date).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0 text-muted-foreground group-hover:text-indigo-500 transition-colors">
                            {article.reactions !== undefined && article.reactions > 0 && (
                              <span className="text-[10px] flex items-center gap-0.5 text-rose-500 font-mono">
                                <Heart className="w-3 h-3 fill-current" />
                                {article.reactions}
                              </span>
                            )}
                            <ExternalLink className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    </a>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogClient;
