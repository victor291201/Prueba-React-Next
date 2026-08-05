import { formatDate, formatQuantity } from "@/utils/formatters";

describe("formatDate", () => {
  it("formats a valid ISO date", () => {
    const result = formatDate("2024-06-15T10:30:00.000Z");
    expect(result).toContain("2024");
    expect(result).toContain("jun");
  });

  it("returns a fallback for invalid dates", () => {
    expect(formatDate("not-a-date")).toBe("Fecha no disponible");
  });
});

describe("formatQuantity", () => {
  it("formats numbers with the es-ES locale", () => {
    expect(formatQuantity(1234)).toBe("1.234");
  });

  it("formats zero", () => {
    expect(formatQuantity(0)).toBe("0");
  });
});
