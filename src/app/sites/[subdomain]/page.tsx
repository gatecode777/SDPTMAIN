import React from "react";
import dbConnect from "@/lib/mongoose";
import Website from "@/models/Website";
import { notFound } from "next/navigation";
import SiteTemplate from "@/components/business/SiteTemplate";

// Dynamic page settings
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ subdomain: string }>;
}

export default async function SubdomainPage({ params }: PageProps) {
  const { subdomain } = await params;

  await dbConnect();
  const website = await Website.findOne({ subdomain: subdomain.toLowerCase().trim() });

  if (!website) {
    notFound();
  }

  // Serialize Mongoose document to plain JSON object to avoid serialization errors in Client Component props
  const serializedWebsite = JSON.parse(JSON.stringify(website));

  return <SiteTemplate website={serializedWebsite} />;
}
