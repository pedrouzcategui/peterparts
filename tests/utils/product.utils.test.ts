import { Brand, Prisma } from "../../generated/prisma/client";
import {
  isBrand,
  isKnownPrismaNotFound,
  normalizeImages,
  normalizePrice,
  normalizeStock,
} from "@utils/index";

describe("Product Utils", () => {
  describe("isBrand", () => {
    it("should return true for valid Cuisinart brand", () => {
      expect(isBrand(Brand.Cuisinart)).toBe(true);
    });

    it("should return true for valid Kitchenaid brand", () => {
      expect(isBrand(Brand.Kitchenaid)).toBe(true);
    });

    it("should return false for invalid brand string", () => {
      expect(isBrand("InvalidBrand")).toBe(false);
    });

    it("should return false for non-string values", () => {
      expect(isBrand(123)).toBe(false);
      expect(isBrand(null)).toBe(false);
      expect(isBrand(undefined)).toBe(false);
      expect(isBrand({})).toBe(false);
    });
  });

  describe("normalizePrice", () => {
    it("should return valid number as-is", () => {
      expect(normalizePrice(99.99)).toBe(99.99);
      expect(normalizePrice(0)).toBe(0);
      expect(normalizePrice(1000)).toBe(1000);
    });

    it("should trim and return valid string", () => {
      expect(normalizePrice("  99.99  ")).toBe("99.99");
      expect(normalizePrice("50")).toBe("50");
    });

    it("should return null for invalid values", () => {
      expect(normalizePrice("")).toBe(null);
      expect(normalizePrice("   ")).toBe(null);
      expect(normalizePrice(NaN)).toBe(null);
      expect(normalizePrice(Infinity)).toBe(null);
      expect(normalizePrice(null)).toBe(null);
      expect(normalizePrice(undefined)).toBe(null);
      expect(normalizePrice({})).toBe(null);
    });
  });

  describe("normalizeImages", () => {
    it("should return valid array of strings", () => {
      const images = ["image1.jpg", "image2.jpg"];
      expect(normalizeImages(images)).toEqual(images);
    });

    it("should return empty array for empty input", () => {
      expect(normalizeImages([])).toEqual([]);
    });

    it("should return null for non-array values", () => {
      expect(normalizeImages("not an array")).toBe(null);
      expect(normalizeImages(123)).toBe(null);
      expect(normalizeImages(null)).toBe(null);
      expect(normalizeImages(undefined)).toBe(null);
      expect(normalizeImages({})).toBe(null);
    });

    it("should return null for arrays containing non-string values", () => {
      expect(normalizeImages(["image1.jpg", 123])).toBe(null);
      expect(normalizeImages([null, "image1.jpg"])).toBe(null);
      expect(normalizeImages([{}, "image1.jpg"])).toBe(null);
    });
  });

  describe("normalizeStock", () => {
    it("should return undefined for undefined input", () => {
      expect(normalizeStock(undefined)).toBe(undefined);
    });

    it("should truncate and return valid numbers", () => {
      expect(normalizeStock(10)).toBe(10);
      expect(normalizeStock(0)).toBe(0);
      expect(normalizeStock(10.7)).toBe(10);
      expect(normalizeStock(99.99)).toBe(99);
    });

    it("should parse and return valid string numbers", () => {
      expect(normalizeStock("10")).toBe(10);
      expect(normalizeStock("0")).toBe(0);
      expect(normalizeStock("100")).toBe(100);
    });

    it("should return null for invalid values", () => {
      expect(normalizeStock(NaN)).toBe(null);
      expect(normalizeStock(Infinity)).toBe(null);
      expect(normalizeStock("not a number")).toBe(null);
      expect(normalizeStock("")).toBe(null);
      expect(normalizeStock(null)).toBe(null);
      expect(normalizeStock({})).toBe(null);
    });
  });

  describe("isKnownPrismaNotFound", () => {
    it("should return true for Prisma P2025 error", () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        "Record not found",
        {
          code: "P2025",
          clientVersion: "5.0.0",
        },
      );
      expect(isKnownPrismaNotFound(error)).toBe(true);
    });

    it("should return false for other Prisma error codes", () => {
      const error = new Prisma.PrismaClientKnownRequestError("Other error", {
        code: "P2002",
        clientVersion: "5.0.0",
      });
      expect(isKnownPrismaNotFound(error)).toBe(false);
    });

    it("should return false for non-Prisma errors", () => {
      expect(isKnownPrismaNotFound(new Error("Regular error"))).toBe(false);
      expect(isKnownPrismaNotFound("string error")).toBe(false);
      expect(isKnownPrismaNotFound(null)).toBe(false);
      expect(isKnownPrismaNotFound(undefined)).toBe(false);
    });
  });
});
