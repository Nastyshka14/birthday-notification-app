export interface INotification {
    openNotification: (item: string) => void;
    getNotificationBody: (item: string) => JSX.Element;
    shareSocials: (item: string) => void;
    }
    