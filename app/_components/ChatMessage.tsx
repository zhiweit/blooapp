import { Card, CardBody } from "@nextui-org/card";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import ReactMarkdown from "react-markdown";

type ChatMessageProps = {
  message: ChatMessage;
};

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={`flex flex-col ${
        message.role === "user" ? "items-end" : "items-start"
      } m-4 mr-6 gap-4 `}
    >
      {/* <div>
        {message.imageUrl && (
          <Image
            alt="Card background"
            className="object-cover rounded-xl"
            src={message.imageUrl}
            width={270}
            height={270}
          />
        )}
      </div> */}
      {message.role === "user" ? (
        <UserChatMessage message={message} />
      ) : (
        <AssistantChatMessage message={message} />
      )}
    </div>
  );
}

function UserChatMessage({ message }: { message: UserMessage }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      {message.imageUrl && (
        <>
          <div className="cursor-pointer relative w-48 h-64" onClick={onOpen}>
            <img
              // src={base64Image}
              src={message.imageUrl}
              alt="Uploaded image"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalBody>
                    <img
                      // src={base64Image}
                      src={message.imageUrl}
                      alt="Uploaded image"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      )}
      {message.content && (
        <Card className={"max-w-fit w-5/6 bg-slate-100"} shadow="none">
          <CardBody className={`text-justify p-4`}>{message.content}</CardBody>
        </Card>
      )}
    </>
  );
}

function AssistantChatMessage({ message }: { message: AssistantMessage }) {
  return (
    <>
      {/* Display content if there is, otherwise display the thinking messages if there is */}
      {message.content ? (
        <Card className={"max-w-fit w-5/6 bg-blue-50"} shadow="none">
          <CardBody className={`text-justify p-4`}>
            <ReactMarkdown
              components={{
                ol: ({ children }) => (
                  <ol className="list-decimal pl-4">{children}</ol>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-4">{children}</ul>
                ),
                li: ({ children }) => <li className="mb-1">{children}</li>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </CardBody>
        </Card>
      ) : message.thinking_messages && message.thinking_messages.length > 0 ? (
        <Card className={"w-5/6 bg-blue-50"} shadow="none">
          <CardBody className={`text-justify p-4`}>
            {message.thinking_messages.map((thought, index) => (
              <p key={index}>{thought.payload}</p>
            ))}
          </CardBody>
        </Card>
      ) : null}
    </>
  );
}
