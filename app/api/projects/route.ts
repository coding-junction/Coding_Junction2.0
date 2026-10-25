import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabaseServer";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const DATA_FILE = path.join(process.cwd(), "data", "projects.json");

function readLocalProjects(): any[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading local projects file:", err);
  }
  return [];
}

function writeLocalProjects(projects: any[]) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing local projects file:", err);
  }
}

// GET /api/projects - Fetch community projects
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // 1. Try fetching from Supabase
    try {
      const supabase: any = getSupabaseAdmin();
      if (supabase) {
        let query = supabase.from("community_projects").select("*").order("created_at", { ascending: false });
        if (userId) {
          query = query.eq("user_id", userId);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          // Normalize Supabase format to frontend format
          const formatted = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            techStack: Array.isArray(item.tech_stack) ? item.tech_stack : (item.tech_stack || "").split(",").map((s: string) => s.trim()).filter(Boolean),
            category: item.category,
            github: item.github_url || item.github,
            liveUrl: item.live_url || item.liveUrl,
            image: item.image_url || item.image,
            author: item.author_name || item.author,
            authorCollege: item.author_college,
            authorAvatar: item.author_avatar,
            userId: item.user_id,
            stars: item.stars || 0,
            featured: item.featured || false,
            createdAt: item.created_at,
          }));
          return NextResponse.json({ projects: formatted, source: "supabase" });
        }
      }
    } catch (sbError) {
      // Supabase table may not exist yet, fallback to local store
      console.warn("Supabase projects fetch failed, using local store:", sbError);
    }

    // 2. Fallback to local JSON storage
    let local = readLocalProjects();
    if (userId) {
      local = local.filter((p: any) => p.userId === userId);
    }
    return NextResponse.json({ projects: local, source: "local" });
  } catch (err: any) {
    console.error("GET /api/projects error:", err);
    return NextResponse.json({ error: "Failed to load projects." }, { status: 500 });
  }
}

// POST /api/projects - Submit or showcase a new project (Authenticated)
export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Please sign in." }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, techStack, category, github, liveUrl, image, authorCollege } = body;

    if (!title || !description || !category) {
      return NextResponse.json({ error: "Title, description, and category are required." }, { status: 400 });
    }

    const authorName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || "Community Member";
    const authorEmail = user.emailAddresses?.[0]?.emailAddress || "";
    const authorAvatar = user.imageUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(authorName)}`;

    const newProject = {
      id: `proj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: title.trim(),
      description: description.trim(),
      techStack: Array.isArray(techStack) ? techStack : (techStack || "").split(",").map((s: string) => s.trim()).filter(Boolean),
      category: category.trim(),
      github: (github || "").trim(),
      liveUrl: (liveUrl || "").trim(),
      image: (image || "").trim() || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
      author: authorName,
      authorEmail,
      authorCollege: authorCollege || "UIT Burdwan",
      authorAvatar,
      userId: user.id,
      stars: 1,
      featured: false,
      createdAt: new Date().toISOString(),
    };

    // 1. Try saving to Supabase
    try {
      const supabase: any = getSupabaseAdmin();
      if (supabase) {
        await supabase.from("community_projects").insert({
          id: newProject.id,
          title: newProject.title,
          description: newProject.description,
          tech_stack: newProject.techStack,
          category: newProject.category,
          github_url: newProject.github,
          live_url: newProject.liveUrl,
          image_url: newProject.image,
          author_name: newProject.author,
          author_email: newProject.authorEmail,
          author_college: newProject.authorCollege,
          author_avatar: newProject.authorAvatar,
          user_id: newProject.userId,
          stars: 1,
          featured: false,
          created_at: newProject.createdAt,
        });
      }
    } catch (sbError) {
      console.warn("Supabase project insert failed, saved to local store:", sbError);
    }

    // 2. Save to local JSON storage (persistent backup)
    const existing = readLocalProjects();
    existing.unshift(newProject);
    writeLocalProjects(existing);

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/projects error:", err);
    return NextResponse.json({ error: "Failed to create project." }, { status: 500 });
  }
}

// DELETE /api/projects - Delete project submitted by user
export async function DELETE(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("id");

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required." }, { status: 400 });
    }

    // Try deleting from Supabase
    try {
      const supabase: any = getSupabaseAdmin();
      if (supabase) {
        await supabase.from("community_projects").delete().eq("id", projectId).eq("user_id", user.id);
      }
    } catch (sbError) {
      console.warn("Supabase delete failed:", sbError);
    }

    // Delete from local JSON store
    const local = readLocalProjects();
    const updated = local.filter((p: any) => !(p.id === projectId && (p.userId === user.id || !p.userId)));
    writeLocalProjects(updated);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/projects error:", err);
    return NextResponse.json({ error: "Failed to delete project." }, { status: 500 });
  }
}
