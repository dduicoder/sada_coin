import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { sender_hash, receiver_hash, amount, title, transaction_type } =
      body;

    if (!sender_hash || !receiver_hash || !amount) {
      return NextResponse.json(
        {
          message:
            "sender_hash, (receiver_id or receiver_hash), and amount are required",
        },
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
    const response = await fetch(`${process.env.BACKEND_URL}/transfer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender_hash,
        receiver_hash,
        amount: numAmount,
        title,
        transaction_type,
      }),
    });

    const resData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: resData.message || "Transfer failed" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: resData.message || "Transfer completed successfully",
    });
  } catch (error) {
    console.error("Transfer API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
