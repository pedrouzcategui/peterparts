import { jest } from "@jest/globals";
import type { Request, Response } from "express";
import { Brand } from "../../generated/prisma/client";
import type { ProductDTO, ErrorResponse } from "@dto/index";

// Mock the model module before importing
const mockListProducts = jest.fn<any>();
const mockGetProductById = jest.fn<any>();
const mockCreateProduct = jest.fn<any>();
const mockUpdateProduct = jest.fn<any>();
const mockDeleteProduct = jest.fn<any>();

jest.unstable_mockModule("@models/product.model", () => ({
  listProducts: mockListProducts,
  getProductById: mockGetProductById,
  createProduct: mockCreateProduct,
  updateProduct: mockUpdateProduct,
  deleteProduct: mockDeleteProduct,
}));

// Now import the controller
const {
  getAllProducts,
  getProduct,
  createNewProduct,
  updateExistingProduct,
  deleteExistingProduct,
} = await import("@controllers/product.controller");

describe("Product Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn<any>() as any;
    sendMock = jest.fn<any>() as any;
    statusMock = jest.fn<any>().mockReturnThis() as any;

    mockRequest = {
      body: {},
      params: {},
    };

    mockResponse = {
      json: jsonMock,
      status: statusMock,
      send: sendMock,
    } as any;

    jest.clearAllMocks();
  });

  describe("getAllProducts", () => {
    it("should return all products successfully", async () => {
      const mockProducts: ProductDTO[] = [
        {
          id: "1",
          gearId: "gear-1",
          title: "Product 1",
          description: "Description 1",
          brand: Brand.Cuisinart,
          category: "Category 1",
          price: "99.99",
          images: ["image1.jpg"],
          stock: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockListProducts.mockResolvedValue(mockProducts);

      await getAllProducts(
        mockRequest as Request,
        mockResponse as Response<ProductDTO[] | ErrorResponse>,
      );

      expect(mockListProducts).toHaveBeenCalledTimes(1);
      expect(jsonMock).toHaveBeenCalledWith(mockProducts);
      expect(statusMock).not.toHaveBeenCalled();
    });

    it("should return 500 error when listing products fails", async () => {
      mockListProducts.mockRejectedValue(new Error("Database error"));

      await getAllProducts(
        mockRequest as Request,
        mockResponse as Response<ProductDTO[] | ErrorResponse>,
      );

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Failed to list products",
      });
    });
  });

  describe("getProduct", () => {
    it("should return a product by id successfully", async () => {
      const mockProduct: ProductDTO = {
        id: "1",
        gearId: "gear-1",
        title: "Product 1",
        description: "Description 1",
        brand: Brand.Cuisinart,
        category: "Category 1",
        price: "99.99",
        images: ["image1.jpg"],
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { id: "1" };
      mockGetProductById.mockResolvedValue(mockProduct);

      await getProduct(
        mockRequest as Request<{ id: string }>,
        mockResponse as Response<ProductDTO | ErrorResponse>,
      );

      expect(mockGetProductById).toHaveBeenCalledWith("1");
      expect(jsonMock).toHaveBeenCalledWith(mockProduct);
      expect(statusMock).not.toHaveBeenCalled();
    });

    it("should return 404 when product not found", async () => {
      mockRequest.params = { id: "999" };
      mockGetProductById.mockResolvedValue(null);

      await getProduct(
        mockRequest as Request<{ id: string }>,
        mockResponse as Response<ProductDTO | ErrorResponse>,
      );

      expect(mockGetProductById).toHaveBeenCalledWith("999");
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Product not found" });
    });

    it("should return 500 error when fetching product fails", async () => {
      mockRequest.params = { id: "1" };
      mockGetProductById.mockRejectedValue(new Error("Database error"));

      await getProduct(
        mockRequest as Request<{ id: string }>,
        mockResponse as Response<ProductDTO | ErrorResponse>,
      );

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Failed to fetch product",
      });
    });
  });

  describe("createNewProduct", () => {
    it("should create a new product successfully", async () => {
      const newProductData = {
        gearId: "gear-123",
        title: "New Product",
        description: "New Description",
        brand: Brand.Cuisinart,
        category: "New Category",
        price: 149.99,
        images: ["image1.jpg", "image2.jpg"],
        stock: 20,
      };

      const mockCreatedProduct: ProductDTO = {
        id: "1",
        ...newProductData,
        price: "149.99",
        stock: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.body = newProductData;
      mockCreateProduct.mockResolvedValue(mockCreatedProduct);

      await createNewProduct(
        mockRequest as Request,
        mockResponse as Response<ProductDTO | ErrorResponse>,
      );

      expect(mockCreateProduct).toHaveBeenCalledWith(
        expect.objectContaining({
          gearId: "gear-123",
          title: "New Product",
          description: "New Description",
          brand: Brand.Cuisinart,
          category: "New Category",
          price: 149.99,
          images: ["image1.jpg", "image2.jpg"],
          stock: 0,
        }),
      );
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockCreatedProduct);
    });

    it("should return 400 for invalid product payload - missing fields", async () => {
      mockRequest.body = {
        gearId: "gear-123",
        // Missing required fields
      };

      await createNewProduct(
        mockRequest as Request,
        mockResponse as Response<ProductDTO | ErrorResponse>,
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Invalid product payload",
      });
      expect(mockCreateProduct).not.toHaveBeenCalled();
    });

    it("should return 400 for invalid brand", async () => {
      mockRequest.body = {
        gearId: "gear-123",
        title: "New Product",
        description: "Description",
        brand: "InvalidBrand",
        category: "Category",
        price: 99.99,
        images: ["image.jpg"],
        stock: 10,
      };

      await createNewProduct(
        mockRequest as Request,
        mockResponse as Response<ProductDTO | ErrorResponse>,
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Invalid product payload",
      });
      expect(mockCreateProduct).not.toHaveBeenCalled();
    });

    it("should return 400 for invalid images", async () => {
      mockRequest.body = {
        gearId: "gear-123",
        title: "New Product",
        description: "Description",
        brand: Brand.Cuisinart,
        category: "Category",
        price: 99.99,
        images: ["image.jpg", 123], // Invalid: contains non-string
        stock: 10,
      };

      await createNewProduct(
        mockRequest as Request,
        mockResponse as Response<ProductDTO | ErrorResponse>,
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Invalid product payload",
      });
      expect(mockCreateProduct).not.toHaveBeenCalled();
    });

    it("should return 500 error when creation fails", async () => {
      mockRequest.body = {
        gearId: "gear-123",
        title: "New Product",
        description: "Description",
        brand: Brand.Cuisinart,
        category: "Category",
        price: 99.99,
        images: ["image.jpg"],
        stock: 10,
      };

      mockCreateProduct.mockRejectedValue(new Error("Database error"));

      await createNewProduct(
        mockRequest as Request,
        mockResponse as Response<ProductDTO | ErrorResponse>,
      );

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Failed to create product",
      });
    });
  });

  describe("updateExistingProduct", () => {
    it("should update a product successfully", async () => {
      const updateData = {
        title: "Updated Title",
        price: 199.99,
      };

      const mockUpdatedProduct: ProductDTO = {
        id: "1",
        gearId: "gear-1",
        title: "Updated Title",
        description: "Description",
        brand: Brand.Cuisinart,
        category: "Category",
        price: "199.99",
        images: ["image.jpg"],
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { id: "1" };
      mockRequest.body = updateData;
      mockUpdateProduct.mockResolvedValue(mockUpdatedProduct);

      await updateExistingProduct(
        mockRequest as Request<{ id: string }>,
        mockResponse as Response<ProductDTO | ErrorResponse>,
      );

      expect(mockUpdateProduct).toHaveBeenCalledWith("1", {
        title: "Updated Title",
        price: 199.99,
      });
      expect(jsonMock).toHaveBeenCalledWith(mockUpdatedProduct);
      expect(statusMock).not.toHaveBeenCalledWith(400);
    });

    it("should return 400 for invalid brand in update", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = { brand: "InvalidBrand" };

      await updateExistingProduct(
        mockRequest as Request<{ id: string }>,
        mockResponse as Response<ProductDTO | ErrorResponse>,
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Invalid brand" });
      expect(mockUpdateProduct).not.toHaveBeenCalled();
    });

    it("should return 400 for invalid price in update", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = { price: null };

      await updateExistingProduct(
        mockRequest as Request<{ id: string }>,
        mockResponse as Response<ProductDTO | ErrorResponse>,
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Invalid price" });
      expect(mockUpdateProduct).not.toHaveBeenCalled();
    });

    it("should return 400 for invalid images in update", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = { images: ["image.jpg", 123] };

      await updateExistingProduct(
        mockRequest as Request<{ id: string }>,
        mockResponse as Response<ProductDTO | ErrorResponse>,
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Invalid images" });
      expect(mockUpdateProduct).not.toHaveBeenCalled();
    });

    it("should return 400 for invalid stock in update", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = { stock: "invalid" };

      await updateExistingProduct(
        mockRequest as Request<{ id: string }>,
        mockResponse as Response<ProductDTO | ErrorResponse>,
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Invalid stock" });
      expect(mockUpdateProduct).not.toHaveBeenCalled();
    });

    it("should return 400 when no fields to update", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = {};

      await updateExistingProduct(
        mockRequest as Request<{ id: string }>,
        mockResponse as Response<ProductDTO | ErrorResponse>,
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: "No fields to update" });
      expect(mockUpdateProduct).not.toHaveBeenCalled();
    });

    it("should return 404 when product not found (Prisma P2025)", async () => {
      const { Prisma } = await import("../../generated/prisma/client");
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        "Record not found",
        {
          code: "P2025",
          clientVersion: "5.0.0",
        },
      );

      mockRequest.params = { id: "999" };
      mockRequest.body = { title: "Updated Title" };
      mockUpdateProduct.mockRejectedValue(prismaError);

      await updateExistingProduct(
        mockRequest as Request<{ id: string }>,
        mockResponse as Response<ProductDTO | ErrorResponse>,
      );

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Product not found" });
    });

    it("should return 500 error for other update failures", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = { title: "Updated Title" };
      mockUpdateProduct.mockRejectedValue(new Error("Database error"));

      await updateExistingProduct(
        mockRequest as Request<{ id: string }>,
        mockResponse as Response<ProductDTO | ErrorResponse>,
      );

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Failed to update product",
      });
    });
  });

  describe("deleteExistingProduct", () => {
    it("should delete a product successfully", async () => {
      mockRequest.params = { id: "1" };
      mockDeleteProduct.mockResolvedValue(undefined);

      await deleteExistingProduct(
        mockRequest as Request<{ id: string }>,
        mockResponse as Response<void | ErrorResponse>,
      );

      expect(mockDeleteProduct).toHaveBeenCalledWith("1");
      expect(statusMock).toHaveBeenCalledWith(204);
      expect(sendMock).toHaveBeenCalled();
    });

    it("should return 404 when product not found (Prisma P2025)", async () => {
      const { Prisma } = await import("../../generated/prisma/client");
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        "Record not found",
        {
          code: "P2025",
          clientVersion: "5.0.0",
        },
      );

      mockRequest.params = { id: "999" };
      mockDeleteProduct.mockRejectedValue(prismaError);

      await deleteExistingProduct(
        mockRequest as Request<{ id: string }>,
        mockResponse as Response<void | ErrorResponse>,
      );

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Product not found" });
    });

    it("should return 500 error for other delete failures", async () => {
      mockRequest.params = { id: "1" };
      mockDeleteProduct.mockRejectedValue(new Error("Database error"));

      await deleteExistingProduct(
        mockRequest as Request<{ id: string }>,
        mockResponse as Response<void | ErrorResponse>,
      );

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Failed to delete product",
      });
    });
  });
});
