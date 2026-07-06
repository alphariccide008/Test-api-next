import connect from "@/lib/db";
import User from "@/lib/modals/users";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import {Types} from "mongoose";





export const PATCH = async (request: Request, context: { params: Promise<{ category: string }> }) => {
    //export the category id from the params
    const categoryId = (await context.params).category; 

    try {
        //fetch thee Form data from the body 
        const body = await request.json();
        const {title} = body;

        // retrieve the userId from the request headers
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");


        //Validate the userid 
        if(!userId?.trim() || !Types.ObjectId.isValid(userId)){
            return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
        }

        //Validate the category id
        if(!categoryId?.trim() || !Types.ObjectId.isValid(categoryId)){
            return NextResponse.json({ error: "Invalid categoryId" }, { status: 400 });
        }

        //connect to Database 
        await connect();


        //find if the user id exsit in the Database 
        const user = await User.findById(userId);
        if(!user){
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        //find if category exist in database user the category id and the userid 
        const category = await Category.findOne({ _id : categoryId, user : userId });
        if(!category){
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }


        //update the category title
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { title },
            { new: true }
        );

        return NextResponse.json({ message: "Category updated successfully", category: updatedCategory }, { status: 200 });
        

    } catch (error: any) {
        console.error("Error updating category:", error);
        return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
    }
};




//DELETE method to delete a category
export const DELETE = async (request: Request, context: { params: Promise<{ category: string }> }) => {
    //export the category id from the params
    const categoryId = (await context.params).category;

    try {
        // retrieve the userId from the request headers
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");


        //validate the userId 
        if(!userId?.trim() || !Types.ObjectId.isValid(userId)){
            return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
        } 


        //category id validation
        if(!categoryId?.trim() || !Types.ObjectId.isValid(categoryId)){
            return NextResponse.json({ error: "Invalid categoryId" }, { status: 400 });
        }

    }catch (error: any) {
        console.error("Error deleting category:", error);
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }

}