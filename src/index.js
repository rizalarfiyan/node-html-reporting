import moment from "moment";

import { MakePdf } from './services';

const makeTable = () => {
  const dateRequest = "2022-01-15";

  const calendar = [];
  const today = moment(dateRequest);
  const startDay = today.clone().startOf("month").startOf("week");
  const endDay = today.clone().endOf("month").endOf("week");
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

  console.log(JSON.stringify(calendar, null, 2));
};

// makeTable();
// MakePdf.buildPdf()
MakePdf.buildHtml()