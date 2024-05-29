import connectDb from "@/app/config/database";

import Property from "@/app/models/Property";

//Get
export const GET = async (request) => {
  try {
    await connectDb();
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");
    const type = searchParams.get("type");
    const locationPattern = new RegExp(location, "i"); // regular expression and i for case insensitivity

    let query = {
      $or: [
        { name: locationPattern },
        { description: locationPattern },
        { "location.street": locationPattern },
        { "location.city": locationPattern },
        { "location.state": locationPattern },
      ],
    };
    if (type && type !== "All") {
      const typePattern = new RegExp(type, "i");
      query.type = typePattern;
    }
    const properties = await Property.find(query);

    return new Response(JSON.stringify(properties), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
