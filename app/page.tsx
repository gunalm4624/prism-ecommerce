import Image from "next/image";
import HomePage from "./home/page";
import { Navbar } from "@/components/blocks/shadcnblocks-com-navbar1";

export default function Home() {
  return (
    <div className="max-w-xxl p-4">
      <Navbar/>
      <div className="mt-6">
      <HomePage/>
      </div>
    </div>
  );
}
