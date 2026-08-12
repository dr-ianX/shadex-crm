import { Request, Response } from "express";
import { prisma } from "../db.js";
import { InventoryItemSchema, inventoryItemToDTO } from "../schemas/inventory.schema.js";

/**
 * Controlador para la gestión de inventario (Inventory)
 */
export const inventoryController = {
  /**
   * Obtener todos los items de inventario con filtros opcionales
   */
  getAll: async (req: Request, res: Response) => {
    try {
      const { search, status } = req.query;

      let items = await prisma.inventoryItem.findMany({
        include: {
          supplier: true,
          movements: {
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
        orderBy: { createdAt: "desc" },
      });

      // Filtrado por búsqueda
      if (search) {
        const searchLower = String(search).toLowerCase();
        items = items.filter(
          (item) =>
            item.name.toLowerCase().includes(searchLower) ||
            item.description?.toLowerCase().includes(searchLower) ||
            item.sku?.toLowerCase().includes(searchLower)
        );
      }

      // Filtrado por estado
      if (status) {
        const statusLower = String(status).toLowerCase();
        items = items.filter((item) =>
          item.status.toLowerCase() === statusLower
        );
      }

      res.json({
        success: true,
        count: items.length,
        data: items.map(inventoryItemToDTO),
      });
    } catch (error) {
      console.error("Error en getAll inventory:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener items de inventario",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  /**
   * Obtener un item de inventario por ID
   */
  getById: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const item = await prisma.inventoryItem.findUnique({
        where: { id },
        include: {
          supplier: true,
          movements: {
            orderBy: { createdAt: "desc" },
            take: 20,
          },
        },
      });

      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Item de inventario no encontrado",
        });
      }

      res.json({
        success: true,
        data: inventoryItemToDTO(item),
      });
    } catch (error) {
      console.error("Error en getById inventory:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener item de inventario",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  /**
   * Crear un nuevo item de inventario
   */
  create: async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const parsed = InventoryItemSchema.parse(body);

      // Verificar si el proveedor existe
      if (parsed.supplierId) {
        const supplierExists = await prisma.supplier.findUnique({
          where: { id: parsed.supplierId },
        });

        if (!supplierExists) {
          return res.status(400).json({
            success: false,
            message: "Proveedor no encontrado",
          });
        }
      }

      const item = await prisma.inventoryItem.create({
        data: parsed,
        include: {
          supplier: true,
        },
      });

      res.status(201).json({
        success: true,
        data: inventoryItemToDTO(item),
      });
    } catch (error) {
      console.error("Error en create inventory:", error);
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Datos inválidos",
          errors: error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }
      res.status(500).json({
        success: false,
        message: "Error al crear item de inventario",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  /**
   * Actualizar un item de inventario
   */
  update: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const body = req.body;
      const parsed = InventoryItemSchema.partial().parse(body);

      // Verificar si el proveedor existe
      if (parsed.supplierId) {
        const supplierExists = await prisma.supplier.findUnique({
          where: { id: parsed.supplierId },
        });

        if (!supplierExists) {
          return res.status(400).json({
            success: false,
            message: "Proveedor no encontrado",
          });
        }
      }

      const item = await prisma.inventoryItem.update({
        where: { id },
        data: parsed,
        include: {
          supplier: true,
        },
      });

      res.json({
        success: true,
        data: inventoryItemToDTO(item),
      });
    } catch (error) {
      console.error("Error en update inventory:", error);
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
        return res.status(404).json({
          success: false,
          message: "Item de inventario no encontrado",
        });
      }
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Datos inválidos",
          errors: error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }
      res.status(500).json({
        success: false,
        message: "Error al actualizar item de inventario",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  /**
   * Eliminar un item de inventario
   */
  delete: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;

      // Verificar si tiene movimientos asociados
      const hasMovements = await prisma.inventoryMovement.count({
        where: { itemId: id },
      });

      if (hasMovements > 0) {
        return res.status(400).json({
          success: false,
          message: "No se puede eliminar un item con movimientos asociados",
        });
      }

      await prisma.inventoryItem.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: "Item de inventario eliminado correctamente",
      });
    } catch (error) {
      console.error("Error en delete inventory:", error);
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
        return res.status(404).json({
          success: false,
          message: "Item de inventario no encontrado",
        });
      }
      res.status(500).json({
        success: false,
        message: "Error al eliminar item de inventario",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  /**
   * Registrar un movimiento de inventario (entrada/salida)
   */
  registerMovement: async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const parsed = InventoryMovementSchema.parse(body);

      // Verificar que el item existe
      const itemExists = await prisma.inventoryItem.findUnique({
        where: { id: parsed.itemId },
      });

      if (!itemExists) {
        return res.status(404).json({
          success: false,
          message: "Item de inventario no encontrado",
        });
      }

      // Verificar que el proveedor existe si se proporciona
      if (parsed.supplierId) {
        const supplierExists = await prisma.supplier.findUnique({
          where: { id: parsed.supplierId },
        });

        if (!supplierExists) {
          return res.status(400).json({
            success: false,
            message: "Proveedor no encontrado",
          });
        }
      }

      const movement = await prisma.inventoryMovement.create({
        data: parsed,
        include: {
          item: true,
          supplier: true,
        },
      });

      // Actualizar el stock del item
      await prisma.inventoryItem.update({
        where: { id: parsed.itemId },
        data: {
          quantity: itemExists.quantity + parsed.quantity,
          status: parsed.quantity < 0
            ? "low-stock"
            : itemExists.quantity + parsed.quantity < 5
              ? "low-stock"
              : "in-stock",
        },
      });

      res.status(201).json({
        success: true,
        data: inventoryMovementToDTO(movement),
      });
    } catch (error) {
      console.error("Error en registerMovement inventory:", error);
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Datos inválidos",
          errors: error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }
      res.status(500).json({
        success: false,
        message: "Error al registrar movimiento de inventario",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  /**
   * Obtener movimientos de un item específico
   */
  getMovementsByItem: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;

      const movements = await prisma.inventoryMovement.findMany({
        where: { itemId: id },
        include: {
          item: true,
          supplier: true,
          user: true,
        },
        orderBy: { createdAt: "desc" },
      });

      res.json({
        success: true,
        count: movements.length,
        data: movements.map(inventoryMovementToDTO),
      });
    } catch (error) {
      console.error("Error en getMovementsByItem inventory:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener movimientos de inventario",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  /**
   * Obtener resumen de stock por categoría
   */
  getStockByCategory: async (req: Request, res: Response) => {
    try {
      const items = await prisma.inventoryItem.groupBy({
        by: ["category"],
        _count: true,
        _sum: {
          quantity: true,
          value: true,
        },
      });

      const summary = items.reduce((acc, item) => {
        acc[item.category] = {
          category: item.category,
          count: item._count,
          totalQuantity: item._sum.quantity || 0,
          totalValue: item._sum.value || 0,
        };
        return acc;
      }, {} as Record<string, { category: string; count: number; totalQuantity: number; totalValue: number }>);

      res.json({
        success: true,
        data: Object.values(summary),
      });
    } catch (error) {
      console.error("Error en getStockByCategory inventory:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener resumen de stock por categoría",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  /**
   * Obtener items con bajo stock (stock < 5)
   */
  getLowStockItems: async (req: Request, res: Response) => {
    try {
      const items = await prisma.inventoryItem.findMany({
        where: { status: "low-stock" },
        include: {
          supplier: true,
        },
        orderBy: { quantity: "asc" },
      });

      res.json({
        success: true,
        count: items.length,
        data: items.map(inventoryItemToDTO),
      });
    } catch (error) {
      console.error("Error en getLowStockItems inventory:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener items con bajo stock",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },
};