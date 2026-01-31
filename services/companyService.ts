export type Company = {
  id: number;
  name: string;
  slug: string;
};

export async function getCompanies(): Promise<Company[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/companies/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to load companies");
  }

  return res.json();
}
