function calculateDrawingLongitude(ascPos, longitude) {
    const drawingOffset = 270 - ascPos;
    let drawingLongitude = longitude + drawingOffset;
    if (drawingLongitude < 0) {
      drawingLongitude += 360;
    } else if (drawingLongitude >= 360) {
      drawingLongitude -= 360;
    }
    return drawingLongitude;
  }
  
  function prepareData(responseData) {
    const zodiacSigns = [
      { name: "aries", start: 0 },
      { name: "taurus", start: 30 },
      { name: "gemini", start: 60 },
      { name: "cancer", start: 90 },
      { name: "leo", start: 120 },
      { name: "virgo", start: 150 },
      { name: "libra", start: 180 },
      { name: "scorpio", start: 210 },
      { name: "sagittarius", start: 240 },
      { name: "capricorn", start: 270 },
      { name: "aquarius", start: 300 },
      { name: "pisces", start: 330 },
    ];
  
    responseData.data.zodiac = zodiacSigns;
  
    const ascPos = responseData.data.axes.asc.position.longitude;
  
    // Add drawingLongitude for astros
    for (let astroKey in responseData.data.astros) {
      let astro = responseData.data.astros[astroKey];
      astro.position.drawingLongitude = calculateDrawingLongitude(
        ascPos,
        astro.position.longitude
      );
    }
  
    // Add drawingLongitude for axes
    for (let axisKey in responseData.data.axes) {
      let axis = responseData.data.axes[axisKey];
      axis.position.drawingLongitude = calculateDrawingLongitude(
        ascPos,
        axis.position.longitude
      );
    }
  
    // Add drawingLongitude for houses
    responseData.data.houses.forEach((house) => {
      house.position.drawingLongitude = calculateDrawingLongitude(
        ascPos,
        house.position.longitude
      );
    });
  
    // Add drawingLongitude for zodiac
    responseData.data.zodiac.forEach((zodiac) => {
      zodiac.start = calculateDrawingLongitude(ascPos, zodiac.start);
    });
  
    return responseData;
  }

// Function to get horoscope data from API
  async function getHoroscope(date, time, latitude, longitude, timezone) {
    const apiUrl = import.meta.env.VITE_ASTROLOGY_API_URL;
    const fulldate = `${date}T${time}${timezone}`;
    const params = {
      time: fulldate,
      latitude: latitude,
      longitude: longitude,
      houseSystem: "P",
    };
  
    const url = new URL(apiUrl);
    url.search = new URLSearchParams(params).toString();
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status code: ${response.status}`);
      }
      const responseData = await response.json();
  
      const drawingData = prepareData(responseData);
      return drawingData;
    } catch (error) {
      console.error(error);
    }
  }

  export {getHoroscope}