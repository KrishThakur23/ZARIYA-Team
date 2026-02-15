import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';

const PriceRequestSchema = {
  title: 'string',
  category: 'string',
  dimensions: 'string',
  timeSpent: 'number',
  material: 'string',
  complexity: 'string'
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, category, dimensions, timeSpent = 8, material = 'wood', complexity = 'medium' } = body;

    // Simple heuristic pricing (since API quota is exceeded)
    const basePrices = {
      'woodworking': 50,
      'pottery': 40,
      'textiles': 30,
      'metalwork': 80,
      'jewelry': 60,
      'default': 45
    };

    const complexityMultipliers = {
      'low': 0.7,
      'medium': 1.0,
      'high': 1.5
    };

    const materialMultipliers = {
      'wood': 1.0,
      'clay': 0.8,
      'metal': 1.3,
      'fabric': 0.6,
      'precious_metal': 2.0,
      'default': 1.0
    };

    const basePrice = basePrices[category] || basePrices.default;
    const complexityMultiplier = complexityMultipliers[complexity] || 1.0;
    const materialMultiplier = materialMultipliers[material] || 1.0;
    const timeMultiplier = Math.max(0.5, Math.min(2.0, timeSpent / 8)); // 8 hours = baseline

    const suggestedPrice = Math.round(basePrice * complexityMultiplier * materialMultiplier * timeMultiplier);

    const rationale = `Based on your ${category} piece with ${complexity} complexity using ${material}, I suggest $${suggestedPrice}. This accounts for ${timeSpent} hours of work, material costs, and market rates for similar handcrafted items.`;

    return NextResponse.json({
      success: true,
      suggested_price: suggestedPrice,
      rationale: rationale,
      breakdown: {
        base_price: basePrice,
        complexity_multiplier: complexityMultiplier,
        material_multiplier: materialMultiplier,
        time_multiplier: timeMultiplier
      }
    });

  } catch (error) {
    console.error('Price suggestion error:', error);
    return NextResponse.json(
      { error: 'Failed to suggest price' },
      { status: 500 }
    );
  }
}
