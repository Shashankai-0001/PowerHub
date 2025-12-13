const axios = require('axios');

const analyzeFood = async (barcode) => {
    try {
        const url = `${process.env.FOOD_API_BASE}/api/v2/product/${barcode}.json`;
        const response = await axios.get(url);

        if (response.data.status === 0) {
            throw new Error('Product not found');
        }

        const output = response.data.product;
        const nutriments = output.nutriments || {};

        // Basic Data
        const productName = output.product_name || 'Unknown Product';
        const imageUrl = output.image_url || '';

        // Check if nutriments exist and have at least some data
        const nutritionAvailable = output.nutriments && (
            output.nutriments['energy-kcal_100g'] !== undefined ||
            output.nutriments['sugars_100g'] !== undefined ||
            output.nutriments['fat_100g'] !== undefined ||
            output.nutriments['sodium_100g'] !== undefined ||
            output.nutriments['proteins_100g'] !== undefined
        );

        // Default to 0 if not found
        const calories = nutriments['energy-kcal_100g'] || 0;
        const sugar = nutriments['sugars_100g'] || 0;
        const fat = nutriments['fat_100g'] || 0;
        const sodium = nutriments['sodium_100g'] || 0;
        const protein = nutriments['proteins_100g'] || 0;

        let healthScore = null;
        let warnings = [];

        if (nutritionAvailable) {
            // Health Analysis Logic
            if (sugar > 10) warnings.push('High Sugar');
            if (sodium > 0.4) warnings.push('High Sodium'); // 400mg = 0.4g
            if (nutriments['nova_group'] === 4) warnings.push('Ultra-processed food');

            healthScore = 100;
            healthScore -= (sugar * 6);
            healthScore -= (sodium * 4);
            healthScore += (protein * 5);

            // Dynamic adjustment to keep 0-100
            if (healthScore > 100) healthScore = 100;
            if (healthScore < 0) healthScore = 0;
            healthScore = Math.round(healthScore);
        } else {
            warnings.push('Nutrition data not available from OpenFoodFacts');
            // Explicitly nullify score just in case logic leaked
            healthScore = null;
        }

        return {
            productName,
            calories,
            sugar,
            fat,
            sodium,
            protein,
            healthScore,
            nutritionAvailable,
            warnings,
            imageUrl
        };
    } catch (error) {
        throw error;
    }
};

module.exports = { analyzeFood };
