import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/_lib/firebase";

interface Cache {
  wasteType?: WasteType[];
}

const cache: Cache = {};

export async function GET() {
  const querySnapshot = await getDocs(collection(db, "wasteType"));

  if (!cache.wasteType) {
    cache.wasteType = querySnapshot.docs.map((doc) => {
      return { ...doc.data(), source: "database" } as WasteType;
    });
    // console.log("cache miss");
  }
  const data = cache.wasteType;

  return Response.json({ items: data });
}
