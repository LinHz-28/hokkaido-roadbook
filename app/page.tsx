import type { Metadata } from "next";
import { TravelBook } from "./TravelBook";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "極境孤寂 | 北海道 10 天 9 夜",
  description: "從富良野一路縱走至稚內，再沿日本海回到札幌的沉浸式旅行手冊。",
};

export default function Home() {
  return <TravelBook />;
}
