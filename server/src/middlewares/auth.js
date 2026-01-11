import { clerkClient } from "@clerk/express";
import ApiError from "../utils/ApiError.js";

const protectAdmin = async (req, res, next) => {
  try {
        const { userId } = req.auth();

        const user = await clerkClient.users.getUser(userId)

        if(user.privateMetadata.role !== 'admin'){
            throw new ApiError(403, "not authorized laalaa");
        }

        next();
    } catch (error) {
        throw new ApiError(403, "not authorized laa");
    }
};

export {
    protectAdmin
};