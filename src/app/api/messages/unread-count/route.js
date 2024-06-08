import connectDb from "@/app/config/database";
import { getSessionUser } from "@/app/utils/getSessionUser";
import Message from "@/app/models/Message";
export const dynamic = "force-dynamic"; // just for deploying

// GET /api/messages/unread-count

export const GET = async (request) => {
  try {
    await connectDb();

    const sessionUser = await getSessionUser();
    const { userId } = sessionUser;
    if (!sessionUser || !sessionUser.user) {
      return new Response("User ID is required", { status: 401 });
    }
    const count = await Message.countDocuments({
      recipient: userId,
      read: false,
    });

    return new Response(JSON.stringify(count), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
