import express from "express";
import messageModel from "../modules/message/message.model.js";
import conversationModel from "../conversation/conversation.model.js";

const router = express.Router();

const formatLastMessage = (message) =>
  message
    ? {
        _id: message._id,
        text: message.text,
        sender: message.sender,
        createdAt: message.createdAt,
      }
    : undefined;

const buildConversationResponse = (conversation, lastMessage) => {
  if (!conversation) return conversation;
  const plain =
    typeof conversation.toObject === "function" ? conversation.toObject() : { ...conversation };

  return {
    ...plain,
    _id: plain._id?.toString() ?? plain._id,
    members: plain.members ?? plain.participants,
    lastMessage: plain.lastMessage ?? formatLastMessage(lastMessage),
  };
};

router.post("/conversation", async (req, res, next) => {
  try {
    const { senderId, receiverId } = req.body ?? {};

    if (!senderId || !receiverId) {
      return res.status(400).json({ message: "senderId and receiverId are required." });
    }

    if (senderId === receiverId) {
      return res
        .status(400)
        .json({ message: "Cannot create a conversation with identical participants." });
    }

    let conversation = await conversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    let isNew = false;
    if (!conversation) {
      isNew = true;
      conversation = await conversationModel.create({
        participants: [senderId, receiverId],
      });
    }

    const response = buildConversationResponse(conversation);
    return res.status(isNew ? 201 : 200).json(response);
  } catch (error) {
    return next(error);
  }
});

router.get("/conversations/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params ?? {};
    if (!userId) {
      return res.status(400).json({ message: "userId param is required." });
    }

    const conversations = await conversationModel
      .find({ participants: userId })
      .sort({ updatedAt: -1 })
      .lean();

    if (!conversations.length) {
      return res.json([]);
    }

    const conversationIds = conversations.map((conversation) => conversation._id.toString());
    const latestMessages = await messageModel.aggregate([
      { $match: { conversationId: { $in: conversationIds } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$conversationId",
          message: { $first: "$$ROOT" },
        },
      },
    ]);
    const messageMap = new Map(
      latestMessages.map(({ _id, message }) => [_id, formatLastMessage(message)])
    );

    const payload = conversations.map((conversation) => ({
      ...conversation,
      _id: conversation._id.toString(),
      members: conversation.members ?? conversation.participants,
      lastMessage: conversation.lastMessage ?? messageMap.get(conversation._id.toString()),
    }));

    return res.json(payload);
  } catch (error) {
    return next(error);
  }
});

router.get("/messages/:conversationId", async (req, res, next) => {
  try {
    const { conversationId } = req.params ?? {};
    if (!conversationId) {
      return res.status(400).json({ message: "conversationId param is required." });
    }

    const conversationExists = await conversationModel.exists({ _id: conversationId });
    if (!conversationExists) {
      return res.status(404).json({ message: "Conversation not found." });
    }

    const messages = await messageModel
      .find({ conversationId })
      .sort({ createdAt: 1 })
      .lean();
    return res.json(messages);
  } catch (error) {
    return next(error);
  }
});

export const chatRoutes = router;
