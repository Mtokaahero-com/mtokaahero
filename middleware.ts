

import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    // Add your middleware here
    return NextResponse.next();
}