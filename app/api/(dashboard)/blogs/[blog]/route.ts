import connect from "@/lib/db";
import Blog from "@/lib/modals/blog";
import User from "@/lib/modals/users";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import {Types} from "mongoose";




//get request handler for fetching  single blogs based on userId and categoryId
export const GET = async (request : Request , context : { params: Promise<{ blog: string }> }) => {
    //export the blog id from the params
    const blogId = (await context.params).blog;


    try {
           //get the user id and category id from the query parameters
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");
         // Get the search keyword from query parameters, default to empty string if not provided

        //Validate the userid , category id, Blog Id 
        if (!userId?.trim() || !Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
        }
        if (!categoryId?.trim() || !Types.ObjectId.isValid(categoryId)) {
            return NextResponse.json({ error: "Invalid categoryId" }, { status: 400 });
        }
        if (!blogId?.trim() || !Types.ObjectId.isValid(blogId)) {
            return NextResponse.json({ error: "Invalid blogId" }, { status: 400 });
        }

        //connect to database
        await connect();

        //find if the user id exsit in the Database
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        //find if the category id exist in the Database
        const category = await Category.findById(categoryId);
        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

      

        const blog = await Blog.findOne({
            _id: blogId,
            user: userId,
            category: categoryId
        });


        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        console.log(blog);
        return NextResponse.json({ blog }, { status: 200 });


    } catch (error: any) {
        console.error("Error fetching blog:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

}


//Patch request handler for updating a blog based on userId and categoryId
export const PATCH = async  (request : Request , context : { params : Promise <{ blog : string }> }) => {
    //export the blog id from the params
    const blogId = (await context.params).blog;


    try {

        //get the data from the request body
        const { title, description } = await request.json();


        //get the user id and category id from the query parameters
        const {searchParams} = new URL(request.url);
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");

        //check if the user id, category id and blog id are valid
        if(!userId?.trim() || !Types.ObjectId.isValid(userId)){
            return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
        }
        if(!categoryId?.trim() || !Types.ObjectId.isValid(categoryId)){
            return NextResponse.json({ error: "Invalid categoryId" }, { status: 400 });
        }
        if(!blogId?.trim() || !Types.ObjectId.isValid(blogId)){
            return NextResponse.json({ error: "Invalid blogId" }, { status: 400 });
        }


        //connect to database 
        await connect();

        //find if the user id exsit in the Database
        const user = await User.findById(userId);
        if(!user){
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        //find if the category id exist in the Database
        const category = await Category.findById(categoryId);
        if(!category){
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        //find if the blog id exist in the Database
        const blog = await Blog.findOne({
            _id: blogId,
            user: userId,
            category: categoryId
        });

        if(!blog){
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        //update the blog
        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            { title, description },
            { new: true }
        );

        console.log(updatedBlog);
        return NextResponse.json({ message: "Blog updated successfully", blog: updatedBlog }, { status: 200 });

    } catch (error : any) {
        console.error("Error updating blog:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}



//Delete request handler for deleting a blog based on userId and categoryId
export const DELETE = async (request : Request , context :  { params : Promise <{ blog : string }> }) => {

    
   // export the Blogid from the param 
   const blogId = (await context.params).blog;

   //try catch error 
   try {
    // export the userid and caategpryid from the query parameters
    const {searchParams} = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    //check if the user id, category id and blog id are valid
    if(!userId?.trim() || !Types.ObjectId.isValid(userId)){
        return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

    if(!categoryId?.trim() || !Types.ObjectId.isValid(categoryId)){
        return NextResponse.json({ error: "Invalid categoryId" }, { status: 400 });
    }
    if(!blogId?.trim() || !Types.ObjectId.isValid(blogId)){
        return NextResponse.json({ error: "Invalid blogId" }, { status: 400 });
    }

    //connect to database 
    await connect();
    //find if the user id exsit in the Database
    const user = await User.findById(userId);
    if(!user){
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    //find if the category id exist in the Database
    const category = await Category.findById(categoryId);
    if(!category){
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    //find if the blog id exist in the Database
    const blog = await Blog.findOne({
        _id: blogId,
        user: userId,
        category: categoryId
    });

    if(!blog){
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    //delete the blog
    await Blog.findByIdAndDelete(blogId);
    return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });

    
   } catch (error : any) {
       console.error("Error deleting blog:", error);
       return NextResponse.json({ error: error.message }, { status: 500 });
   }
}