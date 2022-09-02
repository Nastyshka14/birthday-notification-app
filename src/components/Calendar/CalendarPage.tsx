import React, { useEffect, useState, useCallback } from "react";
import { Calendar, notification } from "antd";
import { useContentful } from "../../useContentful";
import type { Moment } from "moment";
import moment from "moment";
import "./CalendarPage.scss";
import "antd/dist/antd.css";

moment.updateLocale("en", { week: { dow: 1 } });

interface BirthdayItem {
  name: string;
  date: Date;
}

export const CalendarPage = () => {
  const [birthdays, setBirthdays] = useState<{ name: string; date: Date }[]>([]);
  const [newBirthdaysList, setNewBirthdaysList] = useState<string[]>([]);
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
    const valueToISOString = moment(value.format("YYYY-MM-DD")).toISOString(true);
    const listData: BirthdayItem[] = [];
    birthdays.forEach((element: BirthdayItem) => {
      if (element.date.toString() === valueToISOString) {
        listData.push(element);
      }
    });
    return listData || [];
  };

  const pushItem = useCallback(
    (itemName: string) => {
      newBirthdaysList.push(itemName);
      openNotification(itemName);
      localStorage.setItem(
        "todayBirthdaysList",
        JSON.stringify(newBirthdaysList)
      );
    },
    [newBirthdaysList, openNotification]
  );

  const getReminder = useCallback(() => {
    const valueToISOString = moment(moment().format("YYYY-MM-DD")).toISOString(
      true
    );
    const todayBirthdaysList = JSON.parse(
      localStorage.getItem("todayBirthdaysList")
    );
    birthdays.forEach((item: BirthdayItem) => {
      if (item.date.toString() === valueToISOString) {
        if (todayBirthdaysList !== null) {
          if (!todayBirthdaysList.includes(item.name)) {
            JSON.parse(localStorage.getItem("todayBirthdaysList"));
            pushItem(item.name);
          }
        } else if (!newBirthdaysList.includes(item.name)) {
          pushItem(item.name);
        }
      }
    });
  }, [birthdays, newBirthdaysList, pushItem]);

  useEffect(() => {
    getReminder();
  }, [getReminder]);

  const dateCellRender = (value: Moment) => {
    let listData: BirthdayItem[] = getListData(value);
    return (
      <ul className="events">
        {listData.length
          ? listData.map((item: BirthdayItem) => (
              <li key={item.name}>
                <p>{item.name}</p>
              </li>
            ))
          : ""}
      </ul>
    );
  };

  return (
    <div className="calendar">
      <Calendar dateCellRender={dateCellRender} className="calendar__item" />
    </div>
  );
};
