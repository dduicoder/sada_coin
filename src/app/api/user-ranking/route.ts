import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch(`${process.env.BACKEND_URL}/users/ranking`);

  const resData = await response.json();

  if (!response.ok) {
    throw new Error(resData.message || "Could not fetch.");
  }

  return NextResponse.json(resData);
}
