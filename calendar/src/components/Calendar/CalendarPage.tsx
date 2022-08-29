import React, { useEffect, useState } from "react";
import "./CalendarPage.css";
import { Calendar, Modal } from "antd";
import "antd/dist/antd.css";
import { useContentful } from "../../useContentful.ts";
import type { Moment } from "moment";
import moment from "moment";
import dayjs from "dayjs";
import { postEntry } from "../../postContentful.js";
moment.updateLocale("en", { week: { dow: 1 } });

interface ListDataItem {
  isRead: boolean;
  name: string;
  date: string;
}

interface BirthdayItem {
  isRead: boolean;
  name: string;
  date: string;
}

interface PersonInfo {
  setIsModalVisible(): void;
}
export const CalendarPage = () => {
  const [birthays, setBirthdays] = useState([]);
  const { getBirthdays } = useContentful();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    getBirthdays().then((response) => setBirthdays(response));
  }, []);

  const getListData = (value: Moment) => {
    const listData: ListDataItem[] = [];

    birthays.forEach((element) => {
      if (element.date === value.format("YYYY-MM-DD")) {
        listData.push(element);
      }
    });
    return listData || [];
  };

  const getReminder = () => {
    birthays.forEach((item) => {
      if (item.date === dayjs().format("YYYY-MM-DD")) {
        showModal()
      }
    });
  };

  useEffect(() => {
    setInterval(() => {
      getReminder();
    }, 5000);
  }, []);

  const dateCellRender = (value: any) => {
    let listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item: any) => (
          <li key={item.name}>
            <p>{item.name}</p>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <Calendar dateCellRender={dateCellRender} />
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      ></Modal>
    </>
  );
};
