import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getBucketList } from "@/actions/bucketList";
import BucketListClient from "./components/BucketListClient";

export default async function BucketListPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/auth/signin");

  const initialBucketListPlaces = await getBucketList(userId);

  return (
    <BucketListClient
      userId={userId}
      initialBucketListPlaces={initialBucketListPlaces}
    />
  );
}
