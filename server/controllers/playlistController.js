const path = require('path');
const fileUtils = require('../utils/fileUtils');
const { ROLES } = require('../config/constants');

const playlistsFilePath = path.join(__dirname, '../models/playlists.json');
const problemsFilePath = path.join(__dirname, '../models/problems.json');

exports.getMyPlaylists = (req, res) => {
  const userId = req.user.id;
  
  fileUtils.readJSON(playlistsFilePath, (err, playlists) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading playlists data.' });
    }
    
    const userPlaylists = playlists.filter(p => p.userId == userId);
    return res.status(200).json(userPlaylists);
  });
};

exports.getPlaylistById = (req, res) => {
  const playlistId = req.params.id;
  
  fileUtils.readJSON(playlistsFilePath, (err, playlists) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading playlists data.' });
    }
    
    const playlist = playlists.find(p => p.id == playlistId);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found.' });
    }
    
    // Check permissions - users can only view their own playlists unless it's public
    if (playlist.userId !== req.user.id && !playlist.isPublic) {
      return res.status(403).json({ error: 'Access denied.' });
    }
    
    return res.status(200).json(playlist);
  });
};

exports.createPlaylist = (req, res) => {
  const { name, description, problems, isPublic } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Playlist name is required.' });
  }
  
  const newPlaylist = {
    id: Date.now().toString(),
    name,
    description: description || '',
    userId: req.user.id,
    problems: problems || [],
    isPublic: isPublic || false,
    createdAt: new Date().toISOString()
  };
  
  fileUtils.readJSON(playlistsFilePath, (err, playlists) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading playlists data.' });
    }
    
    playlists.push(newPlaylist);
    
    fileUtils.writeJSON(playlistsFilePath, playlists, err => {
      if (err) {
        return res.status(500).json({ error: 'Error saving playlist data.' });
      }
      return res.status(201).json(newPlaylist);
    });
  });
};

exports.updatePlaylist = (req, res) => {
  const playlistId = req.params.id;
  const updates = req.body;
  
  fileUtils.readJSON(playlistsFilePath, (err, playlists) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading playlists data.' });
    }
    
    const index = playlists.findIndex(p => p.id == playlistId);
    if (index === -1) {
      return res.status(404).json({ error: 'Playlist not found.' });
    }
    
    // Users can only update their own playlists
    if (playlists[index].userId !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own playlists.' });
    }
    
    // Update playlist but preserve id and userId
    playlists[index] = { 
      ...playlists[index], 
      ...updates,
      id: playlistId,
      userId: req.user.id,
      updatedAt: new Date().toISOString()
    };
    
    fileUtils.writeJSON(playlistsFilePath, playlists, err => {
      if (err) {
        return res.status(500).json({ error: 'Error saving playlist data.' });
      }
      return res.status(200).json(playlists[index]);
    });
  });
};

exports.deletePlaylist = (req, res) => {
  const playlistId = req.params.id;
  
  fileUtils.readJSON(playlistsFilePath, (err, playlists) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading playlists data.' });
    }
    
    const index = playlists.findIndex(p => p.id == playlistId);
    if (index === -1) {
      return res.status(404).json({ error: 'Playlist not found.' });
    }
    
    // Users can only delete their own playlists
    if (playlists[index].userId !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own playlists.' });
    }
    
    // Remove the playlist
    playlists.splice(index, 1);
    
    fileUtils.writeJSON(playlistsFilePath, playlists, err => {
      if (err) {
        return res.status(500).json({ error: 'Error saving playlist data.' });
      }
      return res.status(200).json({ message: 'Playlist deleted successfully.' });
    });
  });
};

exports.addProblemToPlaylist = (req, res) => {
  const playlistId = req.params.id;
  const { problemId } = req.body;
  
  if (!problemId) {
    return res.status(400).json({ error: 'Problem ID is required.' });
  }
  
  // Verify problem exists
  fileUtils.readJSON(problemsFilePath, (err, problems) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading problems data.' });
    }
    
    const problemExists = problems.some(p => p.id == problemId);
    if (!problemExists) {
      return res.status(404).json({ error: 'Problem not found.' });
    }
    
    // Add problem to playlist
    fileUtils.readJSON(playlistsFilePath, (err, playlists) => {
      if (err) {
        return res.status(500).json({ error: 'Error reading playlists data.' });
      }
      
      const index = playlists.findIndex(p => p.id == playlistId);
      if (index === -1) {
        return res.status(404).json({ error: 'Playlist not found.' });
      }
      
      // Users can only modify their own playlists
      if (playlists[index].userId !== req.user.id) {
        return res.status(403).json({ error: 'You can only modify your own playlists.' });
      }
      
      // Ensure problems array exists
      if (!playlists[index].problems) {
        playlists[index].problems = [];
      }
      
      // Check if problem already in playlist
      if (playlists[index].problems.includes(problemId)) {
        return res.status(400).json({ error: 'Problem already in playlist.' });
      }
      
      // Add problem to playlist
      playlists[index].problems.push(problemId);
      playlists[index].updatedAt = new Date().toISOString();
      
      fileUtils.writeJSON(playlistsFilePath, playlists, err => {
        if (err) {
          return res.status(500).json({ error: 'Error saving playlist data.' });
        }
        return res.status(200).json(playlists[index]);
      });
    });
  });
};

exports.removeProblemFromPlaylist = (req, res) => {
  const playlistId = req.params.playlistId;
  const problemId = req.params.problemId;
  
  fileUtils.readJSON(playlistsFilePath, (err, playlists) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading playlists data.' });
    }
    
    const index = playlists.findIndex(p => p.id == playlistId);
    if (index === -1) {
      return res.status(404).json({ error: 'Playlist not found.' });
    }
    
    // Users can only modify their own playlists
    if (playlists[index].userId !== req.user.id) {
      return res.status(403).json({ error: 'You can only modify your own playlists.' });
    }
    
    // Remove problem from playlist
    if (!playlists[index].problems) {
      return res.status(404).json({ error: 'Problem not found in playlist.' });
    }
    
    const problemIndex = playlists[index].problems.indexOf(problemId);
    if (problemIndex === -1) {
      return res.status(404).json({ error: 'Problem not found in playlist.' });
    }
    
    playlists[index].problems.splice(problemIndex, 1);
    playlists[index].updatedAt = new Date().toISOString();
    
    fileUtils.writeJSON(playlistsFilePath, playlists, err => {
      if (err) {
        return res.status(500).json({ error: 'Error saving playlist data.' });
      }
      return res.status(200).json(playlists[index]);
    });
  });
};
