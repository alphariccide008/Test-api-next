//create the export the function middle ware  
export function logMiddleware(request: Request) {
    return { response : request.method + " " + request.url }
}