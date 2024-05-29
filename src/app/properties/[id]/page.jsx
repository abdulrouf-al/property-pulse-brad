"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchProperty } from "@/app/utils/requests";
import PropertyHeaderImage from "@/app/components/property/PropertyHeaderImage";
import Link from "next/link";
import PropertyDetails from "@/app/components/property/PropertyDetails";
import { FaArrowLeft } from "react-icons/fa";
import Spinner from "@/app/components/Spinner";
import PropertyImages from "@/app/components/property/PropertyImages";
import BookmarkButton from "@/app/components/property/BookmarkButton";
import ShareButton from "@/app/components/property/ShareButton";
import PropertyContactForm from "@/app/components/property/PropertyContactForm";

const PropertyPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!id) return;
      try {
        const property = await fetchProperty(id);
        setProperty(property);
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    if (property == null) {
      fetchPropertyData();
    }
  }, [id, property]);
  if (!property && !loading) {
    return (
      <h2 className="text-center text-2xl font-bold mt-10">
        Property Not Found
      </h2>
    );
  }
  return (
    <>
      {loading && <Spinner loading={loading} />}
      {!loading && property && (
        <PropertyHeaderImage image={property.images[0]} />
      )}

      <section>
        <div className="container m-auto py-6 px-6">
          <Link
            href="/properties"
            className="text-blue-500 hover:text-blue-600 flex items-center"
          >
            <FaArrowLeft className="mr-2" />
            Back to Properties
          </Link>
        </div>
      </section>
      <section className="bg-blue-50">
        <div className="container m-auto py-10 px-6">
          <div className="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
            {!loading && property && <PropertyDetails property={property} />}
            {/*  <!-- Sidebar --> */}
            <aside className="space-y-4">
              <BookmarkButton property={property} />
              <ShareButton property={property} />
              <PropertyContactForm property={property} />
            </aside>
          </div>
        </div>
      </section>
      {!loading && property && <PropertyImages images={property.images} />}
    </>
  );
};

export default PropertyPage;
