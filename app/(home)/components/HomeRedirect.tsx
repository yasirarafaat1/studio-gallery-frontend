"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "../../lib/auth";

export default function HomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    if (user?.role === "client") {
      router.replace("/gallery");
    }
  }, [router]);

  return null;
}
