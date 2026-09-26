type NotifierParams = {
  show: boolean;
  content?: string;
  color?: string;
  error?: unknown;
};
const notification = reactive<NotifierParams>({
  show: false,
});

export const useNotifier = () => {
  const notifier = ({
    content,
    color,
    error,
  }: Omit<NotifierParams, "show">) => {
    notification.color = color || (error ? "error" : "info");
    notification.content =
      content ||
      (typeof error === "string" ? error : undefined) ||
      "Une erreur est survenue";
    notification.show = true;

    if (error) {
      console.error(error);
    }
  };

  return { notification, notifier };
};
