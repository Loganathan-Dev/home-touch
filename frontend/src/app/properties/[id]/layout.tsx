import type { Metadata } from "next";

async function getProperty(id: string) {
  const res = await fetch(`http://localhost:5000/api/properties/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const json = await getProperty(resolvedParams.id);
    
    if (!json || !json.data) return { title: "Property Not Found" };
    
    const property = json.data;
    return {
      title: `${property.title} | Red Sand Group`,
      description: property.description?.substring(0, 150) || "View this property.",
    };
  } catch (e) {
    return { title: "Red Sand Group" };
  }
}

export default function PropertyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}