import Link from "next/link";
//if we need fetching the data locally from json file
//import properties from "@/app/properties.json";
import PropertyCard from "../components/properties/PropertyCard";
import { fetchProperties } from "@/app/utils/requests";

const PropertiesPage = async () => {
  // now this contains the data from the database
  const properties = await fetchProperties();
  properties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return (
    <section className="px-4 py-6">
      <div className="container-xl lg:container m-auto px-4 py-6">
        {properties.length === 0 ? (
          <p>No Properties Found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertiesPage;
