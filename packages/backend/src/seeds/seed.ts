import prisma from '../db'
import bcrypt from 'bcryptjs'

// ============================================
// SEED DE DATOS REALES SHADEX - Propuesta AGUSTÍN
// ============================================

export async function seedCompanyData() {
  try {
    const count = await prisma.company.count()
    if (count === 0) {
      console.log('Seeding SHADEX company data...')
      
      await prisma.company.create({
        data: {
          name: 'SX SHADEX',
          rfc: 'METL671227PP7',
          legalName: 'LILIA DINORAH MEJIA TRUJEQUE',
          fiscalAddress: 'PENDIENTE DE CAPTURAR',
          fiscalZipCode: 'PENDIENTE',
          taxRegime: 'PENDIENTE DE CAPTURAR',
          phone: '614 487 1005',
          email: 'support@shadex.com.mx',
          website: 'shadex.com.mx',
          tagline: 'QUOD TANGO MUTO'
        }
      })
      
      console.log('SHADEX company data seeded')
    }
  } catch (err) {
    console.error('Failed to seed company data', err)
  }
}

export async function seedUsers() {
  try {
    const count = await prisma.user.count()
    if (count === 0) {
      console.log('Seeding SHADEX users...')
      
      // Agustín Andreu - ADMIN GENERAL
      const agustinPass = await bcrypt.hash('Shadex2026!', 10)
      await prisma.user.create({
        data: {
          email: 'agustin@shadex.com.mx',
          password: agustinPass,
          name: 'Agustín Andreu',
          role: 'ADMIN',
          phone: '614 487 1005',
          isActive: true
        }
      })
      
      // Lilia Buenfil - ADMIN GENERAL
      const liliaPass = await bcrypt.hash('Shadex2026!', 10)
      await prisma.user.create({
        data: {
          email: 'lilia@shadex.com.mx',
          password: liliaPass,
          name: 'Lilia Buenfil',
          role: 'ADMIN',
          phone: '614 487 1005',
          isActive: true
        }
      })
      
      // Usuario demo para desarrollo
      const demoPass = await bcrypt.hash('demo123', 10)
      await prisma.user.create({
        data: {
          email: 'demo@shadex.com.mx',
          password: demoPass,
          name: 'Usuario Demo',
          role: 'SALES',
          phone: '+5215512345678',
          isActive: true
        }
      })
      
      console.log('SHADEX users seeded')
    }
  } catch (err) {
    console.error('Failed to seed users', err)
  }
}

export async function seedCurrencies() {
  try {
    const count = await prisma.exchangeRate.count()
    if (count === 0) {
      console.log('Seeding currencies and exchange rates...')
      
      // Tasa de cambio ejemplo (actualizar con valor real)
      await prisma.exchangeRate.create({
        data: {
          fromCurrency: 'USD',
          toCurrency: 'MXN',
          rate: 18.50, // Valor ejemplo - actualizar con BBVA/Banxico
          source: 'Manual',
          isAutomatic: false,
          validFrom: new Date(),
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días
        }
      })
      
      console.log('Currencies and exchange rates seeded')
    }
  } catch (err) {
    console.error('Failed to seed currencies', err)
  }
}

export async function seedProductCatalog() {
  try {
    console.log('Seeding SHADEX product catalog...')
    
    // Reset product catalog for development seeding
    await prisma.product.deleteMany({})
    
    const products = [
        // CONTROL SOLAR
        { sku: 'CLEAR-NIGHT-50-152', family: 'CONTROL_SOLAR', commercialName: 'Clear Night 50%', description: 'Película arquitectónica de alto rendimiento con VLT 50%', variant: '50%', vlt: 50, color: 'Neutral', thickness: 1.52, width: 1.52, rollLength: 30, purchaseUnit: 'ROLL', inventoryUnit: 'SQM', saleUnit: 'SQM', cost: 45.00, costCurrency: 'USD', suggestedPrice: 850.00, priceCurrency: 'MXN', warrantyYears: 10, isActive: true },
        { sku: 'NOIR-VISION-35-152', family: 'CONTROL_SOLAR', commercialName: 'Noir Vision 35%', description: 'Película arquitectónica oscura con VLT 35%', variant: '35%', vlt: 35, color: 'Dark', thickness: 1.52, width: 1.52, rollLength: 30, purchaseUnit: 'ROLL', inventoryUnit: 'SQM', saleUnit: 'SQM', cost: 48.00, costCurrency: 'USD', suggestedPrice: 950.00, priceCurrency: 'MXN', warrantyYears: 10, isActive: true },
        { sku: 'MIRROR-SOFT-35-152', family: 'CONTROL_SOLAR', commercialName: 'Mirroring Soft 35%', description: 'Película reflectante suave con VLT 35%', variant: '35%', vlt: 35, color: 'Silver', thickness: 1.52, width: 1.52, rollLength: 30, purchaseUnit: 'ROLL', inventoryUnit: 'SQM', saleUnit: 'SQM', cost: 52.00, costCurrency: 'USD', suggestedPrice: 1050.00, priceCurrency: 'MXN', warrantyYears: 10, isActive: true },
        { sku: 'MIRROR-CORE-20-152', family: 'CONTROL_SOLAR', commercialName: 'Mirroring Core 20%', description: 'Película reflectante alta con VLT 20%', variant: '20%', vlt: 20, color: 'Silver', thickness: 1.52, width: 1.52, rollLength: 30, purchaseUnit: 'ROLL', inventoryUnit: 'SQM', saleUnit: 'SQM', cost: 55.00, costCurrency: 'USD', suggestedPrice: 1100.00, priceCurrency: 'MXN', warrantyYears: 10, isActive: true },
        { sku: 'MIRROR-DOME-15-152', family: 'CONTROL_SOLAR', commercialName: 'Mirroring Dome 15%', description: 'Película reflectante domo con VLT 15%', variant: '15%', vlt: 15, color: 'Silver', thickness: 1.52, width: 1.52, rollLength: 30, purchaseUnit: 'ROLL', inventoryUnit: 'SQM', saleUnit: 'SQM', cost: 58.00, costCurrency: 'USD', suggestedPrice: 1150.00, priceCurrency: 'MXN', warrantyYears: 10, isActive: true },
        { sku: 'SHINING-BLUE-40-152', family: 'CONTROL_SOLAR', commercialName: 'Shining Blue 40%', description: 'Línea cerámica azul con VLT 40%', variant: '40%', vlt: 40, color: 'Blue', thickness: 1.52, width: 1.52, rollLength: 30, purchaseUnit: 'ROLL', inventoryUnit: 'SQM', saleUnit: 'SQM', cost: 50.00, costCurrency: 'USD', suggestedPrice: 1000.00, priceCurrency: 'MXN', warrantyYears: 10, isActive: true },
        { sku: 'SHINING-GREEN-40-152', family: 'CONTROL_SOLAR', commercialName: 'Shining Green 40%', description: 'Línea cerámica verde con VLT 40%', variant: '40%', vlt: 40, color: 'Green', thickness: 1.52, width: 1.52, rollLength: 30, purchaseUnit: 'ROLL', inventoryUnit: 'SQM', saleUnit: 'SQM', cost: 50.00, costCurrency: 'USD', suggestedPrice: 1000.00, priceCurrency: 'MXN', warrantyYears: 10, isActive: true },

        // SMARTFILM / PRIVACIDAD INTELIGENTE
        { sku: 'SMARTFILM-CRYSTAL-WHITE-091', family: 'SMARTFILM', commercialName: 'SmartFilm Crystal White', description: 'Película inteligente PDLC transparente/blanca', variant: 'White', vlt: 80, color: 'White', thickness: 0.4, width: 1.2, rollLength: 30, purchaseUnit: 'ROLL', inventoryUnit: 'SQM', saleUnit: 'SQM', cost: 120.00, costCurrency: 'USD', suggestedPrice: 2500.00, priceCurrency: 'MXN', warrantyYears: 5, isActive: true },
        { sku: 'SMARTFILM-CRYSTAL-BLACK-091', family: 'SMARTFILM', commercialName: 'SmartFilm Crystal Black', description: 'Película inteligente PDLC transparente/negra', variant: 'Black', vlt: 75, color: 'Black', thickness: 0.4, width: 1.2, rollLength: 30, purchaseUnit: 'ROLL', inventoryUnit: 'SQM', saleUnit: 'SQM', cost: 125.00, costCurrency: 'USD', suggestedPrice: 2600.00, priceCurrency: 'MXN', warrantyYears: 5, isActive: true },
        { sku: 'SMARTFILM-CRYSTAL-GREY-091', family: 'SMARTFILM', commercialName: 'SmartFilm Crystal Grey', description: 'Película inteligente PDLC gris', variant: 'Grey', vlt: 70, color: 'Grey', thickness: 0.4, width: 1.2, rollLength: 30, purchaseUnit: 'ROLL', inventoryUnit: 'SQM', saleUnit: 'SQM', cost: 125.00, costCurrency: 'USD', suggestedPrice: 2600.00, priceCurrency: 'MXN', warrantyYears: 5, isActive: true },
        { sku: 'SMARTFILM-BLACKOUT-091', family: 'SMARTFILM', commercialName: 'SmartFilm Blackout', description: 'Película inteligente opaca completa', variant: 'Blackout', vlt: 0, color: 'Black', thickness: 0.4, width: 1.2, rollLength: 30, purchaseUnit: 'ROLL', inventoryUnit: 'SQM', saleUnit: 'SQM', cost: 130.00, costCurrency: 'USD', suggestedPrice: 2800.00, priceCurrency: 'MXN', warrantyYears: 5, isActive: true },

        // SEGURIDAD
        { sku: 'GUARD-CLEAR-4MIL-152', family: 'SECURITY', commercialName: 'Guard Clear 4mil', description: 'Película de seguridad transparente 4 mil', variant: '4mil', vlt: 90, color: 'Clear', thickness: 0.1, width: 1.52, rollLength: 30, purchaseUnit: 'ROLL', inventoryUnit: 'SQM', saleUnit: 'SQM', cost: 35.00, costCurrency: 'USD', suggestedPrice: 700.00, priceCurrency: 'MXN', warrantyYears: 10, isActive: true },
        { sku: 'SAFETY-FILM-8MIL-152', family: 'SECURITY', commercialName: 'Safety Film 8mil', description: 'Película de seguridad 8 mil antiespía', variant: '8mil', vlt: 85, color: 'Clear', thickness: 0.2, width: 1.52, rollLength: 30, purchaseUnit: 'ROLL', inventoryUnit: 'SQM', saleUnit: 'SQM', cost: 45.00, costCurrency: 'USD', suggestedPrice: 900.00, priceCurrency: 'MXN', warrantyYears: 10, isActive: true },
        { sku: 'DOME-GUARD-152', family: 'SECURITY', commercialName: 'Dome Guard', description: 'Película de seguridad para domos', variant: 'Domo', vlt: 80, color: 'Clear', thickness: 0.15, width: 1.52, rollLength: 30, purchaseUnit: 'ROLL', inventoryUnit: 'SQM', saleUnit: 'SQM', cost: 60.00, costCurrency: 'USD', suggestedPrice: 1200.00, priceCurrency: 'MXN', warrantyYears: 10, isActive: true },

        // ESPECIALIDAD
        { sku: 'CLOAKING-ANTI-SPY-152', family: 'SPECIALTY', commercialName: 'Cloaking Anti-Spy', description: 'Película anti-espía para pantallas', variant: 'Anti-Spy', vlt: 60, color: 'Black', thickness: 0.5, width: 1.52, rollLength: 30, purchaseUnit: 'ROLL', inventoryUnit: 'SQM', saleUnit: 'SQM', cost: 90.00, costCurrency: 'USD', suggestedPrice: 1800.00, priceCurrency: 'MXN', warrantyYears: 5, isActive: true },
        { sku: 'PHOTOCHROMATIC-152', family: 'SPECIALTY', commercialName: 'Photochromatic', description: 'Película fotocromática que oscurece con luz solar', variant: 'Fotocromático', vlt: 70, color: 'Grey', thickness: 0.5, width: 1.52, rollLength: 30, purchaseUnit: 'ROLL', inventoryUnit: 'SQM', saleUnit: 'SQM', cost: 95.00, costCurrency: 'USD', suggestedPrice: 1900.00, priceCurrency: 'MXN', warrantyYears: 5, isActive: true },
        { sku: 'DICHROIC-152', family: 'SPECIALTY', commercialName: 'Dichroic', description: 'Película dicroica con cambio de color', variant: 'Dichroic', vlt: 50, color: 'Multi', thickness: 0.5, width: 1.52, rollLength: 30, purchaseUnit: 'ROLL', inventoryUnit: 'SQM', saleUnit: 'SQM', cost: 100.00, costCurrency: 'USD', suggestedPrice: 2000.00, priceCurrency: 'MXN', warrantyYears: 5, isActive: true },

        // STONEGUARD
        { sku: 'STONEGUARD-MATTE-122', family: 'STONEGUARD', commercialName: 'StoneGuard Matte', description: 'Protección de superficies mate', variant: 'Matte', vlt: 0, color: 'Clear', thickness: 0.2, width: 1.22, rollLength: 30, purchaseUnit: 'ROLL', inventoryUnit: 'SQM', saleUnit: 'SQM', cost: 30.00, costCurrency: 'USD', suggestedPrice: 600.00, priceCurrency: 'MXN', warrantyYears: 5, isActive: true },

        // DIGITAL/LED
        { sku: 'UTD-55-PANEL', family: 'DIGITAL_LED', commercialName: 'UTD Ultra Thin Transparency Display 55"', description: 'Pantalla transparente ultra delgada 55 pulgadas', variant: '55"', vlt: 70, color: 'Transparent', thickness: 5, width: 1.2, rollLength: 1, purchaseUnit: 'PIECE', inventoryUnit: 'PIECE', saleUnit: 'PIECE', cost: 2500.00, costCurrency: 'USD', suggestedPrice: 55000.00, priceCurrency: 'MXN', warrantyYears: 2, isActive: true },
        { sku: 'LED-FILM-P3.91', family: 'DIGITAL_LED', commercialName: 'LED Film P3.91', description: 'Película LED flexible con pixel pitch 3.91mm', variant: 'P3.91', vlt: 65, color: 'RGB', thickness: 3, width: 1.0, rollLength: 10, purchaseUnit: 'ROLL', inventoryUnit: 'SQM', saleUnit: 'SQM', cost: 800.00, costCurrency: 'USD', suggestedPrice: 18000.00, priceCurrency: 'MXN', warrantyYears: 2, isActive: true },
        { sku: 'LED-MESH-P4.81', family: 'DIGITAL_LED', commercialName: 'LED Mesh P4.81', description: 'Malla LED flexible P4.81', variant: 'P4.81', vlt: 70, color: 'RGB', thickness: 3, width: 1.0, rollLength: 10, purchaseUnit: 'ROLL', inventoryUnit: 'SQM', saleUnit: 'SQM', cost: 750.00, costCurrency: 'USD', suggestedPrice: 16500.00, priceCurrency: 'MXN', warrantyYears: 2, isActive: true },
        { sku: 'FLYING-LED-MESH-P5.95', family: 'DIGITAL_LED', commercialName: 'Flying LED Mesh P5.95', description: 'Malla LED para exterior P5.95', variant: 'P5.95', vlt: 75, color: 'RGB', thickness: 4, width: 1.0, rollLength: 10, purchaseUnit: 'ROLL', inventoryUnit: 'SQM', saleUnit: 'SQM', cost: 850.00, costCurrency: 'USD', suggestedPrice: 19000.00, priceCurrency: 'MXN', warrantyYears: 2, isActive: true },

        // SERVICIOS
        { sku: 'SRV-INSTALACION-EST', family: 'SERVICES', commercialName: 'Instalación Estándar', description: 'Instalación profesional de películas arquitectónicas', variant: 'Estándar', purchaseUnit: 'SERVICE', inventoryUnit: 'SERVICE', saleUnit: 'SERVICE', cost: 0, costCurrency: 'MXN', suggestedPrice: 350.00, priceCurrency: 'MXN', warrantyYears: 1, isActive: true },
        { sku: 'SRV-RETIRO-PELICULA', family: 'SERVICES', commercialName: 'Retiro de Película', description: 'Retiro de película existente', variant: 'Básico', purchaseUnit: 'SERVICE', inventoryUnit: 'SERVICE', saleUnit: 'SERVICE', cost: 0, costCurrency: 'MXN', suggestedPrice: 250.00, priceCurrency: 'MXN', warrantyYears: 0, isActive: true },
        { sku: 'SRV-LEVANTAMIENTO', family: 'SERVICES', commercialName: 'Levantamiento', description: 'Servicio de medición y evaluación del espacio', variant: 'Básico', purchaseUnit: 'SERVICE', inventoryUnit: 'SERVICE', saleUnit: 'SERVICE', cost: 0, costCurrency: 'MXN', suggestedPrice: 500.00, priceCurrency: 'MXN', warrantyYears: 0, isActive: true },
        { sku: 'SRV-ADECUACION-ELECTRICA', family: 'SERVICES', commercialName: 'Adecuaciones Eléctricas', description: 'Adecuaciones eléctricas para SmartFilm', variant: 'Completo', purchaseUnit: 'SERVICE', inventoryUnit: 'SERVICE', saleUnit: 'SERVICE', cost: 0, costCurrency: 'MXN', suggestedPrice: 1200.00, priceCurrency: 'MXN', warrantyYears: 1, isActive: true },
        { sku: 'SRV-LIMPIEZA-ESPECIAL', family: 'SERVICES', commercialName: 'Limpieza Especial', description: 'Limpieza especializada post-instalación', variant: 'Básico', purchaseUnit: 'SERVICE', inventoryUnit: 'SERVICE', saleUnit: 'SERVICE', cost: 0, costCurrency: 'MXN', suggestedPrice: 300.00, priceCurrency: 'MXN', warrantyYears: 0, isActive: true },
        { sku: 'SRV-TRASLADO', family: 'SERVICES', commercialName: 'Traslado', description: 'Traslado de material e instaladores', variant: 'Básico', purchaseUnit: 'SERVICE', inventoryUnit: 'SERVICE', saleUnit: 'SERVICE', cost: 0, costCurrency: 'MXN', suggestedPrice: 450.00, priceCurrency: 'MXN', warrantyYears: 0, isActive: true },
        { sku: 'SRV-ENVIO', family: 'SERVICES', commercialName: 'Envío', description: 'Envío de material a proyecto', variant: 'Básico', purchaseUnit: 'SERVICE', inventoryUnit: 'SERVICE', saleUnit: 'SERVICE', cost: 0, costCurrency: 'MXN', suggestedPrice: 350.00, priceCurrency: 'MXN', warrantyYears: 0, isActive: true },
        { sku: 'SRV-PROGRAMACION', family: 'SERVICES', commercialName: 'Programación', description: 'Programación de cita e instalación', variant: 'Básico', purchaseUnit: 'SERVICE', inventoryUnit: 'SERVICE', saleUnit: 'SERVICE', cost: 0, costCurrency: 'MXN', suggestedPrice: 0, priceCurrency: 'MXN', warrantyYears: 0, isActive: true },
        { sku: 'SRV-MANTENIMIENTO', family: 'SERVICES', commercialName: 'Mantenimiento', description: 'Mantenimiento de instalaciones existentes', variant: 'Anual', purchaseUnit: 'SERVICE', inventoryUnit: 'SERVICE', saleUnit: 'SERVICE', cost: 0, costCurrency: 'MXN', suggestedPrice: 800.00, priceCurrency: 'MXN', warrantyYears: 1, isActive: true }
      ]

      for (const product of products) {
        await prisma.product.create({ data: product })
      }

      console.log('SHADEX product catalog seeded')
  } catch (err) {
    console.error('Failed to seed product catalog', err)
  }
}

export async function seedDemoClients() {
  try {
    const count = await prisma.client.count()
    if (count === 0) {
      console.log('Seeding demo clients...')
      
      await prisma.client.create({
        data: {
          code: 'CLI-0001',
          type: 'RESIDENTIAL',
          name: 'Carlos',
          lastName: 'Rodríguez',
          phone: '+5215512345678',
          whatsapp: '+5215512345678',
          email: 'carlos.rodriguez@example.com',
          address: 'Av. Reforma 222, Col. Centro',
          city: 'Ciudad de México',
          state: 'CDMX',
          country: 'Mexico',
          status: 'Active'
        }
      })
      
      await prisma.client.create({
        data: {
          code: 'CLI-0002',
          type: 'CORPORATE',
          companyName: 'Ciudad Judicial',
          name: 'Contacto Corporativo',
          phone: '+5215598765432',
          whatsapp: '+5215598765432',
          email: 'contacto@ciudadjudicial.com',
          rfc: 'CJU200101ABC',
          fiscalAddress: 'Blvd. Juárez 100, Col. Centro',
          fiscalZipCode: '06000',
          taxRegime: '601 - General de Ley Personas Morales',
          cfdiUsage: 'G03 - Gastos en general',
          address: 'Blvd. Juárez 100, Col. Centro',
          city: 'Ciudad de México',
          state: 'CDMX',
          country: 'Mexico',
          status: 'Active'
        }
      })
      
      console.log('Demo clients seeded')
    }
  } catch (err) {
    console.error('Failed to seed demo clients', err)
  }
}

// Función principal para ejecutar todos los seeds
export async function seedAll() {
  console.log('Starting SHADEX database seeding...')
  
  await seedCompanyData()
  await seedUsers()
  await seedCurrencies()
  await seedProductCatalog()
  await seedDemoClients()
  
  console.log('SHADEX database seeding completed!')
}
