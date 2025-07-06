import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // get query parameters from the request
  const url = new URL(request.url);
  const hash = url.searchParams.get("hash");

  const response = await fetch(
    `${process.env.BACKEND_URL}/transactions/${hash}`
  );

  const resData = await response.json();

  if (!response.ok) {
    throw new Error(resData.message || "Could not fetch.");
  }

  return NextResponse.json(resData);
}
