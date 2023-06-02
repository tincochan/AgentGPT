import React from "react";
import {
  getTaskStatus,
  isAction,
  Message,
  MESSAGE_TYPE_GOAL,
  MESSAGE_TYPE_SYSTEM,
  MESSAGE_TYPE_THINKING,
  TASK_STATUS_COMPLETED,
  TASK_STATUS_FINAL,
  TASK_STATUS_STARTED,
} from "../../types/agentTypes";
import { useTranslation } from "next-i18next";
import clsx from "clsx";
import { getMessageContainerStyle, getTaskStatusIcon } from "../utils/helpers";
import MarkdownRenderer from "./MarkdownRenderer";

const ChatMessage = ({ message }: { message: Message }) => {
  const [t] = useTranslation();

  return (
    <div
      className={clsx(
        getMessageContainerStyle(message),
        "mx-2 my-1 rounded-lg border bg-white/20 p-2 font-mono text-xs hover:border-[#1E88E5]/40 sm:mx-4 sm:p-3",
        "sm:my-1.5 sm:text-sm"
      )}
    >
      {message.type != MESSAGE_TYPE_SYSTEM && (
        // Avoid for system messages as they do not have an icon and will cause a weird space
        <>
          <div className="mr-2 inline-block h-[0.9em]">{getTaskStatusIcon(message, {})}</div>
          <span className="mr-2 font-bold">{t(getMessagePrefix(message), { ns: "chat" })}</span>
        </>
      )}

      {message.type == MESSAGE_TYPE_THINKING && (
        <span className="italic text-zinc-400">
          {`${t("RESTART_IF_IT_TAKES_X_SEC", {
            ns: "chat",
          })}`}
        </span>
      )}

      {isAction(message) ? (
        <>
          <hr className="my-2 border border-white/20" />
          <div className="prose">
            <MarkdownRenderer>{message.info || ""}</MarkdownRenderer>
          </div>
        </>
      ) : (
        <>
          <span>{t(message.value, { ns: "chat" })}</span>
          {
            // Link to the FAQ if it is a shutdown message
            message.type == MESSAGE_TYPE_SYSTEM &&
              (message.value.toLowerCase().includes("shut") ||
                message.value.toLowerCase().includes("error")) && <FAQ />
          }
        </>
      )}
    </div>
  );
};
// Returns the translation key of the prefix
const getMessagePrefix = (message: Message) => {
  if (message.type === MESSAGE_TYPE_GOAL) {
    return "EMBARKING_ON_NEW_GOAL";
  } else if (message.type === MESSAGE_TYPE_THINKING) {
    return "THINKING";
  } else if (getTaskStatus(message) === TASK_STATUS_STARTED) {
    return "TASK_ADDED";
  } else if (getTaskStatus(message) === TASK_STATUS_COMPLETED) {
    return `Completing: ${message.value}`;
  } else if (getTaskStatus(message) === TASK_STATUS_FINAL) {
    return "NO_MORE_TASKS";
  }
  return "";
};
const FAQ = () => {
  return (
    <p>
      <br />
      If you are facing issues, please head over to our{" "}
      <a href="https://docs.reworkd.ai/faq" className="text-sky-500">
        FAQ
      </a>
    </p>
  );
};
export { ChatMessage };
