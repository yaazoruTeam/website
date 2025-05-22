import request from "supertest";
import express from "express";
import {
  createBranchCustomer,
  getAllBranchCustomer,
  getBranchCustomerById,
  getBranchCustomerByCustomer_id,
  getBranchCustomerByBranch_id,
  updateBranchCustomer,
  deleteBranchCustomer,
} from "../../controller/branchCustomer";
import * as db from "../../db";
import { BranchCustomer } from "../../model";

jest.mock("../../db");
jest.mock("../../model");

const app = express();
app.use(express.json());
app.post("/branchCustomer", createBranchCustomer);
app.get("/branchCustomer", getAllBranchCustomer);
app.get("/branchCustomer/:id", getBranchCustomerById);
app.get("/branchCustomer/branch/:branch_id", getBranchCustomerByBranch_id);
app.get(
  "/branchCustomer/customer/:customer_id",
  getBranchCustomerByCustomer_id
);
app.put("/branchCustomer/:id", updateBranchCustomer);
app.delete("/branchCustomer/:id", deleteBranchCustomer);

describe("BranchCustomer Controller", () => {
  const mockBranchCustomer = {
    branchCustomer_id: "1",
    branch_id: "1",
    customer_id: "1",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("createBranchCustomer", () => {
    it("should create branchCustomer successfully", async () => {
      (BranchCustomer.sanitizeBodyExisting as jest.Mock).mockImplementation(
        () => {}
      );
      (BranchCustomer.sanitize as jest.Mock).mockReturnValue(
        mockBranchCustomer
      );

      (db.Branch.doesBranchExist as jest.Mock).mockResolvedValue(true);
      (db.Customer.doesCustomerExist as jest.Mock).mockResolvedValue(true);
      (
        db.BranchCustomer.doesBranchCustomerCombinationExist as jest.Mock
      ).mockResolvedValue(false);
      (db.BranchCustomer.createBranchCustomer as jest.Mock).mockResolvedValue(
        mockBranchCustomer
      );

      const res = await request(app)
        .post("/branchCustomer")
        .send(mockBranchCustomer);

      expect(res.status).toBe(201);
      expect(res.body.branch_id).toBe("1");
    });

    it("should handle validation error", async () => {
      (BranchCustomer.sanitizeBodyExisting as jest.Mock).mockImplementation(
        () => {
          throw { status: 400, message: "No body provided" };
        }
      );

      const res = await request(app).post("/branchCustomer").send({});
      expect(res.status).toBe(400);
    });

    it("should handle general error", async () => {
      (BranchCustomer.sanitizeBodyExisting as jest.Mock).mockImplementation(
        () => {}
      );
      (BranchCustomer.sanitize as jest.Mock).mockImplementation(() => {
        throw new Error("fail");
      });

      const res = await request(app)
        .post("/branchCustomer")
        .send(mockBranchCustomer);
      expect(res.status).toBe(500);
    });
  });

  describe("getAllBranchCustomer", () => {
    it("should return all branchCustomers", async () => {
      (db.BranchCustomer.getAllBranchCustomer as jest.Mock).mockResolvedValue([
        mockBranchCustomer,
      ]);
      const res = await request(app).get("/branchCustomer");
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it("should handle DB error", async () => {
      (db.BranchCustomer.getAllBranchCustomer as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      const res = await request(app).get("/branchCustomer");
      expect(res.status).toBe(500);
    });
  });

  describe("getBranchCustomerById", () => {
    it("should return branchCustomer by id", async () => {
      (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(
        () => {}
      );
      (
        db.BranchCustomer.doesBranchCustomerExist as jest.Mock
      ).mockResolvedValue(true);
      (db.BranchCustomer.getBranchCustomerById as jest.Mock).mockResolvedValue(
        mockBranchCustomer
      );

      const res = await request(app).get("/branchCustomer/1");
      expect(res.status).toBe(200);
      expect(res.body.branchCustomer_id).toBe("1");
    });

    it("should return 404 if not found", async () => {
      (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(
        () => {}
      );
      (
        db.BranchCustomer.doesBranchCustomerExist as jest.Mock
      ).mockResolvedValue(false);

      const res = await request(app).get("/branchCustomer/1");
      expect(res.status).toBe(404);
    });

    it("should handle general error", async () => {
      (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(
        () => {
          throw new Error("fail");
        }
      );

      const res = await request(app).get("/branchCustomer/1");
      expect(res.status).toBe(500);
    });
  });

  describe("getBranchCustomerByBranch_id", () => {
    it("should return branchCustomers by branch_id", async () => {
      (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(
        () => {}
      );
      (db.BranchCustomer.doesBranchExist as jest.Mock).mockResolvedValue(true);
      (
        db.BranchCustomer.getBranchCustomerByBranch_id as jest.Mock
      ).mockResolvedValue([mockBranchCustomer]);

      const res = await request(app).get("/branchCustomer/branch/1");
      expect(res.status).toBe(200);
      expect(res.body[0].branch_id).toBe("1");
    });

    it("should return 404 if none found", async () => {
      (
        db.BranchCustomer.getBranchCustomerByBranch_id as jest.Mock
      ).mockResolvedValue([]);
      const res = await request(app).get("/branchCustomer/branch/1");
      expect(res.status).toBe(404);
    });

    it("should handle general error", async () => {
      (
        db.BranchCustomer.getBranchCustomerByBranch_id as jest.Mock
      ).mockRejectedValue(new Error("fail"));
      const res = await request(app).get("/branchCustomer/branch/1");
      expect(res.status).toBe(500);
    });
  });

  describe("getBranchCustomerByCustomer_id", () => {
    it("should return branchCustomers by customer_id", async () => {
      (db.BranchCustomer.doesCustomerExist as jest.Mock).mockResolvedValue(
        true
      );

      (
        db.BranchCustomer.getBranchCustomerByCustomer_id as jest.Mock
      ).mockResolvedValue([mockBranchCustomer]);

      const res = await request(app).get("/branchCustomer/customer/1");
      expect(res.status).toBe(200);
      expect(res.body[0].customer_id).toBe("1");
    });

    it("should return 404 if none found", async () => {
      (
        db.BranchCustomer.getBranchCustomerByCustomer_id as jest.Mock
      ).mockResolvedValue([]);
      const res = await request(app).get("/branchCustomer/customer/c1");
      expect(res.status).toBe(404);
    });

    it("should handle general error", async () => {
      (
        db.BranchCustomer.getBranchCustomerByCustomer_id as jest.Mock
      ).mockRejectedValue(new Error("fail"));
      const res = await request(app).get("/branchCustomer/customer/c1");
      expect(res.status).toBe(500);
    });
  });

  describe("updateBranchCustomer", () => {
    it("should update branchCustomer successfully", async () => {
      (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(
        () => {}
      );
      (BranchCustomer.sanitizeBodyExisting as jest.Mock).mockImplementation(
        () => {}
      );
      (BranchCustomer.sanitize as jest.Mock).mockReturnValue(
        mockBranchCustomer
      );
      (db.BranchCustomer.updateBranchCustomer as jest.Mock).mockResolvedValue({
        ...mockBranchCustomer,
        branch_id: "2",
      });

      const res = await request(app)
        .put("/branchCustomer/1")
        .send(mockBranchCustomer);
      expect(res.status).toBe(200);
      expect(res.body.branch_id).toBe("2");
    });

    it("should return 404 if not found", async () => {
      (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(
        () => {}
      );
      (BranchCustomer.sanitizeBodyExisting as jest.Mock).mockImplementation(
        () => {}
      );
      (BranchCustomer.sanitize as jest.Mock).mockReturnValue(
        mockBranchCustomer
      );
      (db.BranchCustomer.updateBranchCustomer as jest.Mock).mockImplementation(
        () => {
          throw { status: 404, message: "branchCustomer not found" };
        }
      );

      const res = await request(app)
        .put("/branchCustomer/1")
        .send(mockBranchCustomer);
      expect(res.status).toBe(404);
    });

    it("should handle general error", async () => {
      (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(
        () => {}
      );
      (BranchCustomer.sanitizeBodyExisting as jest.Mock).mockImplementation(
        () => {}
      );
      (BranchCustomer.sanitize as jest.Mock).mockReturnValue(
        mockBranchCustomer
      );
      (db.BranchCustomer.updateBranchCustomer as jest.Mock).mockRejectedValue(
        new Error("fail")
      );

      const res = await request(app)
        .put("/branchCustomer/1")
        .send(mockBranchCustomer);
      expect(res.status).toBe(500);
    });
  });

  describe("deleteBranchCustomer", () => {
    it("should delete branchCustomer successfully", async () => {
      (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(
        () => {}
      );

      (
        db.BranchCustomer.doesBranchCustomerExist as jest.Mock
      ).mockResolvedValue(true); // ✅ זו השורה החשובה!

      (db.BranchCustomer.deleteBranchCustomer as jest.Mock).mockResolvedValue(
        mockBranchCustomer
      );

      const res = await request(app).delete("/branchCustomer/1");
      expect(res.status).toBe(200);
      expect(res.body.branchCustomer_id).toBe("1");
    });

    it("should return 404 if not found", async () => {
      (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(
        () => {}
      );
      (db.BranchCustomer.deleteBranchCustomer as jest.Mock).mockImplementation(
        () => {
          throw { status: 404, message: "BranchCustomer not found" };
        }
      );

      const res = await request(app).delete("/branchCustomer/1");
      expect(res.status).toBe(404);
    });

    it("should handle general error", async () => {
      (BranchCustomer.sanitizeIdExisting as jest.Mock).mockImplementation(
        () => {
          throw new Error("fail");
        }
      );

      const res = await request(app).delete("/branchCustomer/1");
      expect(res.status).toBe(500);
    });
  });
});
