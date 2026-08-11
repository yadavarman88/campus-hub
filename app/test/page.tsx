import { getResources } from "@/lib/database";

export default async function TestPage() {
  const resources = await getResources();

  return (
    <pre>{JSON.stringify(resources, null, 2)}</pre>
  );
}