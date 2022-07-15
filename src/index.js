import moment from "moment";
import { MakePdf } from "./services";

const makeTable = () => {
  const dateRequest = "2022-01-15";

  const calendar = [];
  const days = [];
  const today = moment(dateRequest);
  const startMonth = today.clone().startOf("month");
  const endMonth = today.clone().endOf("month");
  const startDay = startMonth.clone().startOf("week");
  const endDay = endMonth.clone().endOf("week");
  const month = today.clone().month();

  let date = startDay.clone().subtract(1, "day");
  let week = 1;
  while (date.isBefore(endDay, "day")) {
    calendar.push({
      name: `Week ${week++}`,
      days: Array(7)
        .fill({})
        .map(() => {
          const day = date.add(1, "day").clone();
          return {
            date: day.format("DD-MM-YYYY"),
            name: day.format("DD MMMM"),
            incident: "0 min",
            isDisabled: day.month() !== month,
            isSelected: false,
          };
        }),
    });
  }

  date = startMonth.clone().subtract(1, "day");
  while (date.isBefore(endMonth, "day")) {
    days.push(date.add(1, "days").clone());
  }

  console.log(JSON.stringify(calendar, null, 2));
  console.log(JSON.stringify(days, null, 2));
};

const makeTime = () => {
  const startHour = moment("10:00:00", "HH:mm:ss");
  const endHour = moment("22:00:00", "HH:mm:ss");

  const timeLabel = [];
  let hours = startHour.clone().subtract(1, "hours");
  while (hours.isBefore(endHour, "hours")) {
    timeLabel.push(hours.add(1, "hours").clone().format("h A"));
  }

  console.log(JSON.stringify(timeLabel, null, 2));
};

// MakePdf.fetchData();
// makeTable();
// makeTime();
// MakePdf.buildPdf()
MakePdf.buildHtml();

class ReportDesigner {
  defaultOptions = {
    isPdf: false,
  };

  constructor(req, options) {
    this.req = req;
    this.options = { ...this.defaultOptions, ...options };
    this._init();
  }

  _init() {
    console.log("initialize...");

    const { date } = this.req.query;
    this.date = date ? moment(date) : moment();
    this.startMonth = this.date.clone().startOf("month");
    this.endMonth = this.date.clone().endOf("month");
    this.days = this.getDays();
    this.weeks = this.getweeks();
    this.weekMonths = this.getweeks(true);
    this.formatRange = this.getFormatRange();
  }

  getDays = () => {
    const days = [];
    let date = this.startMonth.clone().subtract(1, "day");
    while (date.isBefore(this.endMonth, "day")) {
      days.push(date.add(1, "days").clone());
    }
    return days;
  };

  getweeks = (thisMonth = false) => {
    const startDay = thisMonth
      ? this.startMonth.clone()
      : this.startMonth.clone().startOf("week");
    const endDay = thisMonth
      ? this.endMonth.clone()
      : this.endMonth.clone().endOf("week");

    let weeks = [];
    let date = startDay.clone().subtract(1, "day");
    let week = 1;
    while (date.isBefore(endDay, "day")) {
      const endOfWeek = date.clone().endOf("week").add(1, 'days');
      let count = thisMonth ? endOfWeek.diff(date, "days") : 7;
      if (endOfWeek.month() !== date.month() && week !== 1) {
        count = this.endMonth.clone().diff(date, "days")
      }
      if (count === 0) break
      const dayPerWeek = Array(count)
        .fill([])
        .map(() => {
          return date.add(1, "day").clone();
        });
      weeks.push({
        week: week++,
        dates: dayPerWeek,
      });
    }
    return weeks;
  };

  getFormatRange = () => {
    return `${this.startMonth.format("D")} - ${this.endMonth.format("D MMMM")}`;
  }

  getData = () => {
    return {
      date: this.date.format("DD-MM-YYYY"),
      days: this.days.map((date) => {
        return date.format('DD-MM-YYYY');
      }),
      startMonth: this.startMonth.format('DD-MM-YYYY'),
      endMonth: this.endMonth.format('DD-MM-YYYY'),
      weeks: this.weeks.map((week) => {
        return week.dates.map((date) => {
          return date.format("DD-MM-YYYY");
        });
      }),
      weekMonths: this.weekMonths.map((week) => {
        return week.dates.map((date) => {
          return date.format('DD-MM-YYYY');
        });
      }),
      weekdays: moment.weekdaysShort(),
      formatRange: this.formatRange,
    };
  };

  render() {
    // return Promise.all([this.getData()]);
    return this.getData();
  }
}

// const data = new ReportDesigner({
//   query: {
//     date: "2022-01-01",
//   },
// }).render();
// console.log(JSON.stringify(data, null, 2));
