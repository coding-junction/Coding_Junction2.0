import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

interface InstitutionResult {
  id: string;
  name: string;
  university: string;
  state: string;
  district: string;
  programmes_count?: number;
  matchScore?: number;
}

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam",
  "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Orissa", "Puducherry", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal"
];

// District / City state mapping helper
const CITY_TO_STATE: Record<string, string> = {
  burdwan: "West Bengal",
  bardhaman: "West Bengal",
  kolkata: "West Bengal",
  calcutta: "West Bengal",
  durgapur: "West Bengal",
  asansol: "West Bengal",
  siliguri: "West Bengal",
  howrah: "West Bengal",
  hooghly: "West Bengal",
  kalyani: "West Bengal",
  mumbai: "Maharashtra",
  pune: "Maharashtra",
  delhi: "Delhi",
  bengaluru: "Karnataka",
  bangalore: "Karnataka",
  chennai: "Tamil Nadu",
  hyderabad: "Telangana",
  patna: "Bihar",
  ranchi: "Jharkhand",
  bhubaneswar: "Odisha",
  guwahati: "Assam",
  jaipur: "Rajasthan",
  lucknow: "Uttar Pradesh",
  kanpur: "Uttar Pradesh",
  noida: "Uttar Pradesh",
  ahmedabad: "Gujarat",
  chandigarh: "Chandigarh",
};

// Fallback verified institutions if third-party network is slow or unreachable
const FALLBACK_INSTITUTIONS: InstitutionResult[] = [
  {
    id: "1-44643216545",
    name: "UNIVERSITY INSTITUTE OF TECHNOLOGY",
    university: "The University of Burdwan",
    state: "West Bengal",
    district: "BARDHAMAN",
    programmes_count: 8,
  },
  {
    id: "1-44640225802",
    name: "DEPARTMENT OF PHYSICS, THE UNIVERSITY OF BURDWAN",
    university: "The University of Burdwan",
    state: "West Bengal",
    district: "BARDHAMAN",
    programmes_count: 1,
  },
  {
    id: "1-44642059355",
    name: "BENGAL COLLEGE OF ENGINEERING & TECHNOLOGY",
    university: "Maulana Abul Kalam Azad University of Technology, West Bengal",
    state: "West Bengal",
    district: "BARDHAMAN",
    programmes_count: 13,
  },
  {
    id: "1-44640147862",
    name: "DURGAPUR INSTITUTE OF ADVANCED TECHNOLOGY & MANAGEMENT",
    university: "Maulana Abul Kalam Azad University of Technology, West Bengal",
    state: "West Bengal",
    district: "BARDHAMAN",
    programmes_count: 5,
  },
  {
    id: "1-44644034475",
    name: "ST. XAVIER'S COLLEGE BURDWAN",
    university: "University of Burdwan, Bardhaman",
    state: "West Bengal",
    district: "BARDHAMAN",
    programmes_count: 2,
  },
  {
    id: "1-44644816172",
    name: "BURDWAN INSTITUTE OF MANAGEMENT AND COMPUTER SCIENCE",
    university: "University of Burdwan, Bardhaman",
    state: "West Bengal",
    district: "BARDHAMAN",
    programmes_count: 2,
  },
  {
    id: "1-44640024383",
    name: "JADAVPUR UNIVERSITY FACULTY OF ENGINEERING & TECHNOLOGY",
    university: "Jadavpur University",
    state: "West Bengal",
    district: "KOLKATA",
    programmes_count: 16,
  },
  {
    id: "1-44640024384",
    name: "INDIAN INSTITUTE OF ENGINEERING SCIENCE AND TECHNOLOGY, SHIBPUR",
    university: "IIEST Shibpur",
    state: "West Bengal",
    district: "HOWRAH",
    programmes_count: 15,
  },
  {
    id: "1-44640024385",
    name: "INSTITUTE OF ENGINEERING & MANAGEMENT (IEM)",
    university: "Maulana Abul Kalam Azad University of Technology, West Bengal",
    state: "West Bengal",
    district: "KOLKATA",
    programmes_count: 10,
  },
  {
    id: "1-44640024386",
    name: "HERITAGE INSTITUTE OF TECHNOLOGY",
    university: "Maulana Abul Kalam Azad University of Technology, West Bengal",
    state: "West Bengal",
    district: "KOLKATA",
    programmes_count: 11,
  }
];

function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().replace(/[^a-z0-9 ]/g, " ");
  const s2 = str2.toLowerCase().replace(/[^a-z0-9 ]/g, " ");

  if (s1.includes(s2) || s2.includes(s1)) return 0.95;

  const words1 = new Set(s1.split(/\s+/).filter(w => w.length > 2));
  const words2 = new Set(s2.split(/\s+/).filter(w => w.length > 2));

  if (words1.size === 0 || words2.size === 0) return 0;

  let intersection = 0;
  for (const w of words1) {
    if (words2.has(w)) intersection++;
  }

  const union = new Set([...words1, ...words2]).size;
  return union > 0 ? intersection / union : 0;
}

function matchUserName(rawText: string, targetUserName?: string): {
  matched: boolean;
  matchedName: string | null;
  confidence: number;
  message: string;
} {
  if (!targetUserName || targetUserName.trim().length < 2) {
    return {
      matched: true,
      matchedName: null,
      confidence: 1.0,
      message: "No user account name provided to compare",
    };
  }

  const cleanTarget = targetUserName.trim().toLowerCase().replace(/[^a-z0-9 ]/g, " ");
  const targetTokens = cleanTarget.split(/\s+/).filter(t => t.length >= 2);
  const normalizedText = rawText.toLowerCase().replace(/[^a-z0-9 \n:]/g, " ");

  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  let bestMatchLine = "";
  let highestScore = 0;

  // 1. Check lines containing explicit labels: "name", "student name", "candidate"
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    if (
      lowerLine.includes("name") ||
      lowerLine.includes("student") ||
      lowerLine.includes("candidate")
    ) {
      const cleanLine = lowerLine
        .replace(/^(student\s+)?name\s*[:\-\.]?\s*/i, "")
        .replace(/[^a-z0-9 ]/g, " ")
        .trim();

      const score = calculateSimilarity(cleanLine, cleanTarget);
      if (score > highestScore) {
        highestScore = score;
        bestMatchLine = cleanLine;
      }
    }
  }

  // 2. Also search all lines for direct token or full substring match
  for (const line of lines) {
    const cleanLine = line.toLowerCase().replace(/[^a-z0-9 ]/g, " ").trim();
    if (cleanLine.length < 2) continue;

    // Direct substring match
    if (cleanLine.includes(cleanTarget) || cleanTarget.includes(cleanLine)) {
      if (0.9 > highestScore) {
        highestScore = 0.95;
        bestMatchLine = line;
      }
    }

    // Check token presence (e.g. first name + last name)
    const lineTokens = new Set(cleanLine.split(/\s+/));
    let matchingTokens = 0;
    for (const token of targetTokens) {
      if (lineTokens.has(token)) {
        matchingTokens++;
      }
    }

    if (targetTokens.length > 0) {
      const tokenScore = matchingTokens / targetTokens.length;
      if (tokenScore > highestScore) {
        highestScore = tokenScore;
        bestMatchLine = line;
      }
    }
  }

  // Fallback: check if target's first name or whole name is present anywhere in normalizedText
  if (highestScore < 0.5) {
    for (const token of targetTokens) {
      if (token.length >= 3 && normalizedText.includes(token)) {
        highestScore = Math.max(highestScore, 0.7);
        if (!bestMatchLine) bestMatchLine = token;
      }
    }
  }

  const matched = highestScore >= 0.5;

  return {
    matched,
    matchedName: bestMatchLine || null,
    confidence: Number(highestScore.toFixed(2)),
    message: matched
      ? `Name verified: Card text matches "${targetUserName}"`
      : `Name mismatch: Card text does not clearly show "${targetUserName}". Please ensure you upload your own ID card.`,
  };
}

async function searchExternalApi(state: string, query: string): Promise<InstitutionResult[]> {
  try {
    const trimmed = query.trim();
    if (trimmed.length < 3) return [];

    const url = `https://indian-colleges-list.vercel.app/api/institutions/search?state=${encodeURIComponent(state)}&q=${encodeURIComponent(trimmed)}&limit=25`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });
    clearTimeout(timeout);

    if (!res.ok) return [];

    const json = await res.json();
    return Array.isArray(json.results) ? json.results : [];
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const stateParam = searchParams.get("state") || "";

  if (!q.trim() || q.trim().length < 2) {
    return NextResponse.json({ results: [], total: 0 });
  }

  const statesToSearch = stateParam
    ? [stateParam]
    : ["West Bengal", "Delhi", "Maharashtra", "Tamil Nadu", "Karnataka"];

  let results: InstitutionResult[] = [];

  for (const state of statesToSearch) {
    const apiResults = await searchExternalApi(state, q);
    if (apiResults.length > 0) {
      results = [...results, ...apiResults];
      if (results.length >= 20) break;
    }
  }

  // If no external results or network failed, search fallback
  if (results.length === 0) {
    const queryLower = q.toLowerCase();
    results = FALLBACK_INSTITUTIONS.filter(inst =>
      inst.name.toLowerCase().includes(queryLower) ||
      inst.university.toLowerCase().includes(queryLower) ||
      inst.district.toLowerCase().includes(queryLower)
    );
  }

  return NextResponse.json({ results, total: results.length });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rawText = "", state: manualState, query: manualQuery, userName = "" } = body;

    const normalizedText = String(rawText).toLowerCase();

    // 1. Perform student name verification against account name
    const nameMatch = matchUserName(rawText, userName);

    // 2. Detect state from text if not manually provided
    let detectedState = manualState || "";
    if (!detectedState) {
      for (const state of INDIAN_STATES) {
        if (normalizedText.includes(state.toLowerCase())) {
          detectedState = state;
          break;
        }
      }
    }

    // 3. Check city to state if state still not found
    if (!detectedState) {
      for (const [city, state] of Object.entries(CITY_TO_STATE)) {
        if (normalizedText.includes(city)) {
          detectedState = state;
          break;
        }
      }
    }

    // Default to West Bengal if Coding Junction context or undefined
    if (!detectedState) {
      detectedState = "West Bengal";
    }

    // 4. Extract candidate queries from OCR text
    const lines: string[] = String(rawText)
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l.length > 4);

    const institutionKeywords = [
      "institute", "college", "university", "technology",
      "polytechnic", "vidyapith", "engineering", "academy",
      "school of", "uit", "iit", "nit", "iiit"
    ];

    const candidateQueries: string[] = [];
    if (manualQuery && manualQuery.length >= 3) {
      candidateQueries.push(manualQuery);
    }

    for (const line of lines) {
      const lower = line.toLowerCase();
      // Ignore common card headers like "identity card", "student id card"
      if (lower.includes("identity card") || lower.includes("student id") || lower.includes("library card") || lower.includes("session")) {
        continue;
      }
      if (institutionKeywords.some(kw => lower.includes(kw))) {
        candidateQueries.push(line);
      }
    }

    // Also check for "University Institute of Technology" / "Burdwan"
    if (normalizedText.includes("uit") || normalizedText.includes("burdwan") || normalizedText.includes("bardhaman")) {
      candidateQueries.push("University Institute of Technology");
      candidateQueries.push("Burdwan");
    }

    // Fallback search words if no specific lines matched
    if (candidateQueries.length === 0) {
      for (const word of ["Technology", "Engineering", "College", "Institute", "University"]) {
        if (normalizedText.includes(word.toLowerCase())) {
          candidateQueries.push(word);
        }
      }
    }

    // 5. Perform search queries
    const candidateMap = new Map<string, InstitutionResult>();

    for (const query of candidateQueries.slice(0, 4)) {
      const cleanQ = query.replace(/[^a-zA-Z0-9 ]/g, " ").trim();
      if (cleanQ.length < 3) continue;

      // Search detected state
      const found = await searchExternalApi(detectedState, cleanQ);
      for (const item of found) {
        if (!candidateMap.has(item.id)) {
          candidateMap.set(item.id, item);
        }
      }

      // Also check fallback list
      for (const fb of FALLBACK_INSTITUTIONS) {
        if (
          fb.name.toLowerCase().includes(cleanQ.toLowerCase()) ||
          fb.university.toLowerCase().includes(cleanQ.toLowerCase())
        ) {
          if (!candidateMap.has(fb.id)) {
            candidateMap.set(fb.id, fb);
          }
        }
      }
    }

    // If still empty, include all fallback institutions for the state
    if (candidateMap.size === 0) {
      for (const fb of FALLBACK_INSTITUTIONS) {
        candidateMap.set(fb.id, fb);
      }
    }

    // 6. Score candidate matches against raw OCR text
    const scoredResults: InstitutionResult[] = Array.from(candidateMap.values()).map(item => {
      const nameScore = calculateSimilarity(item.name, rawText);
      const uniScore = item.university ? calculateSimilarity(item.university, rawText) * 0.8 : 0;
      const districtScore = normalizedText.includes(item.district.toLowerCase()) ? 0.3 : 0;
      const totalScore = Math.min(1.0, Math.max(nameScore, uniScore) + districtScore);

      return {
        ...item,
        matchScore: Number(totalScore.toFixed(2)),
      };
    });

    scoredResults.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    const bestMatch = scoredResults.length > 0 && (scoredResults[0].matchScore || 0) > 0.35
      ? scoredResults[0]
      : (scoredResults[0] || null);

    return NextResponse.json({
      success: true,
      detectedState,
      bestMatch,
      candidates: scoredResults.slice(0, 10),
      nameMatch,
      rawTextSnippet: lines.slice(0, 5).join(" | "),
    });
  } catch (error) {
    console.error("Verification route error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process verification",
        candidates: FALLBACK_INSTITUTIONS.slice(0, 5),
      },
      { status: 500 }
    );
  }
}
