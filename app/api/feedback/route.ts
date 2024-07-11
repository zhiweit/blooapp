import { doc, getDoc, setDoc, addDoc } from "firebase/firestore";
import { db } from "@/app/_lib/firebase";
import { FEEDBACK_COLLECTION } from "@/app/_lib/firebase";

/**
 * Initialise feedback to 0 (no feedback) for the data items
 * @param request
 * @returns document id of the document created
 */
export async function POST(request: Request) {
  const { imageUrl, items }: { imageUrl: string; items: WasteType[] } =
    await request.json();

  const feedbackItems: WasteTypeFeedbackItem[] = items.map((item) => {
    return {
      item: item.item,
      source: item.source,
      feedback: 0,
    };
  });
  const data: { imageUrl: string; items: WasteTypeFeedbackItem[] } = {
    imageUrl: imageUrl,
    items: feedbackItems,
  };

  const res = await addDoc(FEEDBACK_COLLECTION, data);

  return Response.json({ id: res.id });
}

export async function PATCH(request: Request) {
  const { imageUrl, items, feedbackId }: WasteTypeFeedback =
    await request.json();

  if (!feedbackId) {
    return Response.json(
      { error: "Invalid request. feedbackId is required" },
      { status: 400 }
    );
  }

  const docRef = doc(db, "wasteTypeFeedback", feedbackId);
  await setDoc(
    docRef,
    {
      ...(imageUrl ? { imageUrl: imageUrl } : {}),
      ...(items ? { items: items } : {}),
    },
    { merge: true }
  );

  const res = await getDoc(docRef);

  return Response.json({ data: res.data() });
}
