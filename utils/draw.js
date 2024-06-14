import * as d3 from "d3";

function drawCircle(svg, cx, cy, r, type) {
    const fill = "#0f1216";
    const stroke = "#ffffff";
    svg
      .append("circle")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("r", r)
      .attr("type", type)
      .attr("fill", fill)
      .attr("stroke", stroke);
    //   .attr("stroke-width", 0.5);
  }
  
  function drawScaleLines(data, radiuses) {
    const svg = d3.select("#natalChart");
    const zodiac = data.zodiac;
    const ascPos = data.axes.asc.position.longitude;
  
    // Append scale lines
    for (let angle = ascPos, i = 0; i < 360; angle++, i++) {
      const adjustedAngle = angle % 360; // Ensure the angle stays within the range of 0 to 359
      const line = svg
        .append("line")
        .attr("x1", radiuses.CX)
        .attr("y1", radiuses.CY - radiuses.planetR)
        .attr("x2", radiuses.CX)
        .attr(
          "y2",
          radiuses.CY -
            radiuses.planetR +
            (i % 5 === 0 ? 12 : i % 10 === 0 ? 15 : 6)
        ) // Longer lines for every 5th degree, thicker lines for every 10th degree
        .attr("stroke", "rgba(255, 255, 255, 0.5)")
        .attr("longitude", i)
        .attr("stroke-width", i % 5 === 0 ? 1 : 0.5); // Thicker lines for every 5th degree
      // Rotate the line to the current angle
      line.attr(
        "transform",
        `rotate(${adjustedAngle}, ${radiuses.CX}, ${radiuses.CY})`
      );
    }
  }
  
  function drawZodiac(data, radiuses) {
    const zodiac = data.zodiac;
    const svg = d3.select("#natalChart");
    zodiac.forEach((sign) => {
      const endAngle = sign.start + 30;
      const midpointAngle = (endAngle + sign.start) / 2;
      const radians = (sign.start - 90) * (Math.PI / 180);
  
      // here instead of zodiacR use full screen width
      const x = radiuses.CX - (radiuses.width / 2 - 8) * Math.cos(radians);
      const y = radiuses.CY + (radiuses.width / 2 - 8) * Math.sin(radians);
  
      // zodiac icons offset to sector center
      const iconX =
        radiuses.CX -
        radiuses.zodiacR * Math.cos((midpointAngle + 90) * (Math.PI / 180));
      const iconY =
        radiuses.CY +
        radiuses.zodiacR * Math.sin((midpointAngle + 90) * (Math.PI / 180));
  
      svg
        .append("line")
        .attr("x1", radiuses.CX)
        .attr("y1", radiuses.CY)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke-width", 0.5)
        .style("stroke", "#ffffff");
  
      d3.xml(`/icons/zodiac-signs/${sign.name}.svg`).then((data) => {
        const icon = data.documentElement;
        // Append the loaded SVG to the chart
        svg.node().appendChild(icon);
  
        d3.select(icon)
          .attr("width", 28)
          .attr("height", 28)
          .attr("x", iconX - 28 / 2)
          .attr("y", iconY - 28 / 2)
          .attr("style", "pointer-events: all;")
          .attr("zodiac-sign", sign.name);
      });
    });
  }
  
  function drawHouses(data, radiuses) {
    const houses = data.houses;
    const houseNameR = (radiuses.aspectR + radiuses.houseR) / 2;
    const svg = d3.select("#natalChart");
    const strokeColor = "#ffffff";
    for (let i = 0; i < houses.length; i++) {
      const nextIndex = (i + 1) % houses.length;
      let longitude = houses[i].position.drawingLongitude;
      let nextLongitude = houses[nextIndex].position.drawingLongitude;
  
      if (longitude > nextLongitude) {
        nextLongitude += 360;
      }
  
      const midpointAngle = (nextLongitude + longitude) / 2;
      const radians = (longitude - 90) * (Math.PI / 180);
  
      const x = radiuses.CX + radiuses.houseR * Math.cos(radians);
      const y = radiuses.CY - radiuses.houseR * Math.sin(radians);
  
      const txtX =
        radiuses.CX +
        houseNameR * Math.cos((midpointAngle - 90) * (Math.PI / 180));
      const txtY =
        radiuses.CY -
        houseNameR * Math.sin((midpointAngle - 90) * (Math.PI / 180));
  
      // Append the line
      svg
        .append("line")
        .attr("x1", radiuses.CX)
        .attr("y1", radiuses.CY)
        .attr("x2", x)
        .attr("y2", y)
        .attr("long", longitude)
        .attr("stroke-width", 1.3)
        .style("stroke", strokeColor);
  
      svg
        .append("text")
        .style("text-anchor", "middle")
        .attr("x", txtX - 1 * Math.cos((midpointAngle - 90) * (Math.PI / 180)))
        .attr(
          "y",
  
          txtY + 1 * Math.sin((midpointAngle - 90) * (Math.PI / 180))
        )
        .text(i + 1)
        .attr("fill", strokeColor)
        .attr("font-family", "Metamorphous")
        .attr("font-size", "10px");
    }
  }
  
  function drawAxes(data, radiuses) {
    const axes = data.axes;
    const svg = d3.select("#natalChart");
    const strokeColor = "#ffffff";
  
    for (let axisKey in axes) {
      let axis = axes[axisKey];
  
      const radians = (axis.position.drawingLongitude - 90) * (Math.PI / 180);
  
      const x = radiuses.CX + radiuses.planetR * Math.cos(radians);
      const y = radiuses.CY - radiuses.planetR * Math.sin(radians);
  
      // Define the marker
      svg
        .append("defs")
        .append("marker")
        .attr("id", "arrow")
        .attr("markerWidth", 10)
        .attr("markerHeight", 10)
        .attr("refX", 10)
        .attr("refY", 3)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,0 L0,6 L9,3 z")
        .style("fill", strokeColor);
  
      // Append the line with arrow marker
      svg
        .append("line")
        .attr("x1", radiuses.CX)
        .attr("y1", radiuses.CY)
        .attr("x2", x)
        .attr("y2", y)
        .attr("axis", axisKey)
        .attr("stroke-width", 1.3)
        .style("stroke", strokeColor)
        .attr("marker-end", "url(#arrow)");
  
      svg
        .append("text")
        .style("text-anchor", "middle")
        .attr("x", x - 15 * Math.cos(radians))
        .attr("y", y + 15 * Math.sin(radians))
        .text(axisKey)
        .attr("fill", strokeColor)
        .attr("font-family", "Metamorphous")
        .attr("font-size", "10px");
    }
  }
  
  function drawPlanetMark(svg, cx, cy, r, planet, longitude, radians) {
    const x1 = cx + r * Math.cos(radians);
    const y1 = cy - r * Math.sin(radians);
    const x2 = cx + (r - 6) * Math.cos(radians);
    const y2 = cy - (r - 6) * Math.sin(radians);
    const line = svg
      .append("line")
      .attr("x1", x1)
      .attr("y1", y1)
      .attr("x2", x2)
      .attr("y2", y2)
      .attr("stroke", "rgba(255, 255, 255, 1)")
      .attr("long", longitude)
      .attr("mark-planet", planet)
      .attr("stroke-width", 2);
  }

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
  
  function drawPlanets(data, radiuses) {
    const planets = data.astros;
    const svg = d3.select("#natalChart");
    const strokeColor = "#ffffff";
    const planetsOrbit = radiuses.CX * 0.92;
  
    for (let planetKey in planets) {
      let planet = planets[planetKey];
      const radians = (planet.position.drawingLongitude - 90) * (Math.PI / 180);
  
      // draw mark on planet circle
      drawPlanetMark(
        svg,
        radiuses.CX,
        radiuses.CY,
        radiuses.planetR,
        planetKey,
        planet.position.drawingLongitude,
        radians
      );
  
      // draw mark on aspects circle
      drawPlanetMark(
        svg,
        radiuses.CX,
        radiuses.CY,
        radiuses.aspectR,
        planetKey,
        planet.position.drawingLongitude,
        radians
      );
  
      // x, y for planet svg
      const x = radiuses.CX + planetsOrbit * Math.cos(radians);
      const y = radiuses.CY - planetsOrbit * Math.sin(radians);
  
      // TO DO: prevent overlapping
  
      const line = svg
        .append("line")
        .attr("x1", x)
        .attr("y1", y)
        .attr("x2", radiuses.CX + radiuses.planetR * Math.cos(radians))
        .attr("y2", radiuses.CY - radiuses.planetR * Math.sin(radians))
        // choose better color
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 0.5);
  
      // Load SVG dynamically
      d3.xml(`/icons/planets/${planetKey}.svg`).then((data) => {
        const icon = data.documentElement;
        // Append the loaded SVG to the chart
        svg.node().appendChild(icon);
  
        // get details about planet onclick
        icon.addEventListener("click", function () {
          const storedData = JSON.parse(this.getAttribute("data-planet-info"));
          console.log(storedData);
          // Check if there are other scaled-up planet icons
          const scaledPlanets = d3.selectAll('svg[type="planet"][width="32"]');
          if (scaledPlanets.size() > 0) {
            // Scale down other scaled-up planet icons
            scaledPlanets.transition().attr("width", 24).attr("height", 24);
          }
  
          const hiddenAspects = d3.selectAll(
            'line[aspect-planets][hidden="true"]'
          );
          if (hiddenAspects.size() > 0) {
            // Return opacity
            hiddenAspects.attr("hidden", false).transition().style("opacity", 1);
          }
  
          d3.selectAll(
            `line[aspect-planets]:not([aspect-planets*="${planetKey}"])`
          )
            .attr("hidden", true)
            .transition()
            .style("opacity", 0.3);
  
          d3.select(this)
            .transition()
            .duration(300)
            .attr("width", 32)
            .attr("height", 32)
            .on("start", function () {
              // TODO: 1) check if opened any other info panels and close it if so
              //       2) open planet info  panel
  
              // Temporary info
              // check if there is opened info
              const openedInfo = document.querySelector(".info-window");
              if (openedInfo) {
                openedInfo.style.bottom = "-200px"; // Move out of view
                openedInfo.style.opacity = "0"; // Fade out the window
                setTimeout(() => {
                  document.body.removeChild(openedInfo); // Close the window
                }, 500); // Delay for the animation duration
              }
  
              // Create a tiny window to display information
              const infoWindow = document.createElement("div");
              infoWindow.classList.add("info-window");
              infoWindow.style.position = "fixed";
              infoWindow.style.width = `${window.innerWidth}px`;
              infoWindow.style.maxHeight = `${window.innerHeight - window.innerWidth - 20 - 64 - 40 - 48 }px`;
              infoWindow.style.bottom = "-100%"; // Start from bottom
              infoWindow.style.left = "0";
              infoWindow.style.opacity = "0";
              infoWindow.style.backgroundColor = "#0f1216";
              infoWindow.style.padding = "16px";
              console.log(storedData);

              
              // console.log(aspects);
              const zodiacNum = storedData.sign-1;
              const zodiac = zodiacSigns[zodiacNum].name;
              const retrograde = storedData.retrograde? "" : `<div class="info-retrograde">retrograde</div>`
              const info = `<div class="info-heading"><h3 class="info-h3">${storedData.name} <img src="/icons/planets/${storedData.name}.svg" alt="" class="info-planet-icon" /> in <img src="/icons/zodiac-signs/${zodiac}.svg" alt="" class="info-zodiac-icon" /> ${zodiac}</h3><p class="info-deg">${storedData.position.degrees}&#176; ${storedData.position.minutes}	
              &#8242; ${storedData.position.seconds}&#8243;</p><p class="info-type">type: ${storedData.type}</p>${retrograde}</div><div></div>`
              // infoWindow.innerText = JSON.stringify(storedData); // Display stored data

              const infoScroll = document.createElement("div");
              infoScroll.style.maxHeight = `${window.innerHeight - window.innerWidth - 20 - 64 - 40 - 48 - 32 }px`;
              infoScroll.style.overflowY = "auto";

              infoScroll.innerHTML = info;
              const aspects = document.querySelectorAll(`[aspect-planets*="${storedData.name}"]`);
              aspects.forEach((aspect) => {
                const aspectElement = document.createElement("p");
                aspectElement.classList.add("info-aspect");
                console.log("attr:", aspect.attributes[2].value)
                console.log("name:", storedData.name)
                let secondPlanet = aspect.attributes[2].value.replace(`${storedData.name}`,'');
                secondPlanet = secondPlanet.replace(" ", "");
                console.log("planet:", secondPlanet);
                const aspectType = aspect.attributes[3].value;
                aspectElement.innerHTML = `${aspectType} ${storedData.name} <img src="/icons/planets/${storedData.name}.svg" alt="" class="info-aspect-icon" /> <span class=${aspectType == "trigone"? "" : "aspect-type-font-big"}>${aspectsSymbols[aspectType]}</span> <img src="/icons/planets/${secondPlanet}.svg" alt="" class="info-aspect-icon" /> ${secondPlanet}`;
                infoScroll.appendChild(aspectElement);
              })
              infoWindow.appendChild(infoScroll);
              document.body.appendChild(infoWindow);
  
              // Animate the window to reveal from the bottom with opacity
              infoWindow.style.transition = "bottom 0.3s, opacity 0.3s";
  
              setTimeout(() => {
                infoWindow.style.bottom = "0"; // Move to reveal position
                infoWindow.style.opacity = "1"; // Fully reveal the window
              }, 200);
              // Add a close button to the window
              const closeButton = document.createElement("button");
              closeButton.classList.add("info-close-btn");
              closeButton.innerText = "x";
              closeButton.addEventListener("click", function () {
                infoWindow.style.bottom = "-200px"; // Move out of view
                infoWindow.style.opacity = "0"; // Fade out the window
                setTimeout(() => {
                  document.body.removeChild(infoWindow); // Close the window
                }, 500); // Delay for the animation duration
              });
              infoWindow.appendChild(closeButton);
            });
        });
        // Set attributes for the loaded SVG
        d3.select(icon)
          .attr("width", 20) // Adjust the width as needed
          .attr("height", 20)
          .attr("x", x - 20 / 2)
          .attr("y", y - 20 / 2)
          .attr("style", "pointer-events: all;")
          .attr("type", "planet")
          .attr("data-planet-info", JSON.stringify(planet));
      });
    }
  }
  
  const aspectsColors = {
    conjunction: "#6D1DBA",
    sextile: "#F1FF48",
    semisextile: "#F1FF48",
    quadrature: "#F56EBD",
    trigone: "#12D861",
    opposition: "#FF8A22",
    quincunx: "#6D1DBA",
  };

  const aspectsSymbols = {
    conjunction: "☌",
    sextile: "⚹",
    semisextile: "⚺",
    quadrature: "□",
    trigone: "△",
    opposition: "☍",
    quincunx: "⚻"
  };
  
  function drawAspects(data, radiuses) {
    const aspects = data.aspects;
    const svg = d3.select("#natalChart");
    for (let planetKey in aspects) {
      const aspectList = aspects[planetKey];
      if (aspectList.length > 0) {
        const planetName = planetKey;
        const longitude = data.astros[planetKey].position.drawingLongitude;
        const radians1 = (longitude - 90) * (Math.PI / 180);
        const x1 = radiuses.CX + (radiuses.aspectR - 6) * Math.cos(radians1);
        const y1 = radiuses.CY - (radiuses.aspectR - 6) * Math.sin(radians1);
  
        aspectList.forEach((aspect) => {
          const aspectName = aspect.name;
          const secondPlanet = aspect.second.name;
          const secondLongitude =
            data.astros[secondPlanet].position.drawingLongitude;
          const radians2 = (secondLongitude - 90) * (Math.PI / 180);
          const x2 = radiuses.CX + (radiuses.aspectR - 6) * Math.cos(radians2);
          const y2 = radiuses.CY - (radiuses.aspectR - 6) * Math.sin(radians2);
          const line = svg
            .append("line")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("aspect-planets", `${planetName} ${secondPlanet}`)
            .attr("aspect-name", aspectName)
            .style("stroke", aspectsColors[aspectName])
            .attr("x2", x2)
            .attr("y2", y2);
        });
      }
    }
  }
  
  function drawNatalChart(drawingData) {
    const data = drawingData.data;
    console.log(drawingData)
    const width = window.innerWidth;
    const svg = d3.select("#natalChart");
    const radiuses = {
      width: width,
      CX: width / 2,
      CY: width / 2 + 20,
      zodiacR: (width / 2) * 0.62,
      houseR: (width / 2) * 0.43,
      planetR: (width / 2) * 0.8,
      aspectR: (width / 2) * 0.32,
    };
  
    // draw planet circle
    drawCircle(svg, radiuses.CX, radiuses.CY, radiuses.planetR, "planet-circle");
    drawZodiac(data, radiuses);
    drawScaleLines(data, radiuses);
  
    // draw houses circle covering inner space, prevent zodiac axes to mix with house axes
    drawCircle(svg, radiuses.CX, radiuses.CY, radiuses.houseR, "house-circle");
    drawHouses(data, radiuses);
    drawAxes(data, radiuses);
  
    // draw aspects circle to cover all axes and free up space for drawing aspects
    drawCircle(svg, radiuses.CX, radiuses.CY, radiuses.aspectR, "aspects-circle");
    drawPlanets(data, radiuses);
    drawAspects(data, radiuses);
  }

  export {drawNatalChart}