import { News } from '~/server/models/News';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 20;
    const country = query.country as string;
    const category = query.category as string;
    const featured = query.featured === 'true';

    const filter: any = {};
    if (country) filter.country = country;
    if (category) filter.category = category;
    if (featured) filter.featured = true;

    const skip = (page - 1) * limit;

    const [news, total] = await Promise.all([
      News.find(filter)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      News.countDocuments(filter)
    ]);

    return {
      success: true,
      data: news,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error: any) {
    console.error('Error fetching news:', error);
    return {
      success: false,
      error: error.message
    };
  }
});
