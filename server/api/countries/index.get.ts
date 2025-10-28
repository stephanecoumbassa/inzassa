import { Country } from '~/server/models/Country';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const featured = query.featured === 'true';

    const filter: any = {};
    if (featured) filter.featured = true;

    const countries = await Country.find(filter)
      .sort({ name: 1 })
      .lean();

    return {
      success: true,
      data: countries
    };
  } catch (error: any) {
    console.error('Error fetching countries:', error);
    return {
      success: false,
      error: error.message
    };
  }
});
