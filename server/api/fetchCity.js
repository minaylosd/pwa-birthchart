export default defineEventHandler(async (event) => {
  const { city } = getQuery(event);

  if (!city || city.length < 3) {
    throw createError({
      statusCode: 400,
      message: 'City name must be at least 3 characters long'
    });
  }

  async function fetchCities(city) {
    const config = useRuntimeConfig();
    const apiKey = config.geocodeApiKey;
    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      city
    )}&key=${apiKey}&language=en`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status code: ${response.status}`);
      }
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error(error);
      throw createError({
        statusCode: 500,
        message: 'Failed to fetch data'
      });
    }
  }

  function filterCities(list) {
    return list.filter(
      (city) =>
        city.components._type === 'city' ||
        city.components._type === 'town' ||
        city.components._type === 'township' ||
        city.components._type === 'village' ||
        city.components._type === 'hamlet'
    );
  }

  const result = await fetchCities(city);
  const filteredCities = filterCities(result);

  return { data: filteredCities };
});