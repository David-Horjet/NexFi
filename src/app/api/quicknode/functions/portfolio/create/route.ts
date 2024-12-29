import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { walletAddress, portfolioName } = body;

    if (!walletAddress || !portfolioName) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Replace with your QuickNode function logic
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_QUICKNODE_FUNCTION_RPC_URL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": `${process.env.NEXT_PUBLIC_QUICKNODE_FUNCTION_API_KEY}`,
        },
        body: JSON.stringify({
          user_data: {
            instruction: "createPortfolio",
            portfolioName,
            walletAddress,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.error || "Error creating portfolio" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error in API handler:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
