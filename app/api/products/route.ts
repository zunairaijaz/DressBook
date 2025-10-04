import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET: Get products with filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 12;
    const skip = (page - 1) * limit;

    // Filters
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const gender = searchParams.get('gender');
    const status = searchParams.get('status');
    const minPrice = Number(searchParams.get('minPrice')) || null;
    const maxPrice = Number(searchParams.get('maxPrice')) || null;

    // Sorting
    const sort = searchParams.get('sort');
    let orderBy: any = {};
    if (sort === 'price-asc') orderBy = { price: 'asc' };
    if (sort === 'price-desc') orderBy = { price: 'desc' };
    if (sort === 'rating-desc') orderBy = { rating: 'desc' };
    if (sort === 'newest' || sort === 'newest-desc') orderBy = { dateAdded: 'desc' };

    // Build where clause
    const where: any = {};
    if (category && category !== 'All') where.category = category;
    if (brand) where.brand = brand;
    if (gender) where.gender = gender;
    if (status) where.status = { equals: status, mode: 'insensitive' }; // case-insensitive
    if (minPrice !== null || maxPrice !== null) {
      where.price = {};
      if (minPrice !== null) where.price.gte = minPrice;
      if (maxPrice !== null) where.price.lte = maxPrice;
    }

    // Fetch
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      products,
      totalPages,
      totalCount,
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}


// --- POST: Add a new product ---
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name, price, originalPrice, description, category, brand, images,
      stock, sku, material, gender, pattern, status,
    } = body;

    if (!name || !price || !description || !category || !brand || !images || !stock || !sku || !status) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        price,
        originalPrice: originalPrice || null,
        description,
        category,
        brand,
        images,
        stock,
        sku,
        material: material || null,
        gender: gender || null,
        pattern: pattern || null,
        status,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ message: 'Failed to add product' }, { status: 500 });
  }
}
