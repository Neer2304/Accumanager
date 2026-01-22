import { getStockPrice } from "@/lib/stockData";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { symbol: string } }) {
  const data = await getStockPrice(params.symbol);
  if (!data) {
    return NextResponse.json({ error: "Limit reached or invalid ticker" }, { status: 429 });
  }
  return NextResponse.json(data);
}