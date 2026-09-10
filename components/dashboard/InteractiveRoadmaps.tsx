"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  GraduationCap,
  Code2,
  Cpu,
  Cloud,
  CheckCircle2,
  Circle,
  ExternalLink,
  Sparkles,
  RotateCcw,
  BookOpen,
  ChevronRight,
  Zap,
  Flame,
} from "lucide-react";

export interface RoadmapTopic {
  id: string;
  title: string;
  desc: string;
  hours: string;
  link: string;
  resourceName: string;
}

export interface RoadmapModule {
  moduleName: string;
  topics: RoadmapTopic[];
}

export interface RoadmapTrack {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  accentHex: string;
  description: string;
  modules: RoadmapModule[];
}

const ROADMAP_TRACKS: RoadmapTrack[] = [
  {
    id: "fullstack",
    name: "Full-Stack Web Dev",
    icon: Code2,
    gradient: "from-blue-500 to-indigo-600",
    accentHex: "#6366f1",
    description:
      "End-to-end full-stack modern engineering from React/Next.js to scalable Node APIs and databases.",
    modules: [
      {
        moduleName: "1. Frontend Foundations",
        topics: [
          {
            id: "fs-semantic-html",
            title: "Semantic HTML5 & Accessibility (a11y)",
            desc: "DOM structure, ARIA roles, semantic landmarks, and screen-reader standards.",
            hours: "6 hrs",
            link: "https://developer.mozilla.org/en-US/docs/Learn/HTML",
            resourceName: "MDN HTML Guide",
          },
          {
            id: "fs-modern-css",
            title: "Modern CSS, Flexbox, Grid & Responsive Design",
            desc: "CSS Grid, Flexbox, media queries, clamp(), container queries, and CSS variables.",
            hours: "10 hrs",
            link: "https://web.dev/learn/css/",
            resourceName: "web.dev CSS",
          },
          {
            id: "fs-js-deep-dive",
            title: "JavaScript Deep Dive (ES6+, Async/Await & Event Loop)",
            desc: "Closures, prototypes, Promises, Event Loop, Microtasks, and DOM manipulation.",
            hours: "18 hrs",
            link: "https://javascript.info/",
            resourceName: "javascript.info",
          },
        ],
      },
      {
        moduleName: "2. React & Next.js Architecture",
        topics: [
          {
            id: "fs-react-core",
            title: "React 19 Hooks, State & Component Lifecycle",
            desc: "useState, useEffect, useMemo, useCallback, custom hooks, and reconciliation.",
            hours: "16 hrs",
            link: "https://react.dev/learn",
            resourceName: "Official React Docs",
          },
          {
            id: "fs-nextjs-app-router",
            title: "Next.js App Router, RSC & Server Actions",
            desc: "Server components, streaming SSR, layouts, dynamic routes, and server mutations.",
            hours: "14 hrs",
            link: "https://nextjs.org/docs",
            resourceName: "Next.js Documentation",
          },
          {
            id: "fs-tailwind-styling",
            title: "Tailwind CSS & Component Systems (Shadcn/Radix)",
            desc: "Utility-first design tokens, theme variables, and accessible headless UI primitives.",
            hours: "8 hrs",
            link: "https://tailwindcss.com/docs",
            resourceName: "Tailwind CSS Docs",
          },
        ],
      },
      {
        moduleName: "3. Backend, Database & Production",
        topics: [
          {
            id: "fs-node-express",
            title: "Node.js & Express RESTful API Engineering",
            desc: "Routing, middleware architecture, error handling, rate limiting, and CORS.",
            hours: "14 hrs",
            link: "https://expressjs.com/",
            resourceName: "Express.js Guide",
          },
          {
            id: "fs-databases",
            title: "SQL vs NoSQL (PostgreSQL, Prisma ORM & MongoDB)",
            desc: "Database modeling, schema migrations, indexing strategies, and ACID transactions.",
            hours: "16 hrs",
            link: "https://www.prisma.io/docs",
            resourceName: "Prisma & PostgreSQL",
          },
          {
            id: "fs-auth-deployment",
            title: "Authentication (JWT/Clerk/Auth.js) & Cloud Deployment",
            desc: "Session security, OAuth2, Vercel/Docker container deployment, and monitoring.",
            hours: "12 hrs",
            link: "https://roadmap.sh/full-stack",
            resourceName: "Roadmap.sh Fullstack",
          },
        ],
      },
    ],
  },
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    icon: GraduationCap,
    gradient: "from-amber-500 to-orange-600",
    accentHex: "#f59e0b",
    description:
      "Core computer science algorithms, complexity analysis, and competitive programming patterns.",
    modules: [
      {
        moduleName: "1. Linear Structures & Fundamentals",
        topics: [
          {
            id: "dsa-time-complexity",
            title: "Asymptotic Analysis (Big-O, Omega & Theta)",
            desc: "Time and space complexity analysis, recurrence relations, and optimization.",
            hours: "4 hrs",
            link: "https://www.bigocheatsheet.com/",
            resourceName: "Big-O Cheat Sheet",
          },
          {
            id: "dsa-arrays-strings",
            title: "Arrays, Strings & Two-Pointer Patterns",
            desc: "Prefix sums, sliding window technique, two pointers, and Kadane's algorithm.",
            hours: "12 hrs",
            link: "https://leetcode.com/explore/interview/card/leetcodes-interview-crash-course-for-algorithms-and-data-structures/",
            resourceName: "LeetCode Crash Course",
          },
          {
            id: "dsa-linked-lists",
            title: "Singly, Doubly & Circular Linked Lists",
            desc: "Pointer manipulation, Floyd's cycle detection, fast & slow pointers, and reversals.",
            hours: "8 hrs",
            link: "https://visualgo.net/en/list",
            resourceName: "VisuAlgo Linked Lists",
          },
          {
            id: "dsa-stacks-queues",
            title: "Stacks, Monotonic Stacks & Deques",
            desc: "LIFO/FIFO, monotonic stack for next greater element, and min/max priority queues.",
            hours: "8 hrs",
            link: "https://neetcode.io/roadmap",
            resourceName: "NeetCode Roadmap",
          },
        ],
      },
      {
        moduleName: "2. Non-Linear & Graph Theory",
        topics: [
          {
            id: "dsa-trees-bst",
            title: "Binary Trees, BSTs & Traversals",
            desc: "Preorder, Inorder, Postorder, Level-Order (BFS), Lowest Common Ancestor (LCA).",
            hours: "14 hrs",
            link: "https://leetcode.com/tag/tree/",
            resourceName: "LeetCode Trees",
          },
          {
            id: "dsa-graphs",
            title: "Graph Algorithms (BFS, DFS, Dijkstra & Topological Sort)",
            desc: "Adjacency lists/matrices, cycle detection, shortest paths, and Kahn's algorithm.",
            hours: "18 hrs",
            link: "https://visualgo.net/en/graphds",
            resourceName: "VisuAlgo Graph Theory",
          },
        ],
      },
      {
        moduleName: "3. Advanced Problem Solving",
        topics: [
          {
            id: "dsa-recursion-backtracking",
            title: "Recursion & Backtracking (Subsets, Permutations)",
            desc: "State-space tree exploration, pruning conditions, N-Queens, and Sudoku Solver.",
            hours: "12 hrs",
            link: "https://neetcode.io/practice",
            resourceName: "NeetCode Practice",
          },
          {
            id: "dsa-dynamic-programming",
            title: "Dynamic Programming (1D, 2D & Knapsack Patterns)",
            desc: "Memoization (top-down) vs Tabulation (bottom-up), LCS, LIS, and unbounded knapsack.",
            hours: "20 hrs",
            link: "https://leetcode.com/discuss/general-discussion/458695/dynamic-programming-patterns",
            resourceName: "DP Patterns Compendium",
          },
        ],
      },
    ],
  },
  {
    id: "aiml",
    name: "AI & Machine Learning",
    icon: Cpu,
    gradient: "from-emerald-500 to-teal-600",
    accentHex: "#10b981",
    description:
      "Mathematical foundations, statistical models, modern deep learning, and Generative AI.",
    modules: [
      {
        moduleName: "1. Mathematical & Scientific Computing",
        topics: [
          {
            id: "ai-math-stats",
            title: "Linear Algebra, Multivariate Calculus & Probability",
            desc: "Eigenvectors, matrix decompositions, gradients, chain rule, and Bayes' theorem.",
            hours: "14 hrs",
            link: "https://www.3blue1brown.com/topics/linear-algebra",
            resourceName: "3Blue1Brown Linear Algebra",
          },
          {
            id: "ai-numpy-pandas",
            title: "Data Manipulation with NumPy & Pandas",
            desc: "Vectorized arrays, broadcasting, DataFrame wrangling, filtering, and aggregations.",
            hours: "10 hrs",
            link: "https://pandas.pydata.org/docs/",
            resourceName: "Official Pandas Docs",
          },
          {
            id: "ai-eda-visualization",
            title: "Exploratory Data Analysis (Matplotlib & Seaborn)",
            desc: "Data cleaning, feature distributions, outlier detection, and correlation matrices.",
            hours: "8 hrs",
            link: "https://seaborn.pydata.org/",
            resourceName: "Seaborn Visuals",
          },
        ],
      },
      {
        moduleName: "2. Classical Machine Learning",
        topics: [
          {
            id: "ai-supervised-ml",
            title: "Supervised Learning (Regression, SVM, Random Forests)",
            desc: "Cost functions, gradient descent, bias-variance tradeoff, and cross-validation.",
            hours: "16 hrs",
            link: "https://scikit-learn.org/stable/",
            resourceName: "Scikit-Learn Guide",
          },
          {
            id: "ai-unsupervised-ml",
            title: "Unsupervised Learning (K-Means Clustering & PCA)",
            desc: "Dimensionality reduction, latent feature projection, and silhouette scoring.",
            hours: "10 hrs",
            link: "https://www.coursera.org/learn/machine-learning",
            resourceName: "Andrew Ng ML",
          },
        ],
      },
      {
        moduleName: "3. Deep Learning & Generative AI",
        topics: [
          {
            id: "ai-neural-networks",
            title: "Neural Networks & Backpropagation with PyTorch",
            desc: "Tensors, autograd, activation functions (ReLU/GELU), optimizers (AdamW), and loss.",
            hours: "18 hrs",
            link: "https://pytorch.org/tutorials/",
            resourceName: "PyTorch Tutorials",
          },
          {
            id: "ai-transformers-llms",
            title: "Transformers, Attention Mechanisms & LLM APIs",
            desc: "Self-attention, encoder-decoder models, prompt engineering, RAG, and fine-tuning.",
            hours: "16 hrs",
            link: "https://huggingface.co/learn/nlp-course/",
            resourceName: "Hugging Face Course",
          },
        ],
      },
    ],
  },
  {
    id: "devops",
    name: "DevOps & Cloud Engineering",
    icon: Cloud,
    gradient: "from-violet-500 to-purple-600",
    accentHex: "#8b5cf6",
    description:
      "Linux server management, CI/CD automation, Docker containers, and scalable cloud architectures.",
    modules: [
      {
        moduleName: "1. Systems & Version Control",
        topics: [
          {
            id: "devops-linux-bash",
            title: "Linux CLI Mastery, Permissions & Shell Scripting",
            desc: "Bash automation, file permissions, SSH keys, cron jobs, and systemd services.",
            hours: "10 hrs",
            link: "https://linuxjourney.com/",
            resourceName: "Linux Journey",
          },
          {
            id: "devops-git-workflows",
            title: "Advanced Git, Trunk-Based Development & Submodules",
            desc: "Interactive rebasing, conflict resolution, semantic versioning, and branch hygiene.",
            hours: "6 hrs",
            link: "https://git-scm.com/book/en/v2",
            resourceName: "Pro Git Book",
          },
        ],
      },
      {
        moduleName: "2. Containers & Orchestration",
        topics: [
          {
            id: "devops-docker",
            title: "Docker Containerization & Multi-Stage Builds",
            desc: "Writing efficient Dockerfiles, compose stacks, volume mounting, and network layers.",
            hours: "12 hrs",
            link: "https://docs.docker.com/get-started/",
            resourceName: "Docker Documentation",
          },
          {
            id: "devops-kubernetes",
            title: "Kubernetes Basics (Pods, Deployments & Services)",
            desc: "Cluster primitives, ConfigMaps, Secrets, Ingress controllers, and auto-scaling.",
            hours: "16 hrs",
            link: "https://kubernetes.io/docs/tutorials/",
            resourceName: "Kubernetes Tutorials",
          },
        ],
      },
      {
        moduleName: "3. CI/CD & Infrastructure as Code",
        topics: [
          {
            id: "devops-cicd-github-actions",
            title: "CI/CD Pipelines with GitHub Actions",
            desc: "Automated test suites, security scanning, artifact building, and auto-deployments.",
            hours: "10 hrs",
            link: "https://docs.github.com/en/actions",
            resourceName: "GitHub Actions Docs",
          },
          {
            id: "devops-cloud-iac",
            title: "Cloud Architecture (AWS/GCP) & Terraform IaC",
            desc: "VPCs, S3/Storage, IAM least-privilege security, and declarative infrastructure.",
            hours: "16 hrs",
            link: "https://developer.hashicorp.com/terraform/tutorials",
            resourceName: "HashiCorp Terraform",
          },
        ],
      },
    ],
  },
];

export function InteractiveRoadmaps() {
  const [selectedTrackId, setSelectedTrackId] = useState<string>("fullstack");
  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load completed topics from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cj_roadmap_completed_topics");
      if (saved) {
        setCompletedTopicIds(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  const activeTrack =
    ROADMAP_TRACKS.find((t) => t.id === selectedTrackId) || ROADMAP_TRACKS[0];

  // Calculate track totals
  const allTrackTopics = activeTrack.modules.flatMap((m) => m.topics);
  const totalTopics = allTrackTopics.length;
  const completedInTrack = allTrackTopics.filter((t) =>
    completedTopicIds.includes(t.id)
  ).length;
  const percentComplete =
    totalTopics > 0 ? Math.round((completedInTrack / totalTopics) * 100) : 0;

  const toggleTopic = (id: string) => {
    setCompletedTopicIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      try {
        localStorage.setItem("cj_roadmap_completed_topics", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleResetTrack = () => {
    const trackTopicIds = allTrackTopics.map((t) => t.id);
    setCompletedTopicIds((prev) => {
      const next = prev.filter((id) => !trackTopicIds.includes(id));
      try {
        localStorage.setItem("cj_roadmap_completed_topics", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const getRankBadge = (pct: number) => {
    if (pct === 100) return { label: "Track Master", color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30" };
    if (pct >= 60) return { label: "Advanced", color: "text-indigo-400 bg-indigo-500/15 border-indigo-500/30" };
    if (pct >= 25) return { label: "In Progress", color: "text-amber-400 bg-amber-500/15 border-amber-500/30" };
    return { label: "Getting Started", color: "text-muted-foreground bg-black/[0.04] dark:bg-white/[0.05] border-black/[0.08] dark:border-white/[0.08]" };
  };

  const rank = getRankBadge(percentComplete);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Track Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {ROADMAP_TRACKS.map((track) => {
          const Icon = track.icon;
          const isSelected = selectedTrackId === track.id;
          const trackTopics = track.modules.flatMap((m) => m.topics);
          const done = trackTopics.filter((t) =>
            completedTopicIds.includes(t.id)
          ).length;
          const pct = Math.round((done / trackTopics.length) * 100);

          return (
            <button
              key={track.id}
              onClick={() => setSelectedTrackId(track.id)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer flex-shrink-0 ${
                isSelected
                  ? "bg-white dark:bg-[#181926] text-foreground dark:text-white border-indigo-500/40 shadow-sm"
                  : "bg-black/[0.02] dark:bg-white/[0.03] text-muted-foreground hover:text-foreground border-black/[0.06] dark:border-white/[0.06]"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-white bg-gradient-to-br ${track.gradient}`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span>{track.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-muted-foreground">
                {pct}%
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Active Track Hero & Progress Bar ── */}
      <div className="relative rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14] p-5 sm:p-6 overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${rank.color}`}>
                {rank.label}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {completedInTrack} of {totalTopics} completed
              </span>
            </div>
            <h3 className="text-lg font-bold text-foreground dark:text-white">
              {activeTrack.name} Interactive Roadmap
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">
              {activeTrack.description} Check off milestones as you learn to track your progress.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {completedInTrack > 0 && (
              <button
                onClick={handleResetTrack}
                title="Reset progress for this track"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors border border-black/[0.06] dark:border-white/[0.06] cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
            <div className="text-right">
              <div className="text-2xl font-black font-mono text-foreground dark:text-white">
                {percentComplete}%
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-black/[0.06] dark:bg-white/[0.06] rounded-full h-2.5 mt-4 overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${activeTrack.gradient}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentComplete}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* ── Modules & Topic Checklists ── */}
      <div className="space-y-6">
        {activeTrack.modules.map((module, mIdx) => {
          const modTopics = module.topics;
          const modCompleted = modTopics.filter((t) =>
            completedTopicIds.includes(t.id)
          ).length;

          return (
            <div
              key={module.moduleName}
              className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14] overflow-hidden shadow-sm"
            >
              {/* Module Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-black/[0.06] dark:border-white/[0.06] bg-black/[0.01] dark:bg-white/[0.01]">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-500 font-mono font-bold text-xs flex items-center justify-center">
                    {mIdx + 1}
                  </span>
                  <h4 className="font-bold text-foreground dark:text-white text-sm">
                    {module.moduleName}
                  </h4>
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  {modCompleted}/{modTopics.length} done
                </span>
              </div>

              {/* Topics List */}
              <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                {modTopics.map((topic) => {
                  const isChecked = completedTopicIds.includes(topic.id);

                  return (
                    <div
                      key={topic.id}
                      className={`group flex items-start sm:items-center justify-between gap-3.5 p-4 transition-colors ${
                        isChecked
                          ? "bg-emerald-500/[0.02] dark:bg-emerald-500/[0.03]"
                          : "hover:bg-black/[0.01] dark:hover:bg-white/[0.01]"
                      }`}
                    >
                      {/* Checkbox & Topic Info */}
                      <button
                        onClick={() => toggleTopic(topic.id)}
                        className="flex items-start gap-3 flex-1 text-left cursor-pointer"
                      >
                        <div className="mt-0.5 sm:mt-0 flex-shrink-0">
                          {isChecked ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20 transition-transform group-hover:scale-110" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground/40 group-hover:text-indigo-400 transition-colors" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`text-xs sm:text-sm font-semibold transition-colors ${
                                isChecked
                                  ? "line-through text-muted-foreground/70"
                                  : "text-foreground dark:text-white"
                              }`}
                            >
                              {topic.title}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/[0.04] dark:bg-white/[0.05] text-muted-foreground">
                              {topic.hours}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                            {topic.desc}
                          </p>
                        </div>
                      </button>

                      {/* Resource External Link */}
                      <a
                        href={topic.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Open ${topic.resourceName}`}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 px-2.5 py-1 rounded-lg hover:bg-indigo-500/10 transition-colors flex-shrink-0"
                      >
                        <span className="hidden sm:inline">{topic.resourceName}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
