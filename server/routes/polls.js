const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');

// Create a new poll
router.post('/', async (req, res) => {
  try {
    const poll = new Poll({
      ...req.body,
      creator: req.body.creator || '000000000000000000000000' // Temporary until auth is implemented
    });
    await poll.save();
    res.status(201).json(poll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all polls (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { category, tags, sort = 'createdAt' } = req.query;
    let query = { isPrivate: false };

    if (category) {
      query.category = category;
    }

    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    const polls = await Poll.find(query)
      .sort({ [sort]: -1, engagementScore: -1 })
      .limit(20);

    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific poll
router.get('/:id', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    res.json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cast a vote
router.post('/:id/vote', async (req, res) => {
  try {
    const { optionId, sentiment } = req.body;
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    const option = poll.options.id(optionId);
    if (!option) {
      return res.status(404).json({ message: 'Option not found' });
    }

    // Update vote counts
    option.votes += 1;
    option.sentiments[sentiment] += 1;
    poll.totalVotes += 1;
    poll.lastActive = Date.now();

    await poll.save();

    // Emit socket event for real-time updates
    req.app.get('io').to(req.params.id).emit('voteUpdate', {
      pollId: req.params.id,
      optionId,
      votes: option.votes,
      sentiments: option.sentiments,
      totalVotes: poll.totalVotes
    });

    res.json({ message: 'Vote recorded successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get poll results
router.get('/:id/results', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    const results = {
      totalVotes: poll.totalVotes,
      options: poll.options.map(option => ({
        id: option._id,
        text: option.text,
        votes: option.votes,
        percentage: (option.votes / poll.totalVotes) * 100,
        sentiments: option.sentiments
      })),
      engagementScore: poll.engagementScore
    };

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a poll (only by creator)
router.delete('/:id', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    // TODO: Add creator check when auth is implemented
    await poll.remove();
    res.json({ message: 'Poll deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;