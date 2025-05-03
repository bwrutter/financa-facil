import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createCategory, getCategory } from "./categoryController";

const { mockCategorySave, mockCategoryFind, MockCategoryModel } = vi.hoisted(
  () => {
    const mockCategorySave = vi.fn();
    const mockCategoryFind = vi.fn();

    const MockCategoryModel = vi.fn().mockImplementation((data) => ({
      ...data,
      save: mockCategorySave,
    }));

    MockCategoryModel.find = mockCategoryFind;

    return {
      mockCategorySave,
      mockCategoryFind,
      MockCategoryModel,
    };
  }
);

vi.mock("../models/Category.js", () => {
  return { default: MockCategoryModel };
});

const mockRequest = (body = {}, params = {}, query = {}) => ({
  body,
  params,
  query,
});

const mockResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  return res;
};

describe("Category Controller", () => {
  let req;
  let res;
  let consoleErrorSpy;

  beforeEach(() => {
    vi.clearAllMocks();

    mockCategorySave.mockClear();
    mockCategoryFind.mockClear();
    MockCategoryModel.mockClear();

    mockCategoryFind.mockResolvedValue([]);

    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("createCategory", () => {
    it("should create a category successfully and return 201", async () => {
      const categoryData = { name: "Work", userId: "user123" };
      req = mockRequest(categoryData);
      res = mockResponse();

      const createdCategory = { _id: "categoryId1", ...categoryData };
      mockCategorySave.mockResolvedValue(createdCategory);

      await createCategory(req, res);

      expect(MockCategoryModel).toHaveBeenCalledTimes(1);
      expect(MockCategoryModel).toHaveBeenCalledWith(categoryData);
      expect(mockCategorySave).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      /*       expect(res.json).toHaveBeenCalledWith({
        message: 'category criada com sucesso',
        category: createdCategory,
      }); */
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should return 500 if saving fails", async () => {
      const categoryData = { name: "Home", userId: "user456" };
      req = mockRequest(categoryData);
      res = mockResponse();

      const saveError = new Error("Database save failed");
      mockCategorySave.mockRejectedValue(saveError);

      await createCategory(req, res);

      expect(MockCategoryModel).toHaveBeenCalledTimes(1);
      expect(mockCategorySave).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erro ao criar category",
      });
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe("getCategory", () => {
    it("should return all categories successfully", async () => {
      req = mockRequest();
      res = mockResponse();
      const mockCategories = [
        { _id: "cat1", name: "Work", userId: "user123" },
        { _id: "cat2", name: "Personal", userId: "user123" },
      ];

      mockCategoryFind.mockResolvedValue(mockCategories);

      await getCategory(req, res);

      expect(mockCategoryFind).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(mockCategories);
      expect(res.status).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should return an empty array if no categories are found", async () => {
      req = mockRequest();
      res = mockResponse();

      mockCategoryFind.mockResolvedValue([]);

      await getCategory(req, res);

      expect(mockCategoryFind).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith([]);
      expect(res.status).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should return 500 on find error", async () => {
      req = mockRequest();
      res = mockResponse();
      const findError = new Error("Database connection failed");

      mockCategoryFind.mockRejectedValue(findError);

      await getCategory(req, res);

      expect(mockCategoryFind).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erro ao buscar categories",
      });
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Erro ao buscar categories:",
        findError.message
      );
    });
  });
});
