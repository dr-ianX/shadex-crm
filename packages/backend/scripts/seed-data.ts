import { seedAll } from '../src/seeds/seed';

async function main() {
  try {
    console.log('Starting SHADEX data seeding...');
    await seedAll();
    console.log('SHADEX data seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('SHADEX data seeding failed:', error);
    process.exit(1);
  }
}

main();