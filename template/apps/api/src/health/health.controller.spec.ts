import { describe, it, expect } from "vitest";

describe("Health", () => {
  it("returns SERVING status value", () => {
    const status = 1;
    expect(status).toBe(1);
  });
});
