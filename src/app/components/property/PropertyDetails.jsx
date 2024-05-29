"use client";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaTimes,
  FaCheck,
  FaMapMarker,
} from "react-icons/fa";
import PropertyMap from "@/app/components/property/PropertyMap";

const PropertyDetails = ({ property }) => {
  return (
    <main>
      <div className="bg-white p-6 rounded-lg shadow-md text-center md:text-left">
        <div className="text-gray-500 mb-4">{property.type}</div>
        <h1 className="text-3xl font-bold mb-4">{property.name}</h1>
        <div className="text-gray-500 mb-4 flex align-middle justify-center md:justify-start">
          <FaMapMarker className="mr-2 text-orange-700 text-lg" />
          <p className="text-orange-700">
            {property.location.street}, {property.location.city}
            {property.location.state}
          </p>
        </div>

        <h3 className="text-lg font-bold my-6 bg-gray-800 text-white p-2">
          Rates & Options
        </h3>
        <div className="flex flex-col md:flex-row justify-around">
          <div className="flex items-center justify-center mb-4 border-b border-gray-200 md:border-b-0 pb-4 md:pb-0">
            <div className="text-gray-500 mr-2 font-bold">Nightly</div>
            <div className="text-2xl font-bold text-blue-500">
              {!property.rates.nightly ? (
                <FaTimes className="mr-1 text-red-700  " />
              ) : (
                `$${property.rates.nightly.toLocaleString()}`
              )}
            </div>
          </div>
          <div className="flex items-center justify-center mb-4 border-b border-gray-200 md:border-b-0 pb-4 md:pb-0">
            <div className="text-gray-500 mr-2 font-bold">Weekly</div>
            <div className="text-2xl font-bold text-blue-500">
              {!property.rates.weekly ? (
                <FaTimes className="mr-1 text-red-700  " />
              ) : (
                `$${property.rates.weekly.toLocaleString()}`
              )}
            </div>
          </div>
          <div className="flex items-center justify-center mb-4 pb-4 md:pb-0">
            <div className="text-gray-500 mr-2 font-bold">Monthly</div>
            <div className="text-2xl font-bold text-blue-500">
              {!property.rates.monthly ? (
                <FaTimes className="mr-1 text-red-700  " />
              ) : (
                `$${property.rates.monthly.toLocaleString()}`
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-bold mb-6">Description & Details</h3>
        <div className="flex justify-center gap-4 text-blue-500 mb-4 text-xl space-x-9">
          <p>
            <FaBed className="mr-2 inline" />
            {property.beds}
            <span className="hidden sm:inline"> Beds</span>
          </p>
          <p>
            <FaBath className="mr-2 inline" /> {property.baths}
            <span className="hidden sm:inline"> Baths</span>
          </p>
          <p>
            <FaRulerCombined className="mr-2 inline" />
            {property.square_feet.toLocaleString()}
            <span className="hidden sm:inline"> sqft</span>
          </p>
        </div>
        <p className="text-gray-500 mb-4">{property.description}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-bold mb-6">Amenities</h3>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 list-none space-y-2">
          {property.amenities.map((amenity, index) => (
            <li key={index}>
              <FaCheck className="text-green-600 mr-2   inline" />
              {amenity}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <PropertyMap property={property} />
      </div>
    </main>
  );
};

export default PropertyDetails;
