const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const { authenticate } = require('../middleware/auth');

const playlistsPath = path.join(__dirname, '../models/playlists.json');

const readPlaylists = async () => {
  try {
    const data = await fs.readFile(playlistsPath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
};
const writePlaylists = async (data) => {
  await fs.writeFile(playlistsPath, JSON.stringify(data, null, 2));
};

// Create playlist
router.post('/', authenticate, async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });

  const newPlaylist = {
    id: Date.now().toString(),
    name: name.trim(),
    userId: req.user.id,
    problems: [],
    createdAt: new Date().toISOString()
  };

  const playlists = await readPlaylists();
  playlists.push(newPlaylist);
  await writePlaylists(playlists);

  res.status(201).json(newPlaylist);
});

// Add a problem to playlist
router.post('/:playlistId/problems/:problemId', authenticate, async (req, res) => {
  const { playlistId, problemId } = req.params;
  const playlists = await readPlaylists();
  const playlist = playlists.find(p => p.id === playlistId && p.userId === req.user.id);
  if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
  if (!playlist.problems.includes(problemId)) playlist.problems.push(problemId);
  await writePlaylists(playlists);
  res.json({ success: true, playlist });
});

// Get user's playlists
router.get('/user/:userId', authenticate, async (req, res) => {
  const playlists = await readPlaylists();
  const userPlaylists = playlists.filter(p => p.userId === req.params.userId);
  res.json(userPlaylists);
});

module.exports = router;
