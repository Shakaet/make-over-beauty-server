// import mongoose from "mongoose"
// import config from "./config/index.js"
// import app from "./app.js"




// let server

// async function main() {
//   try {
//     await mongoose.connect(config.mongo_uri)

//    server= app.listen(config.port, () => {
//       console.log(`Example app listening on ports ${config.port}`)
//     })
//   } catch (err) {
//     console.log(err)
//   }
// }

// main()



// process.on("unhandledRejection",()=>{

//   console.log("Unhandled Rejection Shutting down....");

//   if(server){
//     server.close(()=>{
      
//       // console.log("server closed")
//       process.exit(1)

//     })
//   }
//   process.exit(1)
  


// });

// // Promise.reject()

// process.on("uncaughtException",()=>{

//   console.log("uncaught Exception Shutting down....");

//   process.exit(1)


// })

// // console.log(x)


import mongoose from "mongoose";
import config from "./config/index.js";
import app from "./app.js";
import { Server } from "socket.io";
import http from "http";
import messageModel from "./modules/message/message.model.js";
import conversationModel from "./conversation/conversation.model.js";

let server;
let io;

async function main() {
  try {
    // MongoDB connection
    await mongoose.connect(config.mongo_uri);
    console.log("Database connected");

    // Create HTTP server for socket.io
    const httpServer = http.createServer(app);

    // Create Socket.io server
    io = new Server(httpServer, {
      cors: {
        origin: "*",
      },
    });

    // Socket.io connection event
    io.on("connection", (socket) => {
      console.log("⚡ User connected:", socket.id);

      // join room (conversation id)
      socket.on("join_room", async (roomId) => {
        if (!roomId) {
          return;
        }

        try {
          const exists = await conversationModel.exists({ _id: roomId });
          if (!exists) {
            socket.emit("conversation_error", { message: "Conversation not found", roomId });
            return;
          }

          socket.join(roomId);
          console.log(`User ${socket.id} joined room: ${roomId}`);
        } catch (error) {
          console.error("join_room error:", error);
          socket.emit("conversation_error", { message: "Unable to join room", roomId });
        }
      });

      socket.on("leave_room", (roomId) => {
        if (!roomId) {
          return;
        }

        socket.leave(roomId);
        console.log(`User ${socket.id} left room: ${roomId}`);
      });

      // receive and broadcast message
      socket.on("send_message", async (data, callback) => {
        try {
          const { conversationId, text, sender } = data ?? {};

          if (!conversationId || !text?.trim() || !sender) {
            throw new Error("conversationId, sender, and text are required.");
          }

          const conversationExists = await conversationModel.exists({ _id: conversationId });
          if (!conversationExists) {
            throw new Error("Conversation does not exist.");
          }

          const message = await messageModel.create({
            conversationId,
            text: text.trim(),
            sender,
          });

          await conversationModel.findByIdAndUpdate(conversationId, {
            lastMessage: {
              text: message.text,
              sender: message.sender,
              createdAt: message.createdAt,
            },
            updatedAt: new Date(),
          });

          io.to(conversationId).emit("receive_message", message);
          callback?.({ ok: true, message });
        } catch (error) {
          console.error("send_message error:", error);
          callback?.({
            ok: false,
            message: error?.message ?? "Unable to send message right now.",
          });
        }
      });

      socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
      });
    });

    // Start server
    server = httpServer.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });

  } catch (err) {
    console.log("DATABASE connection error:", err);
  }
}

main();


// =======================
// 🔥 Unhandled Rejection
// =======================
process.on("unhandledRejection", () => {
  console.log("Unhandled Rejection... Shutting down...");
  if (server) {
    server.close(() => process.exit(1));
  }
  process.exit(1);
});

// =======================
// 🔥 Uncaught Exception
// =======================
process.on("uncaughtException", () => {
  console.log("Uncaught Exception... Shutting down...");
  process.exit(1);
});

export { io };
