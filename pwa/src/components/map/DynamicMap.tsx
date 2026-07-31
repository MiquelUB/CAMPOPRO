"use client";

import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-100 rounded-md animate-pulse"></div>,
});

export default DynamicMap;
