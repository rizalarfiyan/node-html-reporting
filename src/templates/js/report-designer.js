// Make header perPages
const pages = document.querySelectorAll(".page");
pages.forEach((page) => {
  const child = page.children;
  if (child.length < 2) return;
  const firstElement = child[0];
  const secondElement = child[1];
  const thirdElement = child.length >= 3 ? child[2] : "";
  const firstTag = firstElement.tagName;
  const secondTag = secondElement.tagName;
  const isHeadingTag = firstTag == "H3";
  if (!(firstTag == "H5" && secondTag == "H3") && !isHeadingTag) return;
  const heading = isHeadingTag ? firstElement : secondElement;
  const titleWrap = document.createElement("div");
  titleWrap.className = "title";
  heading.classList = "heading";
  titleWrap.append(heading);
  if (thirdElement != "" && thirdElement.tagName == "H4") {
    thirdElement.classList = "subheading";
    titleWrap.append(thirdElement);
  }
  if (!isHeadingTag) {
    const subtitle = document.createElement("span");
    subtitle.innerText = firstElement.innerText;
    titleWrap.prepend(subtitle);
    firstElement.remove();
  }
  page.prepend(titleWrap);
});

// add Page Number
const footer = document.querySelectorAll(".footer .num-page");
const firstInPage = 2;
[...footer].map((data, idx) => {
  if (idx < firstInPage) return;
  footer[idx].innerHTML = `<p>${idx + 1 - firstInPage}</p>`;
});

// make SVG
const makeSvg = (
  color,
  svgPath = "M6 0h12s6 0 6 6v12s0 6-6 6h-12s-6 0-6-6v-12s0-6 6-6"
) => {
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", 10);
  svg.setAttribute("height", 10);
  svg.setAttribute("fill", color);
  path.setAttribute("d", svgPath);
  svg.appendChild(path);
  return svg;
};

// Add icon in header Dwellers against Footfall Count
const retailAnalytics = (headerElement, firstColElement, secondColElement) => {
  const firstCol = document.querySelector(firstColElement);
  const headerLabel = document.createElement("div");
  headerLabel.classList.add("labels");
  if (!!firstCol) {
    const image = firstCol.querySelector(".image");
    const wrapperChart = document.createElement("div");
    wrapperChart.classList.add("wrapper-chart");
    wrapperChart.appendChild(image);
    wrapperChart.append(headerLabel);
    firstCol.prepend(wrapperChart);
  }

  document.querySelectorAll(headerElement).forEach((data) => {
    const textHeading = data.innerText;
    data.innerHTML = "";
    let svgPath;
    switch (textHeading.toLowerCase()) {
      case "high value":
        svgPath = {
          path: "M19 5h-2V3H7v2H5a2 2 0 0 0-2 2v1a5 5 0 0 0 4.39 4.94 5 5 0 0 0 3.61 3V19H7v2h10v-2h-4v-3.1a5 5 0 0 0 3.61-3A5 5 0 0 0 21 8V7a2 2 0 0 0-2-2ZM5 8V7h2v3.82A3 3 0 0 1 5 8Zm14 0a3 3 0 0 1-2 2.82V7h2Z",
          fill: "#FFB300",
        };
        break;
      case "traffic drivers":
        svgPath = {
          path: "m10.33 11.72-3.39.87a10 10 0 0 1-1.82-5.07c-.3-3 .47-4.86 2.46-5.06s3 2 3.37 4.31a10.08 10.08 0 0 1-.62 4.95Zm.15.75-3.28 1a5.47 5.47 0 0 0 .57 2.35 2 2 0 0 0 2.38 1.42A1.9 1.9 0 0 0 11.41 15a5.67 5.67 0 0 0-.93-2.53Zm5.94-5.72c-2-.2-3 2-3.37 4.31a10.08 10.08 0 0 0 .62 5l3.39.87a10 10 0 0 0 1.82-5.07c.3-3.08-.47-4.86-2.46-5.11Zm-2.9 10a5.67 5.67 0 0 0-.93 2.55 1.9 1.9 0 0 0 1.26 2.21 2 2 0 0 0 2.38-1.42 5.47 5.47 0 0 0 .57-2.35Z",
          fill: "#27AE60",
        };
        break;
      case "under achievers":
        svgPath = {
          path: "m3.5 5.51 6 6 4-4 8.5 9.57-1.41 1.41-7.09-8-4 4L2 7Z",
          fill: "#3377B3",
        };
        break;
      case "niche players":
        svgPath = {
          path: "M7.2 11.2a3 3 0 1 1-3 3 3 3 0 0 1 3-3Zm4-8a3 3 0 1 1-3 3 3 3 0 0 1 3-3Zm5.6 11.6a3 3 0 1 1-3 3 3 3 0 0 1 3-3Z",
          fill: "#D3272F",
        };
        break;
    }

    if (typeof svgPath != "undefined") {
      const svgLogo = makeSvg(svgPath.fill, svgPath.path);
      data.appendChild(svgLogo);
    }

    if (!!firstCol && typeof svgPath != "undefined") {
      const wrapper = document.createElement("div");
      wrapper.classList.add("label");

      const svgLabel = makeSvg(svgPath.fill);
      const span = document.createElement("span");
      span.innerText = textHeading;

      wrapper.appendChild(svgLabel);
      wrapper.appendChild(span);
      headerLabel.appendChild(wrapper);
    }

    let wrapper = document.createElement("span");
    wrapper.innerText = textHeading;
    data.appendChild(wrapper);
  });

  const secondCol = document.querySelector(secondColElement);
  if (!!secondCol) {
    const wrapperTable = document.createElement("div");
    wrapperTable.classList.add("wrapper-table");
    secondCol.prepend(wrapperTable);
    Array.from(secondCol.children).forEach((elem) => {
      if (!(elem.tagName === "H4" || elem.tagName === "TABLE")) return;
      wrapperTable.appendChild(elem);
    });
  }
};

retailAnalytics(
  ".retail-analytic-scatter .column:not(:first-child) .header",
  ".retail-analytic-scatter .column:first-child",
  ".retail-analytic-scatter .column:nth-child(2)"
);
const RAHeader = document.querySelectorAll(
  ".retail-analytic-scatter .column:not(:first-child) .header"
);
const RAHeaderFirstCol = document.querySelector(
  ".retail-analytic-scatter .column:first-child"
);

// Add colors in table page-4
const table = document.querySelectorAll(
  ".overview-table tbody tr td:nth-child(3)"
);
const toFloat = (str) => parseFloat(str.replace(/[^\d.]/g, ""));
const percent = (num, max) => {
  if (max === 0 || num > max) return 1;
  if (num === 0) return 0;
  return (num / max).toFixed(2);
};

let maxTime = 0;
table.forEach((item) => {
  const numTime = toFloat(item.innerText);
  if (numTime > maxTime) maxTime = numTime;
});

table.forEach((item) => {
  const squareSvg = makeSvg(
    `rgba(3, 61, 168, ${percent(toFloat(item.innerText), maxTime)})`
  );
  item.appendChild(squareSvg);
});

// Add new notes in overview map
document.querySelectorAll(".overview-map .note ul.list").forEach((data) => {
  const addLi = document.createElement("li");
  addLi.innerText =
    "* Value shown may be shared by more than one (1) store. Refer to table for complete list.";
  data.append(addLi);
});

// Remove first heading table in overview column
const overviewHeading = document.querySelectorAll(".overview .column h5");
overviewHeading.forEach((heading) => {
  if (heading.innerText.trim() == "") heading.remove();
});

const overviewDetailHeading = document.querySelectorAll(".overview-detail h5");
overviewDetailHeading.forEach((val) => {
  if (!val.innerText.toLowerCase().includes("day with")) return;
  val.classList.add("muted");
});

// Get selected with min and max data
const selectWithMinMax = (listTable) => {
  listTable.forEach((listData) => {
    const [min, max] = listData.reduce(
      ([prevMin, prevMax], { value }) => [
        Math.min(prevMin, value),
        Math.max(prevMax, value),
      ],
      [Infinity, -Infinity]
    );

    listData.forEach((data) => {
      if (data.value != min && data.value != max) return;
      if (!data.hasOwnProperty("color")) {
        data.element.classList.add("selected");
        return;
      }
      data.element.style.backgroundColor = hexToRGBA(data.color, 0.1);
    });
  });
};

const hexToRGBA = (hex, alpha = 1) => {
  const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
};

// Find the disabled and selected tables in overview
const overviewTableSelect = (selector) => {
  const listTable = [[]];
  document.querySelectorAll(selector).forEach((data) => {
    const child = data.childNodes;
    if (child.length < 2) return;

    const commonTime = child[1].innerText;
    if (commonTime.trim() == "") {
      data.classList.add("disabled");
      return;
    }

    listTable[0].push({
      value: toFloat(commonTime),
      element: data,
    });
  });

  selectWithMinMax(listTable);
};

overviewTableSelect(".overview .column:not(:first-of-type) tr");

// Find the selected tables in overview detail
const overviewDetailTableSelect = (selector) => {
  const listTable = [[], []];
  document.querySelectorAll(selector).forEach((data) => {
    const child = data.childNodes;
    if (child.length < 3) return;

    listTable[0].push({
      value: toFloat(child[1].innerText),
      element: child[1],
    });

    listTable[1].push({
      value: toFloat(child[2].innerText),
      element: child[2],
    });
  });

  selectWithMinMax(listTable);
};

overviewDetailTableSelect(".overview-detail tbody tr");

// Add class for make width
const overviewColumn = document.querySelector(".overview .col");
if (!!overviewColumn) {
  const className = [
    `w-${overviewColumn.children.length - 1}`,
    "table-content",
  ];
  className.forEach((val) => {
    overviewColumn.classList.add(val);
  });
  const note = document.createElement("span");
  note.classList.add("public-holiday-note");
  note.innerText = "*Public holiday";
  overviewColumn.append(note);
}

// Add svg data in overview demographic
const pieColors = [
  "#033DA8",
  "#FFB300",
  "#CAE5FF",
  "#FF7C0D",
  "#c23531",
  "#2f4554",
  "#61a0a8",
  "#d48265",
  "#91c7ae",
  "#749f83",
  "#ca8622",
  "#bda29a",
  "#6e7074",
  "#546570",
  "#c4ccd3",
];
const overviewDemographicTable = document.querySelectorAll(
  ".overview-demographic table"
);
overviewDemographicTable.forEach((tableElement) => {
  const tdTable = tableElement.querySelectorAll("td:first-child");
  tdTable.forEach((element, idx) => {
    element.prepend(makeSvg(pieColors[idx]));
  });
});

const overviewDemographicTableCol2 = document.querySelectorAll(
  ".overview-demographic .col:nth-child(2) .column"
);
overviewDemographicTableCol2.forEach((element) => {
  const child = element.children;
  if (child.length < 3) return;
  const wrapper = document.createElement("div");
  const image = child[1];
  const table = child[2];
  wrapper.className = "chart-table";
  wrapper.append(...[image, table]);
  element.append(wrapper);
});

getTriangleProgress = (state) => {
  switch (state) {
    case "up":
      return {
        path: "M12 0 24 24H0L12 0Z",
        color: "#27ae60",
      };
    case "down":
      return {
        path: "M12 24 24 0H0L12 24Z",
        color: "#bb2b21",
      };
    default:
      return {
        path: "",
        color: "transparent",
      };
  }
};

const triangleProgress = document.querySelectorAll(
  ".overview-demographic table td:last-child"
);
triangleProgress.forEach((val) => {
  const { color, path } = getTriangleProgress(val.innerText);
  const svg = makeSvg(color, path);
  svg.classList.add("triangle-progress");
  val.innerHTML = svg.outerHTML;
});

document.querySelectorAll(".overview-demographic .image").forEach((element) => {
  const wrapper = element.parentNode;
  const parent = document.createElement("div");
  parent.classList.add(wrapper.classList);
  wrapper.classList = "overview-demographic-table";
  wrapper.parentNode.insertBefore(parent, wrapper);
  parent.appendChild(wrapper);
});

// adding Wrapper for Summary Text
const headingFive = document.querySelectorAll("h5");
const allowHeadingSummary = ["P", "OL", "UL"];
headingFive.forEach((element) => {
  if (element.innerText.trim().toLowerCase() != "summary") return;
  const wrapper = document.createElement("div");
  wrapper.className = "summary-text";
  element.before(wrapper);
  let next = element.nextSibling;
  while (next != null) {
    if (allowHeadingSummary.indexOf(next.tagName) === -1) break;
    wrapper.append(next);
    next = element.nextSibling;
  }
  wrapper.prepend(element);
});

// Overtime table
const tableDemographics = document.querySelectorAll(".over-time-table table");

const makeHeaderLabel = (header) => {
  const labels = document.createElement("div");
  labels.classList = "labels";

  header.forEach(({ name, color }) => {
    const label = document.createElement("div");
    label.classList = "label";
    const svg = makeSvg(color);
    const text = document.createElement("span");
    text.innerText = name;
    label.append(svg, text);
    labels.append(label);
  });
  return labels;
};

const findTableHead = (table, elemPage) => {
  const header = [];
  table.querySelectorAll("thead th").forEach((element, idx) => {
    if (idx === 0) return;
    const color = pieColors[idx - 1];
    header.push({
      name: element.innerText,
      color: typeof color !== "undefined" ? color : "transparent",
    });
  });
  table.querySelector("thead").remove();
  elemPage.querySelector(".title").append(makeHeaderLabel(header));
};

const hasWeek = (trElement) => {
  if (trElement == null) return false;
  return trElement.children[0].innerText.trim().toLowerCase().includes("week");
};

tableDemographics.forEach((table) => {
  const elemPage = table.closest(".page");
  findTableHead(table, elemPage);

  let tr = table.querySelectorAll("tbody tr");
  if (tr.length === 0) return;
  const totalChild = tr[0].children.length;
  const listTable = [...new Array(tr[0].children.length - 1)].map(() => []);
  tr.forEach((elemTr, idxTr) => {
    const td = elemTr.children;
    const isWeek = hasWeek(elemTr);
    const nextTr = idxTr + 1 < tr.length ? tr[idxTr + 1] : null;
    if (!hasWeek(nextTr) && !isWeek) elemTr.classList.add("border");
    if (!isWeek && td.length !== 0) {
      const day = td[0]?.innerText?.split(",")[0];
      if (day == "Sat" || day == "Sun") {
        elemTr.classList.add("weekend");
      }
    }
    Array.from(td).forEach((elemTd, idx) => {
      if (isWeek) {
        if (idx !== 0) return elemTd.remove();
        const parent = elemTd.parentElement;
        parent.classList.add("week-header");
        elemTd.setAttribute("colspan", td.length);
        if (idxTr === 0) return;
        const newTd = document.createElement("tr");
        newTd.classList = "spacer";
        parent.parentNode.insertBefore(newTd, parent);
        return;
      }
      if (idx === 0) return;
      const color = pieColors[idx - 1];
      listTable[idx - 1].push({
        value: toFloat(elemTd.innerText),
        element: elemTd,
        color: typeof color !== "undefined" ? color : "transparent",
      });
    });
  });
  selectWithMinMax(listTable);

  tr = table.querySelectorAll("tbody tr");
  const maxItems = Math.round(tr.length / 2);
  const devideTwo = [...Array(2)].map(() => {
    const newTable = document.createElement("table");
    const tbody = newTable.createTBody();
    const thead = newTable.createTHead();
    const rowHead = thead.insertRow(0);

    [...Array(totalChild)].forEach((val, idx) => {
      const columnHead = rowHead.insertCell(idx);
      if (idx === 0) return (columnHead.innerText = "");
      const span = document.createElement("span");
      span.innerText = "";
      span.classList = "info-header-color";
      span.style.backgroundColor = pieColors[idx - 1] || "transparent";
      columnHead.appendChild(span);
    });

    const column = document.createElement("div");
    column.classList = "column trend-over-time-table";
    column.appendChild(newTable);
    return {
      column: column,
      table: newTable,
      tbody: tbody,
    };
  });

  tr.forEach((elemTr, idx) => {
    if (idx + 1 === maxItems || idx + 1 === tr.length)
      elemTr.classList.remove("border");
    if (idx < maxItems) {
      devideTwo[0].tbody.appendChild(elemTr);
      return;
    }
    devideTwo[1].tbody.appendChild(elemTr);
  });

  const col = document.createElement("div");
  col.classList = "col";
  devideTwo.forEach((element) => col.append(element.column));
  table.after(col);
  table.remove();
});

// Add header notes
const addHeaderName = (coverSelector, pageSelector) => {
  const coverPage = document.querySelector(coverSelector);
  const pageName = coverPage?.querySelector("h3")?.innerText;
  const pageDate = coverPage?.querySelector("h4")?.innerText;
  if (coverPage === null) return;
  document.querySelectorAll(pageSelector).forEach((element) => {
    const header = document.createElement("div");
    header.classList.add("header-page");
    header.innerHTML = `${pageName} Report | <b>${pageDate}</b>`;
    element.appendChild(header);
  });
};

addHeaderName(".page.cover", ".page");
