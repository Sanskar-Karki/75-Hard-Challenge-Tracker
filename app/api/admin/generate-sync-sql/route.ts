import { createClient } from "@supabase/supabase-js";
import { createClerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

    // 1. Fetch all users from Clerk
    const clerkUsers = await clerk.users.getUserList({ limit: 500 });
    
    // 2. Fetch all user IDs from Supabase challenges
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: challenges } = await supabase.from('challenges').select('user_id');

    if (!challenges) throw new Error("Could not fetch challenges");

    // 3. Generate SQL Update Statements
    let sql = `-- 🏅 75 HARD USER MIGRATION SCRIPT\n-- Run this in your Supabase SQL Editor\n\n`;

    challenges.forEach((challenge) => {
      const user = clerkUsers.data.find(u => u.id === challenge.user_id);
      if (user) {
        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Warrior';
        const email = user.emailAddresses[0]?.emailAddress || '';
        const image = user.imageUrl || '';
        
        sql += `UPDATE public.challenges SET \n`;
        sql += `  user_name = '${name.replace(/'/g, "''")}', \n`;
        sql += `  user_email = '${email.replace(/'/g, "''")}', \n`;
        sql += `  user_image = '${image}' \n`;
        sql += `WHERE user_id = '${challenge.user_id}';\n\n`;
      }
    });

    return new NextResponse(sql, {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': 'attachment; filename="sync_users.sql"'
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
