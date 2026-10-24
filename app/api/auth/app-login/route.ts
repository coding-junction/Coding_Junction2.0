import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createClerkClient } from "@clerk/backend";
import { getSupabaseAdmin } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Query user from Supabase 25-column 'public.user' table
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json(
        { error: "Database service unavailable. Check Supabase credentials." },
        { status: 503 }
      );
    }

    const { data: dbUser, error: dbError } = await (supabase as any)
      .from("user")
      .select("*")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (dbError) {
      console.error("[App-Login] Database error querying user:", dbError);
      return NextResponse.json(
        { error: "Error checking account credentials." },
        { status: 500 }
      );
    }

    if (!dbUser || !dbUser.hashed_password) {
      return NextResponse.json(
        { error: "No mobile app account found with this email. Please check your credentials." },
        { status: 401 }
      );
    }

    // 2. Verify password against Supabase bcrypt hash
    const isPasswordValid = bcrypt.compareSync(password, dbUser.hashed_password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid password. Please enter the password you use in the mobile app." },
        { status: 401 }
      );
    }

    if (dbUser.is_active === false) {
      return NextResponse.json(
        { error: "Your account is marked inactive. Please contact club support." },
        { status: 403 }
      );
    }

    // 3. Initialize Clerk Admin client
    const clerkSecret = process.env.CLERK_SECRET_KEY;
    if (!clerkSecret) {
      return NextResponse.json(
        { error: "Clerk secret key is missing in environment." },
        { status: 500 }
      );
    }

    const clerk = createClerkClient({ secretKey: clerkSecret });

    // 4. Check if a Clerk account already exists for this email
    const userList = await clerk.users.getUserList({ emailAddress: [normalizedEmail] });
    let clerkUserId: string;

    if (userList.data && userList.data.length > 0) {
      clerkUserId = userList.data[0].id;
    } else {
      // Create a Clerk user account so they have a valid web session
      const nameParts = (dbUser.full_name || "Community Member").trim().split(" ");
      const firstName = nameParts[0] || "Member";
      const lastName = nameParts.slice(1).join(" ") || "";

      const newClerkUser = await clerk.users.createUser({
        emailAddress: [normalizedEmail],
        firstName,
        lastName,
        skipPasswordRequirement: true,
      });
      clerkUserId = newClerkUser.id;
    }

    // 5. Generate single-use sign-in token (ticket) for immediate frontend activation
    const signInToken = await clerk.signInTokens.createSignInToken({
      userId: clerkUserId,
      expiresInSeconds: 300,
    });

    return NextResponse.json({
      success: true,
      token: signInToken.token,
      user: {
        id: dbUser.id,
        email: dbUser.email,
        fullName: dbUser.full_name,
        college: dbUser.college_name,
        department: dbUser.department,
        rollNo: dbUser.roll_no,
      },
    });
  } catch (err: any) {
    console.error("[App-Login] Unexpected exception:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error during app login." },
      { status: 500 }
    );
  }
}
