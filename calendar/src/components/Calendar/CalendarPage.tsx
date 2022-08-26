import React, { useEffect, useState } from "react";
import "./CalendarPage.scss";
import { Calendar, Modal, notification } from "antd";
import "antd/dist/antd.css";
import { useContentful } from "../../useContentful";
import type { Moment } from "moment";
import moment from "moment";
import dayjs from "dayjs";
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
  const [birthdays, setBirthdays] = useState<{ name: string; date: string }[]>([]);
  const { getBirthdays } = useContentful();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isRead, setIsRead] = useState<boolean>(false);

  const showModal = useCallback(() => {
    if (isRead === false) {
      setIsModalVisible(true);
    }
  }, [isRead]);

  const handleSubmit = () => {
    setIsModalVisible(false);
    setIsRead(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsRead(true);
  };

  // const openNotification = () => {
  //   const args = {
  //     message: 'Notification Title',
  //     description:
  //       'I will never close automatically. This is a purposely very very long description that has many many characters and words.',
  //     duration: 0,
  //   };
  //   notification.open(args);
  // };

  useEffect(() => {
    getBirthdays().then((data) => 
    setBirthdays(data))
  }, [getBirthdays]);

  const getListData = (value: Moment) => {
    const listData: ListDataItem[] = [];
    birthdays.forEach((element: BirthdayItem) => {
      if (element.date === value.format("YYYY-MM-DD")) {
        listData.push(element);
      }
    });
    return listData || [];
  };

  const getReminder = useCallback(() => {
    birthdays.forEach((item: BirthdayItem) => {
      if (item.date === dayjs().format("YYYY-MM-DD")) {
        showModal();
      }
    });
  }, [birthdays, showModal]);

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
      <Calendar dateCellRender={dateCellRender} className='calendar__item' />
      <Modal className='modal__item'
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
      ></Modal>
    </div>
  );
};
