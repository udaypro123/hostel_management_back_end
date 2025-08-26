import { ResponseCode } from "../utils/responseList.js";
import Groq from "groq-sdk";
import { tavily } from "@tavily/core"
import { AiResponseModel } from "../models/Students.models.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY })

// import { spawn } from "child_process";


// Logger
const logger = {
  log: ({ level, message, requestId }) => {
    console.log(`[${level.toUpperCase()}] [RequestID: ${requestId}] ${message}`);
  }
};

async function webSearch({ query }) {
  console.log("webSearch is calling ...");
  const response = await tvly.search(query);
  const responseContent = response.results.map((result) => result.content).join("\n\n");
  return responseContent;
}

const AskFromAi = async (body, callback) => {
  try {

    const { query, sender } = body;
    const messages = [
      {
        role: "system",
        content: `you are Hostel Assistant, you have access to real-time information.
                    1. You can search the web for the latest information.
                    2. You can provide summaries of current events.
                    3. You can answer questions about recent developments.
                    4. webSearch({ query }: { query: string }) current DateTime : ${new Date().toUTCString()}`
      },
    ]

    const dbdata = {
      sender: "user",
      content: query
    }

    const userExists = await AiResponseModel.findOne({ userId: sender });
    console.log("userExists", userExists);

    if (userExists) {
      userExists.studentChat.push(dbdata);
      await userExists.save();
    } else {
      const aiResponse = new AiResponseModel({
        userId: sender,
        studentChat: [dbdata]
      });
      await aiResponse.save();
    }

    messages.push({
      role: "user",
      content: query
    });

    while (true) {

      const completion = await groq.chat.completions
        .create({
          temperature: 0,
          model: "llama-3.3-70b-versatile",
          messages: messages,
          tools: [
            {
              type: "function",
              function: {
                name: "webSearch",
                description: "search and retrieve real time information from the web",
                parameters: {
                  type: "object",
                  properties: {
                    query: {
                      type: "string",
                      description: "The search query to look up"
                    }
                  },
                  required: ["query"]
                }
              }
            }
          ],
          tool_choice: "auto",
        })

      messages.push(completion.choices[0]?.message);
      const toolCalls = completion.choices[0]?.message?.tool_calls;
      console.log("Tool Calls:", toolCalls, completion.choices[0]?.message);
      if (!toolCalls) {
        console.log("Assistant:", completion.choices[0]?.message.content);
        // Save the AI response to the database
        const userExistss = await AiResponseModel.findOne({ userId: sender });
        const resdata = {
          sender: "bot",
          content: completion.choices[0]?.message.content
        }
        if (userExistss) {
          userExistss.studentChat.push(resdata);
          await userExistss.save();
        } else {
          const aiResponse = new AiResponseModel({
            userId: sender,
            studentChat: [resdata]
          });
          await aiResponse.save();
        }

        return callback(null, ResponseCode.SuccessCode, completion.choices[0]);
      }

      for (const tool of toolCalls) {
        console.log("Tool Call:", tool, tool.function.arguments);
        if (tool.function.name === "webSearch") {
          const result = await webSearch(JSON.parse(tool.function.arguments));
          // console.log(result);
          messages.push({
            tool_call_id: tool.id,
            role: "tool",
            name: tool.function.name,
            content: result
          });
        }
      }
    }


  } catch (err) {
    logger.log({ level: "error", message: "DBC Error - " + err, requestId: "Unknown" });
    return callback(err, ResponseCode.ServerError, null);
  }
};

const GetAIChatbyUserId = async (userId, callback) => {
  try {
    console.log("userId:--------> ", userId)
    const userChat = await AiResponseModel.findOne({ userId });
    if (userChat) {
      console.log("userChat:--------> ", userChat, userChat.studentChat)
      return callback(null, ResponseCode.SuccessCode, userChat.studentChat);
    }else{
      return callback(null, ResponseCode.SuccessCode, []);
    }
  } catch (error) {
    return callback(error, ResponseCode.ServerError, null);
  }
};

export { AskFromAi, GetAIChatbyUserId };
