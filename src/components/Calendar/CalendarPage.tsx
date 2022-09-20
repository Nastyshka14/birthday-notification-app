import React, { useEffect, useState, useCallback } from "react";
import { Calendar, notification } from "antd";
import { useContentful } from "src/hooks/useContentful";
import { GET_BIRTHDAYS } from '../../constants/graphQL'
import type { Moment } from "moment";
import moment from "moment";
import { message } from "antd";
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
  const { request } = useContentful();

  function shareOnFacebook() {
    const navUrl = `https://www.facebook.com/sharer/sharer.php?u=https://itra-course-work.herokuapp.com/?kcscmksnkc `;
    window.open(navUrl, "_blank");
  }

  function shareOnVK(item: string) {
    const navUrl = `http://vk.com/share.php?url=${window.location.href}&title=Today is ${item}`;
    window.open(navUrl, "_blank");
  }

  function shareOnTelegram(item: string) {
    const navUrl = `https://t.me/share/url?url=${window.location.href}&text=Today is ${encodeURIComponent(item)}`;
    window.open(navUrl, "_blank");
  }

  function shareOnViber(item: string) {
    const navUrl = `viber://forward?text=Today is ${item}`;
    window.open(navUrl, "_blank");
  }

  function shareOnWhatsApp(item: string) {
    const navUrl = `whatsapp://send?text=Today is ${item}`;
    window.open(navUrl, "_blank");
  }

  function shareOnEmail(item: string) {
    const navUrl = `mailto:?subject=Today is ${item}`;
    window.open(navUrl, "_blank");
  }

  function shareOnSMS(item: string) {
    const navUrl = `sms:?body=Today is ${item}`;
    window.open(navUrl, "_blank");
  }

  const getNotificationBody = useCallback((item: string): JSX.Element => {
    return (
      <div className="notification">
        <div className="notification__message">Today is {item}</div>
        <div className="notification__sprites">
          <button id="facebook"
            className="notification__btn notification__btn__facebook"
            onClick={shareOnFacebook} >
            </button>
          <button id="vk"
            className="notification__btn notification__btn__vk"
            onClick={() => shareOnVK(item)}>
            </button>
          <button id="sms"
            className="notification__btn notification__btn__sms"
            onClick={() => shareOnSMS(item)} />
          <button id="email"
            className="notification__btn notification__btn__email"
            onClick={() => shareOnEmail(item)} />
          <button id="telegram"
            className="notification__btn notification__btn__telegram"
            onClick={() => shareOnTelegram(item)} />
          <button id="viber"
            className="notification__btn notification__btn__viber"
            onClick={() => shareOnViber(item)} />
          <button id="whatsapp"
            className="notification__btn notification__btn__whatsapp"
            onClick={() => shareOnWhatsApp(item)} />
        </div>
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

  const showMessage = (msg: string) => {
    message.error(msg);
  };

  const getBirthdays = useCallback(async () => {
    try {
      const fetchBirthdays = await request({query: GET_BIRTHDAYS})
      return setBirthdays(JSON.parse(fetchBirthdays).data.birthdaysCollection.items)
    } catch (error) {
      showMessage(error.message);
    }
  }, [request])

  useEffect(() => {
    getBirthdays()
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

  const dateCellRender = (value: Moment): JSX.Element => {
    let listData: BirthdayItem[] = getListData(value);
    return (
      <ul className="events">
        {listData.length
          ? listData.map((item: BirthdayItem) => (
              <li key={item.name}>
                <p>{item.name}</p>
                <div className="nav__icon">
                </div>
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
