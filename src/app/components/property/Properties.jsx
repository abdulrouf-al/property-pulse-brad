"use client";
//if we need fetching the data locally from json file
//import properties from "@/app/properties.json";

import { useState, useEffect } from "react";
import PropertyCard from "../properties/PropertyCard";
import Spinner from "../Spinner";
import Pagination from "./Pagination";

const Properties = () => {
  // now this contains the data from the database
  /* const properties =  fetchProperties();
    properties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
     */
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(2);
  const [pageSize, setPageSize] = useState(3);
  const [totalProperties, SetTotalProperties] = useState(0);
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch(
          `/api/properties?page=${page}&pageSize=${pageSize}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch properties");
        }
        const data = await res.json();
        setProperties(data.properties);
        SetTotalProperties(data.totalProperties);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [page, pageSize]);
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
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
        <Pagination
          page={page}
          pageSize={pageSize}
          totalProperties={totalProperties}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
};

export default Properties;
