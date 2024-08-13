import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useState } from "react";

class RetriableError extends Error {}
class FatalError extends Error {}

/** Hook to handle event source streaming
 * @param url
 * @param body
 * @returns
 */
export default function useChat(retries: number = 3) {
  const [event, setEvent] = useState<{ name: string; data: string }>();
  const [retryCount, setRetryCount] = useState(0);

  async function fetchStream<RequestBodyType>(
    url: string,
    body: RequestBodyType
  ) {
    await fetchEventSource(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      async onopen(response) {
        console.log(`event source to ${url} opened`);
        if (response.ok) {
          return; // everything's good
        } else if (
          response.status >= 400 &&
          response.status < 500 &&
          response.status !== 429
        ) {
          // client-side errors are usually non-retriable:
          console.log("onopen throwing fatal error");
          throw new FatalError();
        } else {
          console.log("onopen throwing retriable error");
          throw new RetriableError();
        }
      },
      onmessage(msg) {
        console.log(`event name ${msg.event}`);
        console.log(`event data ${msg.data}`);
        // if the server emits an error message, throw an exception
        // so it gets handled by the onerror callback below:
        if (msg.event === "FatalError") {
          throw new FatalError(msg.data);
        }
        setEvent({ name: msg.event, data: msg.data });
      },
      onclose() {
        // if the server closes the connection unexpectedly, retry:
        // throw new RetriableError();
        console.log(`event source to url ${url} closed`);
      },
      onerror(err) {
        console.error(`event source to url ${url} error: `, err);
        if (err instanceof FatalError) {
          throw err; // rethrow to stop the operation
        } else if (err instanceof RetriableError) {
          if (retryCount < retries) {
            console.log(
              "Retrying event source for the ",
              retries + 1,
              " time."
            );
            setRetryCount((prevCount) => prevCount + 1);
          } else {
            throw err;
          }
        } else {
          throw err; // rethrow to stop the operation
        }
      },
    });
  }

  return { event, fetchStream };
}
