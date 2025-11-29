// routes/chat.js
import express from "express";
import Thread from "../models/Thread.js";
import getGeminiAPIResponse from "../utils/gemini.js";

const router = express.Router();

// Test route to save dummy thread
router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "abc",
      title: "Testing New Thread2"
    });

    const response = await thread.save();
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to save in DB" });
  }
});

// Get all threads
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

// Get messages of specific thread
router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({ threadId });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.json(thread.messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

// Delete a thread
router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });

    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.status(200).json({ success: "Thread deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

// Chat route
router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      thread = new Thread({
        threadId,
        title: message,
        messages: [{ role: "user", content: message }],
        updatedAt: new Date()
      });
    } else {
      thread.messages.push({ role: "user", content: message });
      thread.updatedAt = new Date();
    }

    const assistantReply = await getGeminiAPIResponse(message);

    if (!assistantReply) {
      return res.status(500).json({ error: "Failed to get AI response" });
    }

    if (assistantReply.startsWith("Error:") || assistantReply.includes("Sorry, I encountered an error")) {
      return res.status(500).json({ error: "Gemini response failed", reply: assistantReply });
    }

    thread.messages.push({ role: "assistant", content: assistantReply });

    await thread.save()
      .then(() => console.log("✅ Thread saved to MongoDB"))
      .catch(err => console.error("❌ Error saving thread to DB:", err));

    res.json({ reply: assistantReply });

  } catch (err) {
    console.error("❌ Chat API Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
