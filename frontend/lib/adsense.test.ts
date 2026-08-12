import { afterEach, describe, expect, it, vi } from "vitest";

import { getAdSensePublisherId } from "./adsense";

const publisherIdEnvironmentVariable = "NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getAdSensePublisherId", () => {
  it("returns null when the publisher ID is empty", () => {
    vi.stubEnv(publisherIdEnvironmentVariable, "   ");

    expect(getAdSensePublisherId()).toBeNull();
  });

  it("returns a trimmed publisher ID when the format is valid", () => {
    const validFormatPublisherId = `ca-pub-${"1".repeat(16)}`;
    vi.stubEnv(publisherIdEnvironmentVariable, ` ${validFormatPublisherId} `);

    expect(getAdSensePublisherId()).toBe(validFormatPublisherId);
  });

  it("throws when the publisher ID format is invalid", () => {
    vi.stubEnv(publisherIdEnvironmentVariable, "publisher-id");

    expect(() => getAdSensePublisherId()).toThrow(/ca-pub-/);
  });
});
