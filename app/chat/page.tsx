"use client";

import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { ImageIcon } from "../_icons/ImageIcon";
import { Textarea } from "@nextui-org/input";
import ChatPlaceholder from "../_components/ChatPlaceholder";
import { useEffect, useRef, useState } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";
import FeedbackBar from "../_components/FeedbackBar";
import ImageUploadButton from "../_components/ImageUploadButton";
import Image from "next/image";
import ChatMessage from "../_components/ChatMessage";
import useChat from "../_hooks/useChat";
import { v4 as uuidv4 } from "uuid";

// const url = `${process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT}/stream-test`;
const url = `/api/chat`;

type ChatRequestBody = {
  base64_image?: string;
  question?: string;
  thread_id?: string;
};

export default function Page() {
  const [userQuestion, setUserQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // const [messages, setMessages] = useState<ChatMessage[]>([
  //   {
  //     id: "1",
  //     role: "assistant",
  //     content:
  //       "Hello! I'm Bloo, your recycling assistant. How can I help you today?",
  //   },
  //   {
  //     id: "2",
  //     role: "user",
  //     // imageUrl: "https://nextui.org/images/hero-card-complete.jpeg",
  //     imageUrl:
  //       "https://storage.googleapis.com/recyclesg-2a357.appspot.com/chat-images/770143dd-3366-43eb-a709-a05041b5be23.jpeg",
  //     content: "Can a thermal flask be recycled?",
  //   },
  //   {
  //     id: "3",
  //     role: "assistant",
  //     // thinking_messages: [
  //     //   {
  //     //     content: "Identifying items from the image...",
  //     //     finished: false,
  //     //   },
  //     //   {
  //     //     content: "Rephrasing question...",
  //     //     finished: false,
  //     //   },
  //     // ],
  //     content: "",
  //     thinking_messages: [
  //       {
  //         messageId: "3",
  //         payload: "Identifying items from the image...",
  //       },
  //       {
  //         messageId: "3",
  //         payload: "Rephrasing question...",
  //       },
  //       {
  //         messageId: "3",
  //         payload: "✓ Identified items from image: thermal flask, water bottle",
  //       },
  //     ],
  //   },
  // ]);
  const [isLoading, setIsLoading] = useState(false);
  const [base64Image, setBase64Image] = useState("");

  const { event, fetchStream } = useChat(3);

  const handleQuestionSend = async () => {
    if (!userQuestion && !base64Image) {
      return;
    }
    const body: ChatRequestBody = {};
    if (base64Image) {
      setMessages((prevMessages) => {
        return [
          ...prevMessages,
          {
            id: uuidv4(),
            role: "user",
            content: userQuestion,
            imageUrl: base64Image,
          },
        ];
      });
      body.base64_image = base64Image;
    }
    body.question = userQuestion;

    await fetchStream<ChatRequestBody>(url, body);
    setUserQuestion("");
    setBase64Image("");
  };

  const handleImageUpload = (base64Image: string) => {
    setBase64Image(base64Image);
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
      setMessages([...messages]);
    }
  }, [event]);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* // Placeholder stuff */}
      {messages.length === 0 && (
        <>
          <div className="flex flex-col items-center justify-center w-auto gap-4">
            <p>Bloo - Check if an item is recyclable!</p>
            <p>To start:</p>
            {/* <Button startContent={<ImageIcon />}>Upload Image</Button> */}
            <ImageUploadButton
              startContent={<ImageIcon />}
              className="w-auto bg-gray-100"
              type="button"
              onImageChange={handleImageUpload}
            >
              <span className="text-sm">Upload Image</span>
            </ImageUploadButton>
          </div>
          <div className="flex flex-row items-center justify-center w-auto">
            <Divider className="w-48 mx-4" />
            <p className="font-bold">or</p>
            <Divider className="w-48 mx-4" />
          </div>
          <div className="flex flex-col items-center justify-center w-auto gap-4">
            <p>Ask questions in the chat below</p>
            <Button className="w-auto bg-gray-100">
              Can a thermal flask be recycled?
            </Button>
            <Button className="w-auto bg-gray-100">
              Can soft plastic packaging be recycled?
            </Button>
            <Button className="w-auto bg-gray-100">
              Are BPA-free hard plastic water bottles recyclable?
            </Button>
          </div>
        </>
      )}

      {/* Chat messages */}
      {messages.map((message, index) => (
        <ChatMessage message={message} key={index} />
      ))}
      {/* <div className={`flex flex-col items-start m-4 mr-6 gap-4 `}>
        <div className="relative w-48 h-64">
          <img
            // src={base64Image}
            src="https://storage.googleapis.com/recyclesg-2a357.appspot.com/chat-images/770143dd-3366-43eb-a709-a05041b5be23.jpeg"
            alt="Uploaded image"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        <Card className={`w-5/6 bg-blue-50`} shadow="none">
          <CardBody className={`text-justify p-4 text-gray-400`}>
            <p className="animate-pulse">Identifying items from the image...</p>
            <p className="animate-pulse">Rephrasing question...</p>
            <p className="text-black">
              ✓ Identified items from image: thermal flask, water bottle
            </p>
          </CardBody>
        </Card>
      </div> */}

      {/* Feedback bar */}
      {messages.length > 0 && (
        <div className="flex flex-col items-center">
          <FeedbackBar index={1} feedback={0} onFeedbackUpdate={() => {}} />
        </div>
      )}

      {/* // Chat input box */}
      <div className="flex flex-col w-full gap-4 p-4 bg-background ">
        <div className="flex flex-row gap-4">
          {/* <Image
            alt="Card background"
            className="object-cover rounded-xl ml-8"
            src="https://nextui.org/images/hero-card-complete.jpeg"
            width={80}
            height={80}
          /> */}
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
          variant="bordered"
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
              variant="bordered"
              radius="full"
              onPress={handleQuestionSend}
              isLoading={isLoading}
            >
              Send
            </Button>
          }
        />
      </div>
    </div>
  );
}
