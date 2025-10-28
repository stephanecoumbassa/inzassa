import { Country } from '~/server/models/Country';

export default defineEventHandler(async (event) => {
  try {
    const code = getRouterParam(event, 'code');
    
    if (!code) {
      throw createError({
        statusCode: 400,
        message: 'Country code is required'
      });
    }

    const country = await Country.findOne({ code }).lean();

    if (!country) {
      throw createError({
        statusCode: 404,
        message: 'Country not found'
      });
    }

    return {
      success: true,
      data: country
    };
  } catch (error: any) {
    console.error('Error fetching country:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch country'
    });
  }
});
