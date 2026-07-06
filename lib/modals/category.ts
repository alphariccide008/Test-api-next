import {Schema, model, models } from 'mongoose';


const categorySchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },   
        //forgin key to the user model
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },{
        timestamps: true,
    }

);

const Category = models.Category || model('Category', categorySchema);

export default Category;