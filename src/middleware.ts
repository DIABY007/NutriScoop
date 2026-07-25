import { type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export function middleware(request: NextRequest) {
  const supabaseResponse = createClient(request);

  // Le refresh de session est géré automatiquement
  // par supabaseResponse.cookies via setAll()

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Images, manifest, etc.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};