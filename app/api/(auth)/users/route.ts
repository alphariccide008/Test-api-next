import connect from "@/lib/db";
import User from "@/lib/modals/users";
import { NextResponse } from "next/server";
import {Types} from "mongoose";


const ObjectId = require("mongoose").Types.ObjectId;




//Get all users from the database
export const GET = async () => {
  try {
    await connect();
    const users = await User.find();// fetches the users from the DB
    return NextResponse.json(users); // Displays the users in JSON format
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
};


//Sign up new user and save to the database 
export const POST = async (request : Request) => {
  try{
    // Get the data from the request body
    const { email, username, password } = await request.json();
    // connect to database.....
    await connect();
    //create new user instance 
    const newUser = new User({
      email,
      username,
      password,
    });
    await newUser.save();
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}



//This is the Api for patching =meaning to update the user data in the database 
export const PATCH = async (request : Request) => {
  //First we need to get the data from the request body
  try {
    const { userId,newUsername } = await request.json();
    //connect to the database
    await connect();
    //finding if the user exist Meaning iw oudl be checking if the username exist already of if the user is even logged in or existing int the Database 

    if (!userId?.trim() || !newUsername?.trim()) {
      return NextResponse.json({ error: "Missing userId or newUsername" }, { status: 400 });
    };
    
    // checking if the userId is Valid ObjectId NB: This can be diffrent when we'rewriting with Postgres
    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

    //checking if the user exist in the database and update 
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username: newUsername },
      { new: true } // This option returns the updated document
    );

    // If the user is not found, return an error response
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "User updated successfully", updatedUser }, { status: 200 });


}catch (erro : any) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
 
}




//Delete a user from the database

export const DELETE = async (request : Request) => {
  try {
    const { userId } = await request.json();
    
    // Check if userId is provided and not empty
    if (!userId?.trim()) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    //check if the userId is is valid 
    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

    //Connect to the Database 
    await connect();

    //Find and Delete the user from the database
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
      
    // checking i

  } catch (error :any){
    console.error("Failed to delete user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}


//thi is the best catch Error Logic 
//try {
// } catch (error: unknown) {
//   console.error("Failed to update user:", error);

//   if (error instanceof Error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }

//   return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
// }


