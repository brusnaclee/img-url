import { NextResponse } from "next/server";

import { google } from "googleapis";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: Request) {
  const requestUrl = new URL(req.url);
  const params = requestUrl.searchParams;

  const q = params.get("q")?.toLowerCase();

  if (!q)
    return NextResponse.json(
      { message: "please provide q query" },
      { status: 400 },
    );

  const offset = Number(params.get("offset")) || 0;

  const customsearch = google.customsearch("v1");
  const apikey = process.env.APIKEY;

  const results = await customsearch.cse.list({
    cx: "2083d6ff215544e68",
    q: q || "banana",
    auth: apikey,
    searchType: "image",
    start: Number(offset) || 0,
  });

  const searchList = results.data.items;
  const displayItems = searchList?.map((item) => {
    const itemDetails = {
      id: uuidv4(),
      url: item.link,
      original: item.link,
      snippet: item.snippet,
      thumbnail: item?.image?.thumbnailLink,
      context: item?.image?.contextLink,
    };
    return itemDetails;
  });
  return NextResponse.json({ items: displayItems }, { status: 200 });

  return NextResponse.json({ message: "hello Next" }, { status: 200 });
}
