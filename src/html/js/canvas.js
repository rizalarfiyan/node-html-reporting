class ImageMapper {
  defaultOptions = {
    scale: 1,
    cameraCoverage: false,
    publicZone: false,
    shopZone: false,
    isSelectRange: true,
    rangeIndex: 0,
    max: 5,
    space: 50,
  };

  imageBase64 = "data:image/png;base64,";

  constructor(floorData, visitorData, options) {
    this.data = floorData;
    this.visitor = visitorData;
    this.options = { ...this.defaultOptions, ...options };
    this._init();
    return this;
  }

  _init = async () => {
    this.image = new Image();
    this.image.src = this.getImageSource(this.data.processed_img);
    this.width = this.image.width;
    this.height = this.image.height;

    this.css = this.options?.css || "";
    this.js = this.options?.js || "";

    this.publicZones = this.data?.publicZones;
    this.cameras = this.data?.cameras;
    this.max = 0;
    this.startAdd = 0;
    this.topPath = [];

    this.newCanvas();
    this.fillCanvas();
  };

  newCanvas = () => {
    this.canvas = this.options.canvas;
    this.canvas.height = this.height;
    this.canvas.width = this.width + 200;
  };

  fillCanvas = () => {
    this.ctx = this.canvas.getContext("2d");
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.drawImage(this.image, 0, 0);
    const fillArea = this.modifyData(this.getFillArea());
    this.getMaxData(fillArea);
    this.renderPrefilledAreas(fillArea);
    this.renderLineLabel();
  };

  modifyData = (datas) => {
    let max = this.options.max;
    let arrTemp = [];
    for (let i = 0; i < max; i++) {
      arrTemp.push(this.generateRandom(1, 50));
    }

    arrTemp.sort((a, b) => a - b);
    const newArea = datas.areas.map((data) => {
      const isActive = Math.random() < 0.5 && max > 0;
      if (isActive) {
        max--;
      }
      return {
        ...data,
        isActive,
        commonTime: isActive ? `${arrTemp[max]} mins` : 0,
      };
    });
    datas.areas = newArea;
    return datas;
  };

  generateRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  getMaxData = (datas) => {
    datas.areas.map((data) => {
      const current = Math.max(...data.coords);
      if (current > this.max) {
        this.max = Math.round(current);
      }
    });
  };

  getFillArea = () => {
    let min = 0;
    let max = 0;
    const personData = this.data.zones.map((it) => it.total_person);
    const maxTotalPerson = Math.max.apply(Math, personData);
    const minTotalPerson = Math.min.apply(Math, personData);
    max = Math.ceil(maxTotalPerson / 50) * 50;
    min = Math.floor(minTotalPerson / 50) * 50;

    return {
      name: this.data.name,
      areas: [
        ...(this.options.shopZone ? this.getZoneAreas(max, min) : []),
        ...(this.options.publicZone ? this.getPublicZoneAreas() : []),
        ...(this.options.cameraCoverage ? this.getCameraAreas() : []),
      ],
    };
  };

  getZoneAreas = (max, min) => {
    let zones = [];

    if (
      this.data &&
      this.data.zones &&
      this.data.zones instanceof Array &&
      this.data.zones.length > 0
    ) {
      for (let i = 0; i < this.data.zones.length; i++) {
        let totalPerson = 0;
        if (this.options.isSelectRange) {
          totalPerson =
            this.data.zones[i].total_by_duration.length >
            this.options.rangeIndex
              ? this.data.zones[i].total_by_duration[this.options.rangeIndex]
                  .total
              : 0;
        } else {
          totalPerson = this.data.zones[i].total_person || 0;
        }

        let preFillColor = "";
        if (this.visitor.shop) {
          preFillColor =
            this.visitor.shop.zone_id === this.data.zones[i].id
              ? this.handleFindHexColor(totalPerson, max, min)
              : "";
        } else {
          preFillColor = this.handleFindHexColor(totalPerson, max, min);
        }

        zones.push({
          id: this.data.zones[i].id,
          name: this.data.zones[i].unit,
          shop_id: this.data.zones[i].shop_id,
          shop_name: this.data.zones[i].shop_name,
          shop_category_id: this.data.zones[i].shop_category_id,
          shop_category_name: this.data.zones[i].shop_category_name,
          shape: "poly",
          preFillColor,
          fillColor: "rgba(0, 0, 0, 0.2)",
          totalPerson,
          floorName: this.data.name,
          coords: this.data.zones[i].points.split(" ").map((v) => Number(v)),
          unit: this.data.zones[i].shop_name
            ? `${this.data.name}-${this.data.zones[i]?.unit}`
            : "",
        });
      }
    }
    return zones;
  };

  handleFindHexColor = (val, max, min) => {
    if (max <= min) {
      return `#EDEDED`;
    } else {
      const perPart = this.setPartRange(max);
      const indexColor =
        Math.floor(val / perPart) > 6 ? 6 : Math.floor(val / perPart);
      return legendColor[indexColor];
    }
  };

  setPartRange = (maxValue) => {
    const division = maxValue / 7;
    const digit = this.countDigit(division);
    let perPart;
    if (maxValue > 0) {
      if (digit == 1) {
        perPart = Math.floor(division);
      } else if (digit == 2) {
        perPart = Math.floor(division / 5) * 5;
      } else if (digit >= 3) {
        perPart = Math.floor(division / 50) * 50;
      }
    } else {
      perPart = 10;
    }
    return perPart;
  };

  countDigit = (num) => {
    if (num === 0) return 1;
    return Math.floor(Math.log10(Math.abs(num))) + 1;
  };

  getPublicZoneAreas = () => {
    return this.publicZones.map((publicZone) => ({
      name: `Public Zone ${publicZone.id}`,
      shape: "poly",
      preFillColor: "rgba(52, 73, 94,1.0)",
      coords: publicZone.points.split(" ").map((point, i) => {
        return Number(point);
      }),
    }));
  };

  getCameraAreas = () => {
    return this.cameras.map((camera) => {
      return {
        name: `Camera Zone ${camera.id}`,
        shape: "poly",
        preFillColor: "rgba(52, 152, 219, 0.4)",
        coords: this.mapCameraToConeCoordinates(camera),
      };
    });
  };

  mapCameraToConeCoordinates = (camera) => {
    let { camera_loc_x: x, camera_loc_y: y, rotation } = camera;
    let coordinates = [x, y];

    let fieldOfView = 105;
    let rotationRad = ((90 - rotation) * Math.PI) / 180;
    let leftRad = rotationRad - ((fieldOfView / 2) * Math.PI) / 180;
    let rightRad = rotationRad + ((fieldOfView / 2) * Math.PI) / 180;
    let length = 50;

    for (let angle = leftRad; angle <= rightRad; angle += 0.01) {
      let pointX = parseInt(x + length * Math.cos(angle));
      let pointY = parseInt(y - length * Math.sin(angle));
      coordinates.push(pointX, pointY);
    }

    return coordinates;
  };

  scaleCoords = (coords) => {
    return coords.map((coord) => coord * this.options.scale);
  };

  renderPrefilledAreas = (mapData) => {
    mapData.areas.map((area) => {
      if (!area.preFillColor) return false;
      this.renderPerArea(area.shape, {
        coords: this.scaleCoords(area.coords),
        fillColor: area.preFillColor,
        lineWidth: area.lineWidth,
        strokeColor: area.strokeColor,
        ctx: this.ctx,
        name: area.name,
        isActive: area.isActive,
        commonTime: area.commonTime,
      });
      return true;
    });
  };

  renderPerArea = (shape, data) => {
    if (shape === "rect") {
      return this.drawRect(data);
    }
    if (shape === "circle") {
      return this.drawCircle(data);
    }
    if (shape === "poly") {
      return this.drawPoly(data);
    }
    return false;
  };

  drawRect = ({
    coords,
    fillColor,
    lineWidth,
    strokeColor,
    isActive,
    commonTime,
    name,
  }) => {
    const [left, top, right, bot] = coords;
    this.ctx.fillStyle = fillColor;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = strokeColor;
    this.ctx.strokeRect(left, top, right - left, bot - top);
    this.ctx.fillRect(left, top, right - left, bot - top);

    if (isActive) {
      this.topPath.push({
        x: (right - left) / 2 + left,
        y: (bot - top) / 2 + top,
        commonTime,
        name,
      });
    }
  };

  drawCircle = ({
    coords,
    fillColor,
    lineWidth,
    strokeColor,
    isActive,
    commonTime,
    name,
  }) => {
    this.ctx.fillStyle = fillColor;
    this.ctx.beginPath();
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = strokeColor;
    this.ctx.arc(coords[0], coords[1], coords[2], 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.fill();

    if (isActive) {
      this.topPath.push({
        x: coords[0],
        y: coords[1],
        commonTime,
        name,
      });
    }
  };

  drawPoly = ({
    coords,
    fillColor,
    lineWidth,
    strokeColor,
    isActive,
    commonTime,
    name,
  }) => {
    const newCoords = coords.reduce(
      (a, v, i, s) => (i % 2 ? a : [...a, s.slice(i, i + 2)]),
      []
    );
    this.ctx.fillStyle = fillColor;
    this.ctx.beginPath();
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = strokeColor;
    newCoords.forEach((c) => this.ctx.lineTo(c[0], c[1]));
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.fill();

    if (isActive) {
      const getCenterPoly = polylabel([newCoords]);
      this.topPath.push({
        x: getCenterPoly[0],
        y: getCenterPoly[1],
        commonTime,
        name,
      });
    }
  };

  renderLineLabel = () => {
    this.topPath.sort((a, b) => {
      return a.y - b.y;
    });

    this.prevPosition = 0
    this.topPath.map((data) => {
      this.makeLineLabel(data);
    });
  };

  makeLineLabel = ({ x, y, commonTime, name }) => {
    this.ctx.beginPath();
    this.ctx.arc(x, y, 2, 0, 4 * Math.PI);
    this.ctx.stroke();

    let newYAxis = y
    if (y - this.prevPosition < this.options.space) {
      newYAxis = this.prevPosition + this.options.space
    }
    this.prevPosition = newYAxis
    
    const xPosition = this.max + 20
    const yCenterText = newYAxis + 5
    const commonTimeLong = commonTime.length * 10

    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + Math.abs(newYAxis - y), newYAxis);
    this.ctx.lineTo(xPosition, newYAxis);

    this.ctx.fillStyle = "#332f28";
    this.ctx.font = "normal 18px Poppins";
    this.ctx.fillText(commonTime, xPosition + 10, yCenterText);

    this.ctx.fillStyle = "#747474";
    this.ctx.font = "normal 18px Poppins";
    this.ctx.fillText(name, xPosition + 20 + commonTimeLong, yCenterText);
    this.ctx.stroke();
    this.startAdd++;
  };

  getImageSource = (base64) => {
    if (base64.includes("data:image/")) {
      return base64;
    } else {
      return this.imageBase64 + base64;
    }
  };

  getImageBase64(buffer) {
    return this.imageBase64 + buffer.toString("base64");
  }

  getNameInfo = (num) => {
    return `${num} min${num === 1 ? "" : "s"}`;
  };

  addCss = ({ width, height }) => {
    this.css.trim();
    if (this.css === "") return "";
    const rootCss = `
    @import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");
    :root {
      --width: ${width}px;
      --height: ${height}px;
    }`;
    return `<style type="text/css">${rootCss}\n${this.css}</style>`;
  };

  addJs = () => {
    this.js.trim();
    if (this.js === "") return "";
    return `<script type="text/javascript">${this.js}</script>`;
  };

  buildContent = ({ name, highest, lowest, average, image }) => {
    return `
    <div class="wrapper-map">
      <table class="info">
        <tbody>
          <tr>
            <td>Highest</td>
            <td>:</td>
            <td>${this.getNameInfo(highest)}</td>
          </tr>
          <tr>
            <td>Lowest</td>
            <td>:</td>
            <td>${this.getNameInfo(lowest)}</td>
          </tr>
          <tr>
            <td>Average</td>
            <td>:</td>
            <td>${this.getNameInfo(average)}</td>
          </tr>
        </tbody>
      </table>
      <div class="colors">
        <h1>${name}</h1>
        <ul>
          <li>60</li>
          <li>50</li>
          <li>40</li>
          <li>30</li>
          <li>20</li>
          <li>10</li>
          <li>0</li>
          <li>No Data</li>
        </ul>
      </div>
      <img src="${image?.data}" alt="${image?.name}">
    </div>`;
  };

  getHtml = (data) => {
    return this.addCss(data) + this.buildContent(data) + this.addJs();
  };

  renderToBase64() {
    return new Promise((resolve, reject) => {
      const options = {
        width: 1120,
        height: 750,
        highest: 5,
        lowest: 1,
        average: 3,
        name: this.data.name,
        image: {
          data: this.canvas.toDataURL(),
          name: "Image " + this.data.name,
        },
      };

      htmlToImage({
        html: this.getHtml(options),
      })
        .then((buffer) => {
          return resolve(this.getImageBase64(buffer));
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }
}
