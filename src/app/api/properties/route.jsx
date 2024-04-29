import connectDb from "@/app/config/database";
import Property from "@/app/models/Property";

//Get /api/properties
export const GET = async (request) => {
  try {
    await connectDb();
    const properties = await Property.find({});
    return new Response(JSON.stringify(properties), {
      status: 200,
    });
  } catch (e) {
    console.log("Error in get request");
    return new Response("Something went wrong", { status: 500 });
  }
};
