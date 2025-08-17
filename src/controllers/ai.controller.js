import { AskFromAi } from "../dbc/ai.dbc.js";
import { ResponseCode } from "../utils/responseList.js";

// Logger
const logger = {
  log: ({ level, message, requestId }) => {
    console.log(`[${level.toUpperCase()}] [RequestID: ${requestId}] ${message}`);
  }
};

const askFromAi = function (req, res) {
  console.log("--------------->req ", req.body);

  AskFromAi(req.body, (err, code, ask) => {
    if (err) {
      logger.log({
        level: "error",
        message: "AskFromAi - Error - " + err,
        requestId: req?.id || "Unknown"
      });
      return res.status(500).json({
        code: ResponseCode.ServerError,
        message: "Internal server error",
        error: err.message || err
      });
    }

    if (code === ResponseCode.SuccessCode) {
      return res
        .status(200)
        .json({ code, message: "AI reply generated successfully", ask });
    }

    return res
      .status(422)
      .json({ code, message: "Error while generating AI reply" });
  });
};

export { askFromAi };
