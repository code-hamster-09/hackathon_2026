"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const AssistantClient = dynamic(() => import("./AssistantClient"), {
  ssr: false,
  loading: () => <div className="p-6">Loading assistant...</div>,
});

export default function AssistantPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading assistant...</div>}>
      <AssistantClient />
    </Suspense>
  );
}
