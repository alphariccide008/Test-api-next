import { NextResponse,NextRequest } from "next/server";
import { authMiddleware } from "@/middleware/api/authMiddleware";





//Creating the middleware function to check if the user is authenticated or not
export default  function middleware(request: NextRequest) {
    
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/api/blogs") || pathname.startsWith("/api/users")) {
        return NextResponse.next();
    }
    //importing the authMiddleware function to check if the user is authenticated or not
    const isAuthenticated = authMiddleware(request);
    if(!isAuthenticated) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }


    
    return NextResponse.next();
}


//Creating the config function with the matcher inbetween to match all the routes 
export const config = {
    matcher: "/api/:path*",
};
