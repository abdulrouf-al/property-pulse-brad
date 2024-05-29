import connectDb from "@/app/config/database";
import Property from "@/app/models/Property";
import cloudinary from "@/app/config/cloudinary";
import { getSessionUser } from "@/app/utils/getSessionUser";

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

export const POST = async (request) => {
  try {
    await connectDb();
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return new Response("User ID is required", { status: 401 });
    }
    const { userId } = sessionUser;

    //get form data
    const formData = await request.formData();
    //console.log(formData.get("name")); // => Test Property
    // access all values from amenities and images
    const amenities = formData.getAll("amenities");
    const images = formData
      .getAll("images")
      .filter((image) => image.name !== "");
    //console.log(amenities,images)

    //create propertyData object for database
    const propertyData = {
      type: formData.get("type"),
      name: formData.get("name"),
      description: formData.get("description"),
      location: {
        street: formData.get("location.street"),
        city: formData.get("location.city"),
        state: formData.get("location.state"),
        zipcode: formData.get("location.zipcode"),
      },
      beds: formData.get("beds"),
      baths: formData.get("baths"),
      square_feet: formData.get("square_feet"),
      amenities,
      rates: {
        nightly: formData.get("rates.nightly"),
        weekly: formData.get("rates.weekly"),
        monthly: formData.get("rates.monthly"),
      },
      seller_info: {
        name: formData.get("seller_info.name"),
        email: formData.get("seller_info.email"),
        phone: formData.get("seller_info.phone"),
      },
      owner: userId,
      //images,
    };

    //upload image(s) to cloudinary
    const imageUploadPromises = [];
    for (const image of images) {
      const imageBuffer = await image.arrayBuffer();
      const imageArray = Array.from(new Uint8Array(imageBuffer));
      const imageData = Buffer.from(imageArray);

      //convert the image data to base64
      const imageBase64 = imageData.toString("base64");

      //make request to upload to cloudinary
      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${imageBase64}`,
        { folder: "propertyPulse" }
      );
      imageUploadPromises.push(result.secure_url);

      //wait for all images to upload
      const uploadedImages = await Promise.all(imageUploadPromises);
      //add uploaded images to the propertyData object
      propertyData.images = uploadedImages;
    }

    //console.log(propertyData);
    const newProperty = new Property(propertyData);
    await newProperty.save();

    return Response.redirect(
      `${process.env.NEXTAUTH_URL}/properties/${newProperty._id}`
    );

    /* return new Response(JSON.stringify({ message: "success" }), {
      status: 200,
    }); */
  } catch (error) {
    console.log(error);
    return new Response("Failed to add property", { status: 500 });
  }
};
