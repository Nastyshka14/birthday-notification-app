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

  function shareOnFacebook() {
    const navUrl = `https://www.facebook.com/sharer/sharer.php?u=https://itra-course-work.herokuapp.com/`;
    window.open(navUrl, "_blank");
  }

  function shareOnVK() {
    const navUrl = `http://vk.com/share.php?url=${window.location.href}`;
    window.open(navUrl, "_blank");
  }

  function shareOnTelegram(item: string) {
    const navUrl = `https://t.me/share/url?url=${
      window.location.href
    }&text=${encodeURIComponent(item)}`;
    window.open(navUrl, "_blank");
  }

  function shareOnViber(item: string) {
    const navUrl = `viber://forward?text=${item} https://itra-course-work.herokuapp.com/`;
    window.open(navUrl, "_blank");
  }

  function shareOnWhatsApp(item: string) {
    const navUrl = `whatsapp://send?text=${item} https://itra-course-work.herokuapp.com/`;
    window.open(navUrl, "_blank");
  }

  function shareOnEmail(item: string) {
    const navUrl = `mailto:?subject=${item} today&amp;body=Check out this video https://youtu.be/yul2-4mc6mg`;
    window.open(navUrl, "_blank");
  }

  function shareOnSMS() {
    const navUrl = `sms://+995591062278?body=${encodeURIComponent("hello")}`;
    window.open(navUrl, "_blank");
  }

  const getNotificationBody = useCallback((item: string): JSX.Element => {
    return (
      <div className="notification">
        <p className="notification__message">{item}</p>
        <button className="notification__btn" onClick={shareOnFacebook}>
          FB
        </button>
        <button className="notification__btn" onClick={shareOnVK}>
          VK
        </button>
        <button className="notification__btn" onClick={shareOnSMS}>
          SMS
        </button>
        <button
          className="notification__btn" onClick={() => shareOnEmail(item)}
        >
          Email
        </button>
        <button
          className="notification__btn" onClick={() => shareOnTelegram(item)}
        >
          TG
        </button>
        <button
          className="notification__btn" onClick={() => shareOnViber(item)}
        >
          Viber
        </button>
        <button
          className="notification__btn" onClick={() => shareOnWhatsApp(item)}
        >
          WatsApp
        </button>
      </div>
    );
  }, []);

  const openNotification = useCallback(
    (item: string) => {
      const args = {
        message: "Notification",
        description: getNotificationBody(item),
        duration: 0,
      };
      notification.open(args);
    },
    [getNotificationBody]
  );

  useEffect(() => {
    getBirthdays().then((data: BirthdayItem[]) => setBirthdays(data));
  }, []);

  const getListData = (value: Moment): BirthdayItem[] => {
    const valueToISOString = moment(value.format("YYYY-MM-DD")).toISOString(
      true
    );
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
    const valueToISOString = moment(moment().format("YYYY-MM-DD")).toISOString(true);
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

  const dateCellRender = (value: Moment): JSX.Element => {
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
