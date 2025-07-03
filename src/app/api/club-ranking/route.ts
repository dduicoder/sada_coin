import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch(`http://127.0.0.1:5000/clubs/ranking`);

  const resData = await response.json();

  if (!response.ok) {
    throw new Error(resData.message || "Could not fetch.");
  }

  return NextResponse.json(resData);
}
