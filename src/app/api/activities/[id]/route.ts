import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, amount, type, club_id } = body;

    // Validate required fields
    if (!title || !description || !amount || !type || !club_id) {
      return NextResponse.json(
        { message: "All fields are required: title, description, amount, type, club_id" },
        { status: 400 }
      );
    }

    // Validate type
    if (!["club_to_student", "student_to_club"].includes(type)) {
      return NextResponse.json(
        { message: "Invalid activity type. Must be 'club_to_student' or 'student_to_club'" },
        { status: 400 }
      );
    }

    // Validate amount
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { message: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    // Make request to Flask backend
    const response = await fetch(`${process.env.BACKEND_URL}/activities/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        amount: numAmount,
        type,
        club_id,
      }),
    });

    const resData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: resData.message || "Failed to update activity" },
        { status: response.status }
      );
    }

    return NextResponse.json(resData);
  } catch (error) {
    console.error("Activities PUT API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Make request to Flask backend
    const response = await fetch(`${process.env.BACKEND_URL}/activities/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: resData.message || "Failed to delete activity" },
        { status: response.status }
      );
    }

    return NextResponse.json(resData);
  } catch (error) {
    console.error("Activities DELETE API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}