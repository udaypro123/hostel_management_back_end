import { ResponseCode } from "../utils/responseList.js";
import { spawn } from "child_process";

// Logger
const logger = {
  log: ({ level, message, requestId }) => {
    console.log(`[${level.toUpperCase()}] [RequestID: ${requestId}] ${message}`);
  }
};

// Mock DB (can be replaced by Mongo/Postgres later)
const hostelData = {
  students: [
    { id: 1, name: "Aman Kumar", room: "B-204", pendingFee: 5000 }
  ],
  rooms: [
    { roomNo: "B-201", occupied: true },
    { roomNo: "B-202", occupied: false }
  ]
};

// Helper: talk to Ollama
const runOllama = (prompt) => {
  return new Promise((resolve, reject) => {
    const ollama = spawn("ollama", ["run", "llama3"], {
      stdio: ["pipe", "pipe", "pipe"]
    });

    let output = "";
    ollama.stdout.on("data", (data) => (output += data.toString()));
    ollama.stderr.on("data", (err) => console.error("AI Error:", err.toString()));
    ollama.on("close", () => resolve(output.trim()));
    ollama.stdin.write(prompt);
    ollama.stdin.end();
  });
};

// Main DB function
const AskFromAi = async (body, callback) => {
  try {
    const query = body.query?.toLowerCase();

    // Custom rule-based answers
    if (query.includes("fee")) {
      return callback(
        null,
        ResponseCode.SuccessCode,
        `Your pending hostel fee is ₹${hostelData.students[0].pendingFee}`
      );
    }

    if (query.includes("room")) {
      return callback(
        null,
        ResponseCode.SuccessCode,
        `You are in room no. ${hostelData.students[0].room}`
      );
    }

    if (query.includes("vacant")) {
      const vacant = hostelData.rooms.filter((r) => !r.occupied);
      return callback(
        null,
        ResponseCode.SuccessCode,
        `Vacant rooms: ${vacant.map((r) => r.roomNo).join(", ")}`
      );
    }

    if (query.includes("complaint")) {
      return callback(
        null,
        ResponseCode.SuccessCode,
        "Your complaint has been registered with hostel management."
      );
    }

    // Otherwise fallback to LLM
    const aiReply = await runOllama(body.query);
    return callback(null, ResponseCode.SuccessCode, aiReply);
  } catch (err) {
    logger.log({
      level: "error",
      message: "DBC Error - " + err,
      requestId: "Unknown"
    });
    return callback(err, ResponseCode.ServerError, null);
  }
};

export { AskFromAi };
