import { describe, expect, it } from "vitest";

import { getAllGuides, getRelatedGuides } from "./guides";

describe("getRelatedGuides", () => {
  it("excludes the current guide and respects the requested limit", () => {
    const guide = getAllGuides()[0];
    const relatedGuides = getRelatedGuides(guide, 2);

    expect(relatedGuides).toHaveLength(2);
    expect(relatedGuides.every((candidate) => candidate.slug !== guide.slug)).toBe(true);
  });

  it("prefers guides with more shared tags", () => {
    const guide = getAllGuides().find((candidate) => candidate.slug === "30-second-self-introduction");
    expect(guide).toBeDefined();

    const relatedGuides = getRelatedGuides(guide!, 3);
    const sharedTagCounts = relatedGuides.map(
      (candidate) => candidate.tags.filter((tag) => guide!.tags.includes(tag)).length,
    );

    expect(sharedTagCounts).toEqual([...sharedTagCounts].sort((left, right) => right - left));
  });
});
