// when we'll upload the app to Versal the (NEXT_PUBLIC_API_DOMAIN) will not going to be available until after deploying the project, therefore will cause an error and not going to deploy correctly. this why will make it return a empty array just while we could add the (NEXT_PUBLIC_API_DOMAIN) and so on
const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

// fetch all properties from db
export async function fetchProperties() {
  try {
    if (!apiDomain) {
      return [];
    }
    const res = await fetch(`${apiDomain}/properties`, { cache: "no-store" }); //{ cache: "no-store" } will show the new added property without hard-refreshing the page
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  } catch (err) {
    console.log(err);
    return [];
  }
}

// Fetch single property

export async function fetchProperty(id) {
  try {
    if (!apiDomain) {
      return null;
    }
    const res = await fetch(`${apiDomain}/properties/${id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  } catch (err) {
    console.log(err);
    return null;
  }
}
