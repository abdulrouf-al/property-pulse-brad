import connectDb from "@/app/config/database";
import Property from "@/app/models/Property";
import { getSessionUser } from "@/app/utils/getSessionUser";

//Get /api/properties/:id
export const GET = async (request, { params }) => {
  try {
    await connectDb();
    const { id } = params;
    const property = await Property.findById(id);
    if (!property) return new Response("Property Not Found", { status: 404 });
    return new Response(JSON.stringify(property), {
      status: 200,
    });
  } catch (e) {
    console.log("Error in get request");
    return new Response("Something went wrong", { status: 500 });
  }
};

//DELETE /api/properties/:id/delete
export const DELETE = async (request, { params }) => {
  try {
    const propertyId = params.id;

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return new Response("User Id is required", { status: 401 });
    }
    const { userId } = sessionUser;
    await connectDb();
    const property = await Property.findById(params.id);
    if (!property) return new Response("Property Not Found", { status: 404 });

    //verify Ownership
    if (property.owner.toString() !== userId) {
      return new Response(
        "Unauthorized, You are not authorized to delete this property",
        { status: 401 }
      );
    }

    /*
    //deleting images from cloudinary with the property 
    // extract public id's from image url in DB
    const publicIds = property.images.map((imageUrl) => {
      const parts = imageUrl.split("/");
      return parts.at(-1).split(".").at(0);
    });

    // Delete images from Cloudinary
    if (publicIds.length > 0) {
      for (let publicId of publicIds) {
        await cloudinary.uploader.destroy("propertyPulse/" + publicId);
      }
    } */

    await property.deleteOne();
    return new Response("Property Deleted", {
      status: 200,
    });
  } catch (e) {
    console.log(e);
    return new Response("Something went wrong", { status: 500 });
  }
};

//PUT /api/properties/:id/edit
export const PUT = async (request, { params }) => {
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
    // access all values from amenities
    const amenities = formData.getAll("amenities");

    //get property to update
    const existingProperty = await Property.findById(params.id);
    if (!existingProperty) {
      return new Response("Property dose not exist", { status: 404 });
    }
    //verify ownership
    if (existingProperty.owner.toString() !== userId) {
      return new Response("Unauthorized", { status: 401 });
    }

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

    //Update property in database
    const updatedProperty = await Property.findByIdAndUpdate(
      params.id,
      propertyData
    );

    return new Response(JSON.stringify(updatedProperty), {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to add property", { status: 500 });
  }
};
