import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // get query parameters from the request
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const response = await fetch(`http://127.0.0.1:5000/users/${id}/balance`);

  const resData = await response.json();

  if (!response.ok) {
    throw new Error(resData.message || "Could not fetch.");
  }

  return NextResponse.json(resData);
}
