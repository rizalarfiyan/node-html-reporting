class EditorJsToHtml {
  constructor() {
    return this;
  }

  transforms = {
    delimiter: {
      parser: (data) => this.parseDelimiter(data),
    },
    header: {
      class: () => ["header"],
      parser: (data) => this.parseHeader(data),
    },
    paragraph: {
      parser: (data) => this.parseParagraph(data),
    },
    list: {
      parser: (data) => this.parseList(data),
    },
    image: {
      class: (data) => this.classImage(data),
      parser: (data) => this.parseImage(data),
    },
    quote: {
      parser: (data) => this.parseQuote(data),
    },
    code: {
      parser: (data) => this.parseCode(data),
    },
    embed: {
      parser: (data) => this.parseEmbed(data),
    },
    checklist: {
      parser: (data) => this.parseChecklist(data),
    },
    raw: {
      parser: (data) => this.parseRaw(data),
    },
    table: {
      parser: (data) => this.parseTable(data),
    },
    warning: {
      parser: (data) => this.parseWarning(data),
    },
    columns: {
      class: () => ["col"],
      parser: (data) => this.parseColumns(data),
    },
  };

  tunes = {
    anyTuneName: (data) => this.parseAnyTuneName(data),
  };

  getClass = (block) => {
    const arrClassName = [
      ...(this.transforms[block.type]?.class
        ? this.transforms[block.type]?.class(block)
        : []),
      ...this.getTunes(block?.tunes),
    ];
    const className = arrClassName
      .join(" ")
      .replace(/ +(?= )/g, "")
      .trim();
    return !!className ? ` class="${className}"` : "";
  };

  getTunes = (tunes) => {
    if (!tunes) return [];
    const arrClassTunes = [];
    this.intersectionArray(Object.keys(tunes), Object.keys(this.tunes)).map(
      (tuneName) => {
        arrClassTunes.push(this.tunes[tuneName](tunes[tuneName]));
      }
    );
    return arrClassTunes;
  };

  intersectionArray(arr1, arr2) {
    return arr1.filter((tune) => {
      return arr2.indexOf(tune) !== -1;
    });
  }

  randomId(prefix) {
    return Math.random()
      .toString(36)
      .replace("0.", prefix || "");
  }

  toKebabCase = (str) => {
    return (
      str &&
      str
        .match(
          /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
        )
        .map((x) => x.toLowerCase())
        .join("-")
    );
  };

  //! Parse transform
  parseDelimiter = () => {
    return `<br/>`;
  };

  parseHeader = (block) => {
    const {
      data: { level, text },
    } = block;
    const heading = `h${level}`;
    const className = this.getClass(block);
    return `<${heading}${className}>${text}</${heading}>`;
  };

  parseParagraph = (block) => {
    const {
      data: { text },
    } = block;
    const className = this.getClass(block);
    return `<p${className}>${text}</p>`;
  };

  parseList = (block) => {
    const {
      data: { style, items },
    } = block;
    const className = this.getClass(block);

    const listStyle = style === "unordered" ? "ul" : "ol";
    const recursor = (items, listStyle) => {
      const list = items.map(({ content, items }) => {
        if (!content && !items) return `<li>${item}</li>`;
        let list = "";
        if (items) list = recursor(items, listStyle);
        if (content) return `<li>${content}</li>` + list;
      });
      return `<${listStyle}${className}>${list.join("")}</${listStyle}>`;
    };
    return recursor(items, listStyle);
  };

  classImage = ({ withBorder, stretched, withBackground }) => {
    const className = ["image"];
    if (!!withBorder) className.push("bordered");
    if (!!stretched) className.push("stretched");
    if (!!withBackground) className.push("backgrounded");
    return className;
  };

  parseImage = (block) => {
    const { data } = block;
    const caption = data.caption ? data.caption : "Image";
    const source = data.file && data.file.url ? data.file.url : data.url;
    const className = this.getClass(block);
    return `
      <div${className}>
        <img src="${source}" alt="${caption}" />
      </div>`;
  };

  parseQuote = (block) => {
    const {
      data: { text, caption },
    } = block;
    const className = this.getClass(block);
    return `
      <div${className}>
        <blockquote>${text}</blockquote> - ${caption}
      </div>`;
  };

  parseCode = (block) => {
    const {
      data: { code },
    } = block;
    const className = this.getClass(block);
    return `
      <div${className}>
        <pre><code>${code}</code></pre>
      </div>`;
  };

  parseEmbed = (block) => {
    const {
      data: { service, embed, width, height },
    } = block;
    const className = this.getClass(block);
    let iframe = "";
    switch (service) {
      case "vimeo":
        iframe = `<iframe src="${embed}" height="${height}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
      case "youtube":
        iframe = `<iframe width="${width}" height="${height}" src="${embed}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }
    if (!!iframe) return;
    return `<div${className}>${iframe}</div>`;
  };

  parseChecklist = (block) => {
    const {
      data: { items },
    } = block;
    const className = this.getClass(block);
    const checklists = items.map(({ text, checked }) => {
      const idx = this.randomId("radio-");
      const isChecked = checked ? "checked" : "";
      return `
      <div class="radio-group">
        <input type="radio" name="${this.toKebabCase(
          text
        )}" id="${idx}" value="${!!checked}" ${isChecked}>
        <label for="${idx}">${text}</label>
      </div>`;
    });
    return `<div${className}>${checklists.join("")}</div>`;
  };

  parseRaw = (block) => {
    const {
      data: { html },
    } = block;
    const className = this.getClass(block);
    return `<div${className}>${html}</div>`;
  };

  parseTable = (block) => {
    const {
      data: { withHeadings, content },
    } = block;
    if (content.length === 0) return;
    let tableHeader = "";
    if (withHeadings) {
      tableHeader = `
      <thead>
        <tr>
          ${content[0]
            .map((item) => {
              return `<th><span>${item}</span></th>`;
            })
            .join("")}
        </tr>
      </thead>`;
      content.splice(0, 1)
    }
    const tableBody = content.map((item) => {
      const columns = item.map((column) => {
        return `<td><span>${column}</span></td>`;
      });
      return `<tr>${columns.join("")}</tr>`;
    });
    const className = this.getClass(block);
    return `
    <table${className}>
      ${tableHeader}
      <tbody>
        ${tableBody.join("")}
      </tbody>
    </table>`;
  };

  parseWarning = (block) => {
    const {
      data: { title, message },
    } = block;
    const className = this.getClass(block);
    return `
    <figure${className}>
      <figcaption>${title}</figcaption>
      <p>${message}</p>
    </figure>
    `;
  };

  parseColumns = (block) => {
    const {
      data: { cols },
    } = block;
    const columns = cols.map(({ blocks: col }) => {
      const cols = this.parse(col).join("");
      return `<div class="column">${cols}</div>`;
    });
    const className = this.getClass(block);
    return `<div${className}>${columns.join("")}</div>`;
  };

  //! Parse tunes
  parseAnyTuneName = ({ alignment }) => {
    switch (alignment) {
      case "center":
        return "float-center";
      case "right":
        return "float-right";
      case "left":
        return "float-left";
    }
  };

  parse = (blocks) => {
    if (blocks === undefined || !Array.isArray(blocks)) return [];

    return blocks.map((block) => {
      return this.transforms[block?.type]
        ? this.transforms[block.type].parser(block)
        : [];
    });
  };
}

export default EditorJsToHtml;
