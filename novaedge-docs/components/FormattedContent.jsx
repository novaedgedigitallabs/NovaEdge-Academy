"use client";

import React from "react";

function parseInline(text) {
  if (!text) return null;

  const parts = [];
  let lastIndex = 0;
  // Match **bold** or `code`
  const regex = /(\*\*(.*?)\*\*|`([^`]+)`)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    if (match[1].startsWith("**")) {
      parts.push(
        <strong key={match.index} className="font-bold text-foreground">
          {match[2]}
        </strong>
      );
    } else if (match[1].startsWith("`")) {
      parts.push(
        <code
          key={match.index}
          className="bg-secondary/80 text-primary font-mono text-[11px] px-1.5 py-0.5 rounded border border-white/10"
        >
          {match[3]}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

export default function FormattedContent({ content }) {
  if (!content) return null;

  // Split lines
  const lines = content.split("\n");
  const elements = [];
  let currentList = null; // { type: 'ul' | 'ol', items: [] }

  const flushList = (key) => {
    if (!currentList) return;
    if (currentList.type === "ul") {
      elements.push(
        <ul key={`ul-${key}`} className="space-y-2 my-3 pl-1">
          {currentList.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <div>{parseInline(item)}</div>
            </li>
          ))}
        </ul>
      );
    } else if (currentList.type === "ol") {
      elements.push(
        <ol key={`ol-${key}`} className="space-y-2 my-3 pl-1">
          {currentList.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <span className="font-mono text-xs font-bold text-primary shrink-0 mt-0.5">
                {idx + 1}.
              </span>
              <div>{parseInline(item)}</div>
            </li>
          ))}
        </ol>
      );
    }
    currentList = null;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList(index);
      return;
    }

    // Check unordered list (- or *)
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const itemText = trimmed.substring(2);
      if (!currentList || currentList.type !== "ul") {
        flushList(index);
        currentList = { type: "ul", items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      return;
    }

    // Check ordered list (1. 2. etc.)
    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (olMatch) {
      const itemText = olMatch[2];
      if (!currentList || currentList.type !== "ol") {
        flushList(index);
        currentList = { type: "ol", items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      return;
    }

    // Regular paragraph
    flushList(index);
    elements.push(
      <p key={`p-${index}`} className="text-xs sm:text-sm text-slate-300 leading-relaxed my-2">
        {parseInline(trimmed)}
      </p>
    );
  });

  flushList("final");

  return <div className="space-y-2">{elements}</div>;
}
