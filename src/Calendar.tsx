import React from "react";
import { useState, useEffect } from "react";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const Calendar = () => {
  const [startDate, setStartDate] = useState<Date | null>();
  const [endDate, setEndDate] = useState<Date | null>();

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentDay, setCurrentDay] = useState(new Date().getDate());

  // keeps track of mm/dd/yyyy
  const [currentDateObj, setCurrentDateObj] = useState(
    new Date(currentYear, currentMonth, currentDay)
  );

  useEffect(() => {
    setCurrentYear(currentDateObj.getFullYear());
    setCurrentMonth(currentDateObj.getMonth());
    setCurrentDay(currentDateObj.getDate());
  }, [currentDateObj]);

  // a function to render day of week header
  const getHeader = () => {
    return (
      <>
        {["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"].map((dayOfWeek) => {
          return (
            <span
              key={dayOfWeek}
              style={{
                width: "13.5%",
                border: "1px solid black",
                display: "inline-block"
              }}
            >
              {dayOfWeek}
            </span>
          );
        })}
      </>
    );
  };

  const isSelected = (d: Date) => {
    if (!startDate) {
      return false;
    } else if (
      // start date
      d.getFullYear() === startDate.getFullYear() &&
      d.getMonth() === startDate.getMonth() &&
      d.getDate() === startDate.getDate()
    ) {
      return true;
    } else if (
      // end date
      endDate &&
      d.getFullYear() === endDate.getFullYear() &&
      d.getMonth() === endDate.getMonth() &&
      d.getDate() === endDate.getDate()
    ) {
      return true;
    } else if (
      // in between
      endDate &&
      d.getTime() > startDate.getTime() &&
      d.getTime() < endDate.getTime()
    ) {
      return true;
    }
    return false;
  };

  const isDayDisabled = (d: Date) => {
    // if date is older than today, or more than 6m from now, return true
    const today = new Date(Date.now());
    const beginningOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const sixMonthsFromNow = new Date(
      today.getFullYear(),
      today.getMonth() + 6,
      today.getDate()
    );
    return (
      d.getTime() < beginningOfToday.getTime() ||
      d.getTime() > sixMonthsFromNow.getTime()
    );
  };

  // render a span of currentDate in each grid
  const getDay = (dayOfWeek: number, weekNumber: number) => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    let currentDate = 0;
    // for isDayDisabled
    let cMonth = currentMonth;
    // only the first week and we are before the first of the month
    if (weekNumber === 0 && firstDayOfMonth.getDay() > dayOfWeek) {
      const lastDayOfPreMonth = new Date(currentYear, currentMonth, 0);
      const offset = firstDayOfMonth.getDay() - dayOfWeek - 1;
      currentDate = lastDayOfPreMonth.getDate() - offset;
      cMonth--;
      // only the last week and after the last day of the month
    } else if (weekNumber === 4 && lastDayOfMonth.getDay() < dayOfWeek) {
      const offset = dayOfWeek - lastDayOfMonth.getDay() - 1;
      currentDate = 1 + offset;
      cMonth++;
      // only the 3 weeks in between
    } else {
      currentDate = dayOfWeek - firstDayOfMonth.getDay() + 1 + 7 * weekNumber;
    }

    // create a current Date object
    const cDateObj = new Date(currentYear, cMonth, currentDate);

    const isDisabled = isDayDisabled(cDateObj);

    // set background color based on whether the currentDate isDisabled
    let backgroundColor = "white";
    if (isDisabled) {
      backgroundColor = "gray";
    }

    return (
      <span
        key={dayOfWeek}
        style={{
          width: "13.5%",
          height: "100%",
          border: "1px solid black",
          display: "inline-block",
          cursor: isDisabled ? "unset" : "pointer",
          backgroundColor: isSelected(cDateObj) ? "lightblue" : backgroundColor
        }}
        // key={weekNumber*dayOfWeek+currentDate}
        onClick={() => {
          if (isDisabled) {
            // reset start and end date
            setStartDate(null);
            setEndDate(null);
            return;
          }

          // startDate set and currentDate object is older than startDate object
          if (startDate && cDateObj < startDate) {
            setStartDate(cDateObj);
            setEndDate(null);
          } else if (!startDate) {
            setStartDate(cDateObj);
            // endDate not set
          } else if (!endDate) {
            setEndDate(cDateObj);
            // both startDate and endDate set
          } else if (startDate && endDate) {
            setStartDate(cDateObj);
            setEndDate(null);
          }
        }}
      >
        {currentDate}
      </span>
    );
  };

  // render 7 currentDate's in a row of week
  const getWeek = (weekNumber: number) => {
    return (
      <div key={weekNumber}
      style={{ width: "100%", height: "55px" }}>
        {[0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => {
          return getDay(dayOfWeek, weekNumber);
        })}
      </div>
    );
  };

  return (
    <>
      <div
        style={{
          margin: "auto",
          width: "15%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between"
        }}
      >
        <button
          onClick={() => {
            setCurrentDateObj(
              new Date(currentYear, currentMonth - 1, currentDay)
            );
          }}
        >
          Prev
        </button>
        <h3>
          {monthNames[currentDateObj.getMonth()]} {currentDateObj.getFullYear()}
        </h3>
        <button
          onClick={() => {
            setCurrentDateObj(
              new Date(currentYear, currentMonth + 1, currentDay)
            );
          }}
        >
          Next
        </button>
      </div>

      <div
        className="selectedRange"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: "20px"
        }}
      >
        {!startDate && (
          <div>
            <b>Please select start date and end date from the calendar</b>
          </div>
        )}
        {startDate && (
          <div>
            <b>Start Date:</b> {startDate.toDateString()}
          </div>
        )}
        {endDate && (
          <div>
            <b>End Date:</b> {endDate.toDateString()}
          </div>
        )}
      </div>

      {getHeader()}

      {[0, 1, 2, 3, 4].map((weekNumber) => {
        return getWeek(weekNumber);
      })}
    </>
  );
};

export { Calendar };
