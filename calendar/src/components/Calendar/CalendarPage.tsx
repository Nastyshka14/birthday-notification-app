import React, { useEffect, useState } from "react";
import "./CalendarPage.scss";
import { Calendar, notification } from "antd";
import "antd/dist/antd.css";
import { useContentful } from "../../useContentful";
import type { Moment } from "moment";
import moment from "moment";
import { useCallback } from "react";
moment.updateLocale("en", { week: { dow: 1 } });

interface ListDataItem {
  name: string;
  date: string;
}

interface BirthdayItem {
  name: string;
  date: string;
}

export const CalendarPage = () => {
  const [birthdays, setBirthdays] = useState<{ name: string; date: string }[]>(
    []
  );
  const { getBirthdays } = useContentful();

  const openNotification = useCallback((item: string) => {
    const args = {
      message: "Notification",
      description: item,
      duration: 0,
    };
    notification.open(args);
  }, []);

  useEffect(() => {
    getBirthdays().then((data) => setBirthdays(data));
  }, [getBirthdays]);

  const getListData = (value: Moment) => {
    const listData: ListDataItem[] = [];
    birthdays.forEach((element: BirthdayItem) => {
      if (
        element.date === moment(value.format("YYYY-MM-DD")).toISOString(true)
      ) {
        listData.push(element);
      }
    });
    return listData || [];
  };

  const getReminder = useCallback(() => {
    birthdays.forEach((item: BirthdayItem) => {
      if (
        item.date === moment(moment().format("YYYY-MM-DD")).toISOString(true)
      ) {
        return openNotification(item.name);
      }
    });
  }, [birthdays, openNotification]);

  useEffect(() => {
    getReminder();
  }, [getReminder]);

  const dateCellRender = (value: Moment) => {
    let listData: ListDataItem[] = getListData(value);
    return (
      <ul className="events">
        {listData.map((item: ListDataItem) => (
          <li key={item.name}>
            <p>{item.name}</p>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="calendar">
      <Calendar dateCellRender={dateCellRender} className="calendar__item" />
    </div>
  );
};
