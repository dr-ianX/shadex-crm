"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDemoClients = seedDemoClients;
exports.seedDemoUsers = seedDemoUsers;
const db_1 = __importDefault(require("../db"));
async function seedDemoClients() {
    try {
        const count = await db_1.default.client.count();
        if (count === 0) {
            console.log('Seeding demo clients...');
            await db_1.default.client.createMany({
                data: [
                    { code: 'CL-0001', name: 'Cliente Demo Uno', email: 'cliente1@example.com', phone: '+5215512345678', clientType: 'Regular' },
                    { code: 'CL-0002', name: 'Cliente Demo Dos', email: 'cliente2@example.com', phone: '+5215512345679', clientType: 'Regular' },
                ],
            });
            console.log('Demo clients seeded');
        }
    }
    catch (err) {
        console.error('Failed to seed demo clients', err);
    }
}
async function seedDemoUsers() {
    try {
        const count = await db_1.default.user.count();
        if (count === 0) {
            console.log('Seeding demo users...');
            const bcrypt = require('bcryptjs');
            const adminPass = await bcrypt.hash('admin123', 10);
            const salesPass = await bcrypt.hash('sales123', 10);
            // create users individually so hashing values are preserved correctly in DB
            await db_1.default.user.create({ data: { email: 'admin@shadex.local', password: adminPass, name: 'Admin', role: 'Admin' } });
            await db_1.default.user.create({ data: { email: 'sales@shadex.local', password: salesPass, name: 'Sales', role: 'Sales' } });
            console.log('Demo users seeded');
        }
    }
    catch (err) {
        console.error('Failed to seed demo users', err);
    }
}
//# sourceMappingURL=seed.js.map