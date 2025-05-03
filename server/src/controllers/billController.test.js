import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createBills,
  getBills,
  getBillById,
  updateBill,
  deleteBill,
} from "./billsController";

const {
  mockSave,
  mockFind,
  mockFindById,
  mockFindByIdAndUpdate,
  mockFindByIdAndDelete,
  mockPopulate,
  queryChainingMock,
} = vi.hoisted(() => {
  const mockSave = vi.fn();
  const mockFind = vi.fn();
  const mockFindById = vi.fn();
  const mockFindByIdAndUpdate = vi.fn();
  const mockFindByIdAndDelete = vi.fn();
  const mockPopulate = vi.fn();

  const queryChainingMock = {
    populate: mockPopulate,
  };

  mockFind.mockReturnValue(queryChainingMock);
  mockFindById.mockReturnValue(queryChainingMock);

  mockFindByIdAndUpdate.mockResolvedValue(null);
  mockFindByIdAndDelete.mockResolvedValue(null);

  mockPopulate.mockImplementation(function () {
    return this;
  });

  return {
    mockSave,
    mockFind,
    mockFindById,
    mockFindByIdAndUpdate,
    mockFindByIdAndDelete,
    mockPopulate,
    queryChainingMock,
  };
});

vi.mock("../models/Bills.js", () => {
  const MockBills = vi.fn().mockImplementation((data) => ({
    ...data,
    save: mockSave,
  }));

  MockBills.find = mockFind;
  MockBills.findById = mockFindById;
  MockBills.findByIdAndUpdate = mockFindByIdAndUpdate;
  MockBills.findByIdAndDelete = mockFindByIdAndDelete;

  return { default: MockBills };
});

import Bills from "../models/Bills.js";

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

describe("Bill Controller", () => {
  let req;
  let res;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSave.mockClear();
    mockFind.mockClear().mockReturnValue(queryChainingMock);
    mockFindById.mockClear().mockReturnValue(queryChainingMock);
    mockFindByIdAndUpdate.mockClear().mockResolvedValue(null);
    mockFindByIdAndDelete.mockClear().mockResolvedValue(null);
    mockPopulate.mockClear().mockImplementation(function () {
      return this;
    });
  });

  describe("createBills", () => {
    it("should create a bill successfully and return 201", async () => {
      const billData = {
        name: "Test Bill",
        value: 100,
        installments: 1,
        installmentsPayed: 0,
        isRecurring: false,
        nextPaymentDate: new Date(),
        description: "Test Desc",
        category: "test-category-id",
      };
      req = mockRequest(billData);
      res = mockResponse();

      const createdBill = { _id: "mockId", ...billData };
      mockSave.mockResolvedValue(createdBill);

      await createBills(req, res);

      expect(Bills).toHaveBeenCalledTimes(1);
      expect(Bills).toHaveBeenCalledWith(billData);
      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      /*       expect(res.json).toHaveBeenCalledWith({
        message: 'Bill created successfully',
        bills: createdBill,
      }); */
    });

    it("should return 500 if saving fails", async () => {
      const billData = { name: "Test Bill", value: 50 };
      req = mockRequest(billData);
      res = mockResponse();
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const saveError = new Error("Database save failed");
      mockSave.mockRejectedValue(saveError);

      await createBills(req, res);

      expect(Bills).toHaveBeenCalledTimes(1);
      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
      expect(consoleErrorSpy).toHaveBeenCalledWith(saveError);

      consoleErrorSpy.mockRestore();
    });
  });

  // --- Testes para getBills ---
  describe("getBills", () => {
    it("should return all bills with populated category", async () => {
      req = mockRequest();
      res = mockResponse();
      const mockBills = [
        {
          _id: "1",
          name: "Bill 1",
          category: { _id: "cat1", name: "Category 1" },
        },
        {
          _id: "2",
          name: "Bill 2",
          category: { _id: "cat2", name: "Category 2" },
        },
      ];

      mockPopulate.mockResolvedValue(mockBills);

      await getBills(req, res);

      expect(mockFind).toHaveBeenCalledTimes(1);
      expect(mockPopulate).toHaveBeenCalledTimes(1);
      expect(mockPopulate).toHaveBeenCalledWith("category");
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockBills);
    });

    it("should return 500 on generic find error", async () => {
      req = mockRequest();
      res = mockResponse();
      const findError = new Error("DB Connection Lost");
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockPopulate.mockRejectedValue(findError);

      await getBills(req, res);

      expect(mockFind).toHaveBeenCalledTimes(1);
      expect(mockPopulate).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erro interno no servidor",
      });
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it("should return 400 on StrictPopulateError", async () => {
      req = mockRequest();
      res = mockResponse();
      const populateError = new Error(
        "Cannot populate path `invalidPath` because it is not in your schema."
      );
      populateError.name = "StrictPopulateError";
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockPopulate.mockRejectedValue(populateError);

      await getBills(req, res);

      expect(mockFind).toHaveBeenCalledTimes(1);
      expect(mockPopulate).toHaveBeenCalledWith("category");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: populateError.message });
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("getBillById", () => {
    it("should return a bill by id with populated category", async () => {
      const billId = "mockBillId";
      req = mockRequest({}, { id: billId }); // req.params.id
      res = mockResponse();
      const mockBill = {
        _id: billId,
        name: "Specific Bill",
        category: { _id: "cat1", name: "Category 1" },
      };

      mockPopulate.mockResolvedValue(mockBill);

      await getBillById(req, res);

      expect(mockFindById).toHaveBeenCalledTimes(1);
      expect(mockFindById).toHaveBeenCalledWith(billId);
      expect(mockPopulate).toHaveBeenCalledTimes(1);
      expect(mockPopulate).toHaveBeenCalledWith("category");
      expect(res.json).toHaveBeenCalledWith(mockBill);
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should return 404 if bill not found", async () => {
      const billId = "nonExistentId";
      req = mockRequest({}, { id: billId });
      res = mockResponse();

      mockPopulate.mockResolvedValue(null);

      await getBillById(req, res);

      expect(mockFindById).toHaveBeenCalledTimes(1);
      expect(mockFindById).toHaveBeenCalledWith(billId);
      expect(mockPopulate).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Bill not found" });
    });

    it("should return 500 on findById error", async () => {
      const billId = "errorId";
      req = mockRequest({}, { id: billId });
      res = mockResponse();
      const dbError = new Error("FindById failed");
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockPopulate.mockRejectedValue(dbError);

      await getBillById(req, res);

      expect(mockFindById).toHaveBeenCalledTimes(1);
      expect(mockFindById).toHaveBeenCalledWith(billId);
      expect(mockPopulate).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
      expect(consoleErrorSpy).toHaveBeenCalledWith(dbError);

      consoleErrorSpy.mockRestore();
    });
  });

  describe("updateBill", () => {
    it("should update a bill successfully", async () => {
      const billId = "updatableId";
      const updateData = { name: "Updated Name", value: 150 };
      const updatedBill = { _id: billId, ...updateData, category: "cat1" };
      req = mockRequest(updateData, { id: billId });
      res = mockResponse();

      mockFindByIdAndUpdate.mockResolvedValue(updatedBill);

      await updateBill(req, res);

      expect(mockFindByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(billId, updateData, {
        new: true,
      });
      expect(res.json).toHaveBeenCalledWith({
        message: "Bill updated successfully",
        updatedBill: updatedBill,
      });
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should return 404 if bill to update is not found", async () => {
      const billId = "nonExistentId";
      const updateData = { name: "Updated Name" };
      req = mockRequest(updateData, { id: billId });
      res = mockResponse();

      mockFindByIdAndUpdate.mockResolvedValue(null);

      await updateBill(req, res);

      expect(mockFindByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(billId, updateData, {
        new: true,
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Bill not found" });
    });

    it("should return 500 on update error", async () => {
      const billId = "errorId";
      const updateData = { name: "Updated Name" };
      req = mockRequest(updateData, { id: billId });
      res = mockResponse();
      const updateError = new Error("Update failed");
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockFindByIdAndUpdate.mockRejectedValue(updateError);

      await updateBill(req, res);

      expect(mockFindByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
      expect(consoleErrorSpy).toHaveBeenCalledWith(updateError);

      consoleErrorSpy.mockRestore();
    });
  });

  describe("deleteBill", () => {
    it("should delete a bill successfully", async () => {
      const billId = "deletableId";
      req = mockRequest({}, { id: billId });
      res = mockResponse();

      mockFindByIdAndDelete.mockResolvedValue({
        _id: billId,
        name: "Deleted Bill",
      });

      await deleteBill(req, res);

      expect(mockFindByIdAndDelete).toHaveBeenCalledTimes(1);
      expect(mockFindByIdAndDelete).toHaveBeenCalledWith(billId);
      expect(res.json).toHaveBeenCalledWith({
        message: "Bill deleted successfully",
      });
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should return success even if bill to delete is not found (current behavior)", async () => {
      const billId = "nonExistentId";
      req = mockRequest({}, { id: billId });
      res = mockResponse();

      mockFindByIdAndDelete.mockResolvedValue(null);

      await deleteBill(req, res);

      expect(mockFindByIdAndDelete).toHaveBeenCalledTimes(1);
      expect(mockFindByIdAndDelete).toHaveBeenCalledWith(billId);
      expect(res.json).toHaveBeenCalledWith({
        message: "Bill deleted successfully",
      });
    });

    it("should return 500 on delete error", async () => {
      const billId = "errorId";
      req = mockRequest({}, { id: billId });
      res = mockResponse();
      const deleteError = new Error("Deletion failed");
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockFindByIdAndDelete.mockRejectedValue(deleteError);

      await deleteBill(req, res);

      expect(mockFindByIdAndDelete).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
      //expect(consoleErrorSpy).toHaveBeenCalledWith(deleteError);

      consoleErrorSpy.mockRestore();
    });
  });
});
