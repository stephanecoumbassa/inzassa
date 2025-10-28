import { Book } from '~/server/models/Book';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 20;
    const country = query.country as string;
    const author = query.author as string;
    const featured = query.featured === 'true';

    const filter: any = {};
    if (country) filter.country = country;
    if (author) filter.author = { $regex: author, $options: 'i' };
    if (featured) filter.featured = true;

    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
      Book.find(filter)
        .sort({ publishedYear: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Book.countDocuments(filter)
    ]);

    return {
      success: true,
      data: books,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error: any) {
    console.error('Error fetching books:', error);
    return {
      success: false,
      error: error.message
    };
  }
});
