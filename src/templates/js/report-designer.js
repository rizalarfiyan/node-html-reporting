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
    thirdElement.classList = "subheading"
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
[...footer].map((data, idx) => {
  footer[idx].innerHTML = `<p>${(idx += 1)}</p>`;
});

// Add icon in header Dwellers against Footfall Count
const header = document.querySelectorAll(
  ".retail-analytic-scatter .column .header"
);
header.forEach((data) => {
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
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    path.setAttribute("d", svgPath.path);
    path.setAttribute("fill", svgPath.fill);
    svg.appendChild(path);
    data.appendChild(svg);
  }

  let wrapper = document.createElement("span");
  wrapper.innerText = textHeading;
  data.appendChild(wrapper);
});

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
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", 10);
  svg.setAttribute("height", 10);
  svg.setAttribute(
    "fill",
    `rgba(3, 61, 168, ${percent(toFloat(item.innerText), maxTime)})`
  );
  path.setAttribute("d", "M6 0h12s6 0 6 6v12s0 6-6 6h-12s-6 0-6-6v-12s0-6 6-6");
  svg.appendChild(path);
  item.appendChild(svg);
});

document.querySelectorAll(".overview-map .note ul.list").forEach((data) => {
  const addLi = document.createElement("li");
  addLi.innerText =
    "* Value shown may be shared by more than one (1) store. Refer to table for complete list.";
  data.append(addLi);
});
