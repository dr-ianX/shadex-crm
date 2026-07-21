"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformationController = void 0;
// Mock data - will be replaced with Prisma
const mockTransformations = [
    {
        id: '1',
        folioNumber: 'TRANS-2024-0001',
        name: 'Torre Mayor - Pisos 15-20',
        clientId: 'client-1',
        sector: 'Corporativo',
        status: 'Installation',
        priority: 'High',
        journeyPhase: 'Transform',
        estimatedBudget: 150000,
        createdAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '2',
        folioNumber: 'TRANS-2024-0002',
        name: 'Residencial Las Lomas - Casa Martínez',
        clientId: 'client-2',
        sector: 'Residencial',
        status: 'Quotation',
        priority: 'Medium',
        journeyPhase: 'Design',
        estimatedBudget: 25000,
        createdAt: '2024-02-01T14:30:00Z'
    }
];
exports.transformationController = {
    // Get all transformations
    getAllTransformations: async (req, res) => {
        try {
            const { status, sector, priority } = req.query;
            let filtered = [...mockTransformations];
            if (status) {
                filtered = filtered.filter(t => t.status === status);
            }
            if (sector) {
                filtered = filtered.filter(t => t.sector === sector);
            }
            if (priority) {
                filtered = filtered.filter(t => t.priority === priority);
            }
            res.json({
                success: true,
                data: filtered,
                count: filtered.length
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to fetch transformations'
            });
        }
    },
    // Get single transformation
    getTransformationById: async (req, res) => {
        try {
            const { id } = req.params;
            const transformation = mockTransformations.find(t => t.id === id);
            if (!transformation) {
                return res.status(404).json({
                    success: false,
                    error: 'Transformation not found'
                });
            }
            res.json({
                success: true,
                data: transformation
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to fetch transformation'
            });
        }
    },
    // Create new transformation
    createTransformation: async (req, res) => {
        try {
            const transformationData = req.body;
            const newTransformation = {
                id: Date.now().toString(),
                folioNumber: `TRANS-2024-${String(mockTransformations.length + 1).padStart(4, '0')}`,
                ...transformationData,
                createdAt: new Date().toISOString()
            };
            mockTransformations.push(newTransformation);
            res.status(201).json({
                success: true,
                data: newTransformation,
                message: 'Transformation created successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to create transformation'
            });
        }
    },
    // Update transformation
    updateTransformation: async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const index = mockTransformations.findIndex(t => t.id === id);
            if (index === -1) {
                return res.status(404).json({
                    success: false,
                    error: 'Transformation not found'
                });
            }
            mockTransformations[index] = {
                ...mockTransformations[index],
                ...updateData,
                updatedAt: new Date().toISOString()
            };
            res.json({
                success: true,
                data: mockTransformations[index],
                message: 'Transformation updated successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to update transformation'
            });
        }
    },
    // Delete transformation
    deleteTransformation: async (req, res) => {
        try {
            const { id } = req.params;
            const index = mockTransformations.findIndex(t => t.id === id);
            if (index === -1) {
                return res.status(404).json({
                    success: false,
                    error: 'Transformation not found'
                });
            }
            mockTransformations.splice(index, 1);
            res.json({
                success: true,
                message: 'Transformation deleted successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to delete transformation'
            });
        }
    },
    // Update transformation status
    updateStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status, journeyPhase } = req.body;
            const index = mockTransformations.findIndex(t => t.id === id);
            if (index === -1) {
                return res.status(404).json({
                    success: false,
                    error: 'Transformation not found'
                });
            }
            mockTransformations[index] = {
                ...mockTransformations[index],
                status: status || mockTransformations[index].status,
                journeyPhase: journeyPhase || mockTransformations[index].journeyPhase,
                updatedAt: new Date().toISOString()
            };
            res.json({
                success: true,
                data: mockTransformations[index],
                message: 'Status updated successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: 'Failed to update status'
            });
        }
    }
};
//# sourceMappingURL=transformation.controller.js.map