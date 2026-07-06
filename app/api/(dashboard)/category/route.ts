import connect from "@/lib/db";
import User from "@/lib/modals/users";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import {Types} from "mongoose";



// GET request handler for fetching categories
export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        // Validate userId
        if (!userId?.trim() || !Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ error: "Invalid or missing userId" }, { status: 400 });
        } 

        //connect to the database
        await connect();

        const user = await User.findById(userId);
        if(!user){
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Fetch categories for the specified user
        const categories = await Category.find({ user : userId });

        // Check if categories exist for the user
        if(!categories || categories.length === 0){
            return NextResponse.json({ error: "No categories found for this user" }, { status: 404 });
        }

        return NextResponse.json(categories, { status: 200 });


    } catch (error : any) {
        console.error("Error fetching categories:", error);
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }

}


//Post request for adding something to the category table in the Database 
export const POST = async (request: Request) => {
    try {
        // Get the User id from the query parameters
       const { searchParams } = new URL(request.url);
       const userId = searchParams.get("userId");

       //Validate userId
       if(!userId?.trim()|| !Types.ObjectId.isValid(userId)){
        return NextResponse.json({ error: "Invalid or missing userId" }, { status: 400 });
       }


       //Recieve data from the request body
       const { title, description, image } = await request.json();

       //validate the received data
       if(!title?.trim() || !description?.trim() || !image?.trim()){
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
       }

       //Connect to the database
       await connect();

       //Check if the user exists in the database
       const user  = await User.findById(userId);
       if(!user){
        return NextResponse.json({ error: "User not found" }, { status: 404 });
       }

       //create and save the new category in the database
       const newCategory = new Category({
        title,
        description,
        image,
        user: userId,
       });

       await newCategory.save();
       return NextResponse.json({ message: "Category created successfully", category: newCategory }, { status: 201 });


    } catch (error : any) {
        console.error("Error creating category:", error);
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}