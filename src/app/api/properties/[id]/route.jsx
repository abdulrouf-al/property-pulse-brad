import connectDb from "@/app/config/database";
import Property from "@/app/models/Property";

//Get /api/properties/:id
export const GET = async (request, { params }) => {
  try {
    await connectDb();
    const property = await Property.findById(params.id);
    if (!property) return new Response("Property Not Found", { status: 404 });
    return new Response(JSON.stringify(property), {
      status: 200,
    });
  } catch (e) {
    console.log("Error in get request");
    return new Response("Something went wrong", { status: 500 });
  }
};
