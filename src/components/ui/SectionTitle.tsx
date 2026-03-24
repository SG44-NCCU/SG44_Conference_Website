"use client";
import React from "react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-12 text-center">
      <h2 className="text-3xl font-semibold tracking-wide text-stone-800 tracking-tight">
        {title}
      </h2>
      <div className="mt-3 w-20 h-1 bg-[#53b2e5] mx-auto rounded-full"></div>
      {subtitle && (
        <p className="mt-4 text-stone-500 max-w-2xl mx-auto text-sm md:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
