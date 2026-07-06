import connect from "@/lib/db";
import Blog from "@/lib/modals/blog";
import User from "@/lib/modals/users";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import {Types} from "mongoose";


export const GET = async (request : Request) => {
    try {
        // Get the User id from the query parameters
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");
        const searchKeyword = searchParams.get("keyword") as string|| ""; // Default to empty string if not provided
        const startDate = searchParams.get("startDate") as string || ""; // Default to empty string if not provided
        const endDate = searchParams.get("endDate") as string || ""; // Default to empty string if not provided

        //Validate the userid and category id

        if(!userId?.trim() || !Types.ObjectId.isValid(userId)){
            return NextResponse.json({ error: "Invalid or missing userId" }, { status: 400 });
        }

        if(!categoryId?.trim() || !Types.ObjectId.isValid(categoryId)){
            return NextResponse.json({ error: "Invalid or missing categoryId" }, { status: 400 });
        }


        //connect to the database
        await connect(); 

        //find if the user id exsit in the Database
        const user = await User.findById(userId);
        if(!user){
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const category = await Category.findById(categoryId);
        if(!category){
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        } 


        //fetch all the blogs using the fiter of the user id and the category id
        const filter : any = { 
            user: new Types.ObjectId(userId), 
            category: new Types.ObjectId(categoryId) 
        };

        // If a search keyword is provided, add a case-insensitive regex filter for the title`
        if (searchKeyword.trim()) {
            filter.$or = [
                { title: { $regex: searchKeyword, $options: "i" } },
                { description: { $regex: searchKeyword, $options: "i" } }
            ];
        }
        // If both startDate and endDate are provided, add a date range filter for the createdAt field
        if (startDate.trim() && endDate.trim()) {
           filter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };  
        }else if (startDate.trim()) {
            filter.createdAt = { $gte: new Date(startDate) };
        } else if (endDate.trim()) {
            filter.createdAt = { $lte: new Date(endDate) };
        } 


        //skip and limit for pagination
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const blogs = await Blog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
        
        if(!blogs || blogs.length === 0){
            return NextResponse.json({ error: "No blogs found for this user and category" }, { status: 404 });
        }
        return NextResponse.json(blogs, { status: 200 });


        
    } catch (error : any) {
        console.log(error);
        return NextResponse.json({ error : "Failed to fetch blogs" }, { status: 500 });
        
    }
};



//Post request for adding something to the category table in the Database

export const POST = async (request : Request) => {
    try {
        // Get the User id / category id from the query parameters
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");

        //get the Data from the body 
        const { title, description } = await request.json();

        //Validate the userid and category id

        if(!userId?.trim() || !Types.ObjectId.isValid(userId)){
            return NextResponse.json({ error: "Invalid or missing userId" }, { status: 400 });
        }

        if(!categoryId?.trim() || !Types.ObjectId.isValid(categoryId)){
            return NextResponse.json({ error: "Invalid or missing categoryId" }, { status: 400 });
        }

        //Validate the title and description
        if(!title?.trim() || !description?.trim()){
            return NextResponse.json({ error: "Invalid or missing title or description" }, { status: 400 });
        }


        //connect to the database
        await connect(); 

        //find if the user id exsit in the Database
        const user = await User.findById(userId);
        if(!user){
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const category = await Category.findById(categoryId);
        if(!category){
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        } 


        //create a new blog
        const newBlog = new Blog({
            title,
            description,
            user: user._id,
            category: category._id
        });

        //save the new blog to the database
        await newBlog.save();
        
        return NextResponse.json(newBlog, { status: 201 });



        

    }catch (error : any) {
        console.log(error);
        return NextResponse.json({ error : "Failed to create blog" }, { status: 500 });
    }
}