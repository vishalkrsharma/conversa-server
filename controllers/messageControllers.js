import asyncHandler from 'express-async-handler';
import Message from '../models/Message.js';
import User from '../models/User.js';
import Chat from '../models/Chat.js';

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log('Invalid Data');
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate('sender', 'username');
    message = await message.populate('chat');
    message = await User.populate(message, { path: 'chat.users', select: 'username' });

    await Chat.findByIdAndUpdate(req.body.chatId, { lastestMessage: message });

    res.json(message);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId }).populate('sender', 'username').populate('chat');

    res.json(messages);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

export { sendMessage, allMessages };
