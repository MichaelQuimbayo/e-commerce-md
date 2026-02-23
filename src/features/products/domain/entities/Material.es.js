// This file acts as an adapter to bridge the CommonJS `Material.js` parser
// into the ES Module system of the application.

// Import the CommonJS module.
const MaterialParser = require('./Material.js');

// Re-export its contents using ES Module named exports.
export const toMaterial = MaterialParser.toMaterial;
export const materialToJson = MaterialParser.materialToJson;
