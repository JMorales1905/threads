"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../validations/mongoose"
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export async function updateUser({
    userId,
    username,
    name,
    bio,
    image,
    path,
}: Params): Promise<void> {
    connectToDB();

    // function updates the user
    try {
        await User.findOneAndUpdate(
            { id: userId },
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true,
            },
            //operation that will update an existing row if specified value if a specified value already exists in table
            //and will insert a new row if the specified value doesn't already exist.
            {
                upsert: true
            }
        );

        //NextJs function that allows to revalidate data associated with a specific task
        if (path === '/profile/edit') {
            revalidatePath(path);
        }

    } catch (error: any) {
        throw new Error(`Failed to create/update user: ${error.message}`)
    }
}