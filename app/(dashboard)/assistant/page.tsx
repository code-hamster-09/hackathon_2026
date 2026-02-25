import { Suspense } from "react";
import AssistantClient from "./AssistantClient";

export default function AssistantPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading assistant...</div>}>
      <AssistantClient />
    </Suspense>
  );
}