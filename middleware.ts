import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest){
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({
        req,
        res
    });

    await supabase.auth.getSession();
    return res;
}; // we using that for authenticated users to upload songs without restrictions. (kimliği doğrulanmış kullancıların ayarlar değiştirilirse kısıtlamadan etkilenmeden şarkı ekleyebilmesi için)