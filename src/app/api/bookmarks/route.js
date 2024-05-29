import connectDb from "@/app/config/database";
import User from "@/app/models/User";
import Property from "@/app/models/Property";
import { getSessionUser } from "@/app/utils/getSessionUser";

//it's work locally but when we pushed it to Vercel causes an error this why this export is added
export const dynamic = "force-dynamic";

export const POST = async (request) => {
  try {
    await connectDb();
    const { propertyId } = await request.json();
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return new Response("user ID is Required", { status: 401 });
    }
    const { userId } = sessionUser;
    const user = await User.findOne({ _id: userId });
    // check if the property is already bookmarked
    let isBookMarked = user.bookmarks.includes(propertyId);
    let message;
    if (isBookMarked) {
      user.bookmarks.pull(propertyId);
      message = "Bookmark removed successfully";
      isBookMarked = false;
    } else {
      user.bookmarks.push(propertyId);
      message = "Bookmark added successfully";
      isBookMarked = true;
    }
    await user.save();
    return new Response(JSON.stringify({ message, isBookMarked }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("something went wrong", {
      status: 500,
    });
  }
};
