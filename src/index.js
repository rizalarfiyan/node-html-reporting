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