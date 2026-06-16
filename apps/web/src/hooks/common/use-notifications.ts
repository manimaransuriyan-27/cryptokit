import { notification } from 'antd';

export function useAppNotification() {
  const [api, contextHolder] = notification.useNotification();

  // 1. Wrap the notification types into clean semantic functions
  const success = (title: string, description?: string) => {
    api.success({
      title,
      description,
      placement: 'topRight',
      duration: 5,
    });
  };

  const error = (title: string, description?: string) => {
    api.error({
      title,
      description,
      placement: 'topRight',
      duration: 10,
    });
  };

  const info = (title: string, description?: string) => {
    api.info({
      title,
      description,
      placement: 'topRight',
      duration: 8,
    });
  };

  const warning = (title: string, description?: string) => {
    api.warning({
      title,
      description,
      placement: 'topRight',
      duration: 8,
    });
  };

  // 2. Return the helpers alongside the context node
  return {
    success,
    error,
    info,
    warning,
    notificationContextHolder: contextHolder,
  };
}
