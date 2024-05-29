import connectDb from "@/app/config/database";
import Property from "@/app/models/Property";

//Get /api/properties/user/:userId
export const GET = async (request, { params }) => {
  try {
    await connectDb();
    const userId = params.userId;
    if (!userId) {
      return new Response("User id is required", { status: 400 });
    }

    const properties = await Property.find({ owner: userId }); // will get only the owners listing
    return new Response(JSON.stringify(properties), {
      status: 200,
    });
  } catch (e) {
    console.log("Error in get request");
    return new Response("Something went wrong", { status: 500 });
  }
};
