import { News } from '~/server/models/News';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'News ID is required'
      });
    }

    const news = await News.findById(id).lean();

    if (!news) {
      throw createError({
        statusCode: 404,
        message: 'News not found'
      });
    }

    return {
      success: true,
      data: news
    };
  } catch (error: any) {
    console.error('Error fetching news:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch news'
    });
  }
});
