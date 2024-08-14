"use client";

import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { ImageIcon } from "@/_icons/ImageIcon";
import { Textarea } from "@nextui-org/input";
import { useEffect, useRef, useState } from "react";
import FeedbackBar from "@/_components/FeedbackBar";
import ImageUploadButton from "@/_components/ImageUploadButton";
import ChatMessage from "@/_components/ChatMessage";
import useChat from "@/_hooks/useChat";
import { v4 as uuidv4 } from "uuid";
import { ArrowUp } from "lucide-react";
import { resizeImage } from "@/_lib/utils";

const CHAT_API_ENDPOINT = `/api/chat`;

type ChatRequestBody = {
  base64_image?: string;
  question?: string;
  thread_id?: string;
};

const DEFAULT_QUESTIONS = [
  "Can a thermal flask be recycled?",
  "Can soft plastic packaging be recycled?",
  "Are BPA-free hard plastic water bottles recyclable?",
];

export default function Page() {
  const [userQuestion, setUserQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [base64Image, setBase64Image] = useState("");
  const [threadId, setThreadId] = useState("");

  // Add a ref for the messages container
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { event, fetchStream } = useChat(3);

  const handleQuestionSend = async () => {
    if (!userQuestion && !base64Image) {
      return;
    }
    setIsLoading(true);
    setUserQuestion("");
    const body: ChatRequestBody = {};

    // push message to messages for rendering
    const message: UserMessage = {
      id: uuidv4(),
      role: "user",
      content: userQuestion,
    };
    if (base64Image) {
      message.imageUrl = base64Image;
      body.base64_image = base64Image;
    }
    if (threadId) {
      body.thread_id = threadId;
    }

    setMessages((prevMessages) => {
      return [...prevMessages, message];
    });

    body.question = userQuestion;

    // send request to backend
    try {
      await fetchStream<ChatRequestBody>(CHAT_API_ENDPOINT, body);
    } catch (error) {
      const errorMsg: AssistantMessage = {
        id: uuidv4(),
        role: "assistant",
        content:
          "Oops! There was an error trying to send your request to the server. Please try again later.",
      };
      setMessages((prevMessages) => {
        return [...prevMessages, errorMsg];
      });
    }
    setIsLoading(false);
    setBase64Image("");
  };

  const handleImageUpload = (base64Image: string) => {
    resizeImage(base64Image).then((resizedBase64Image) => {
      setBase64Image(resizedBase64Image);
    });
    setUserQuestion("Are these items recyclable?");
  };

  useEffect(() => {
    if (!event) {
      return;
    }
    const { messageId, payload } = JSON.parse(event.data) as EventData;
    if (event.name === "start") {
      setMessages((prevMessages) => {
        return [
          ...prevMessages,
          {
            id: messageId,
            role: "assistant",
            content: "",
            thinking_messages: [],
          },
        ];
      });
      return;
    } else if (event.name === "thinking") {
      // find the message with the id and add the thinking message to it if there is an existing assistant message. If not, create new assistant message
      const assistantMsg = messages.findLast(
        (message) => message.id === messageId
      ) as AssistantMessage;

      if (!assistantMsg) {
        return;
      }

      assistantMsg.thinking_messages = [
        ...(assistantMsg.thinking_messages || []),
        { payload, messageId },
      ];
      setMessages([...messages]);
    } else if (event.name === "generate_answer") {
      const assistantMsg = messages.findLast(
        (message) => message.id === messageId
      ) as AssistantMessage;

      if (!assistantMsg) {
        return;
      }

      assistantMsg.content = payload;
      // console.log("payload", payload);
      setMessages([...messages]);
    } else if (event.name === "thread_id") {
      // thread_id sent implies end of generating answer
      setThreadId(payload);
    }
  }, [event]);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* // Placeholder stuff */}
      {messages.length === 0 && (
        <>
          <div className="flex flex-col items-center justify-center w-auto gap-4">
            <p>Bloo - Check if an item is recyclable!</p>
            <ImageUploadButton
              startContent={<ImageIcon />}
              className="w-auto bg-gray-100"
              type="button"
              onImageChange={handleImageUpload}
            >
              <span className="text-sm">Upload Image</span>
            </ImageUploadButton>
          </div>
          <div className="flex flex-row items-center justify-center w-auto my-4">
            <Divider className="w-48 mx-4" />
            <p className="font-bold">or</p>
            <Divider className="w-48 mx-4" />
          </div>
          <div className="flex flex-row items-center justify-center w-auto gap-4 flex-wrap">
            {DEFAULT_QUESTIONS.map((question, index) => (
              <Button
                className="w-auto bg-gray-100"
                key={`${question}-${index}`}
                onPress={() => setUserQuestion(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </>
      )}
      {/* Chat messages */}
      {messages.map((message, index) => (
        <ChatMessage message={message} key={index} />
      ))}
      {/* Feedback bar */}
      {messages.length > 0 && (
        <div className="flex flex-col items-center" ref={messagesEndRef}>
          <FeedbackBar index={1} feedback={0} onFeedbackUpdate={() => {}} />
        </div>
      )}
      {/* // Chat input box */}
      <div className="flex flex-col w-full gap-4 p-4 bg-background ">
        <div className="flex flex-row gap-4">
          {base64Image && (
            <div className="relative inline-block ml-8">
              <img
                src={base64Image}
                alt="Uploaded image"
                width={80}
                height={80}
                className="rounded pt-4 pr-4"
              />
              <button
                onClick={() => setBase64Image("")}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-2"
                aria-label="Remove image"
              >
                x
              </button>
            </div>
          )}
        </div>
        <Textarea
          value={userQuestion}
          onChange={(e) => setUserQuestion(e.target.value)}
          variant="flat"
          radius="full"
          placeholder="Ask a question"
          minRows={1}
          startContent={
            <ImageUploadButton
              isIconOnly
              className="bg-transparent"
              radius="full"
              onImageChange={handleImageUpload}
            >
              <ImageIcon />
            </ImageUploadButton>
          }
          endContent={
            <Button
              color="primary"
              variant="solid"
              radius="full"
              isDisabled={isLoading}
              isIconOnly
              onPress={handleQuestionSend}
              isLoading={isLoading}
            >
              <ArrowUp color="white" />
            </Button>
          }
        />
      </div>
    </div>
  );
}
