import connectDb from "@/app/config/database";
import Message from "@/app/models/Message";
import { getSessionUser } from "@/app/utils/getSessionUser";
export const dynamic = "force-dynamic";

// GET /api/messages
export const GET = async () => {
  try {
    await connectDb();
    const sessionUser = await getSessionUser();
    const { userId } = sessionUser;
    if (!sessionUser || !sessionUser.user) {
      return new Response(
        JSON.stringify({
          message: "User ID is required",
        }),
        { status: 401 }
      );
    }
    const readMessages = await Message.find({ recipient: userId, read: true })
      .sort({ createdAt: -1 }) //sort read messages in asc order
      .populate("sender", "username")
      .populate("property", "name");
    const unReadMessages = await Message.find({
      recipient: userId,
      read: false,
    })
      .sort({ createdAt: -1 }) //sort read messages in asc order
      .populate("sender", "username")
      .populate("property", "name");

    const messages = [...unReadMessages, ...readMessages];

    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// POST /api/messages
export const POST = async (request) => {
  try {
    await connectDb();
    const { name, email, property, recipient, phone, message } =
      await request.json();
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.user)
      return new Response(
        JSON.stringify({
          message: "You must be logged in to send a message  ",
        }),
        { status: 401 }
      );
    const { user } = sessionUser;
    if (user.id === recipient) {
      return new Response(
        JSON.stringify({
          message: "Can not send a message to yourself   ",
        }),
        { status: 400 }
      );
    }

    const newMessage = new Message({
      recipient,
      name,
      email,
      phone,
      body: message,
      property,
      sender: user.id,
    });
    await newMessage.save();

    return new Response(JSON.stringify({ message: "Message Sent" }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
