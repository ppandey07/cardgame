require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// 📦 Schema for player data
const playerSchema = new mongoose.Schema({
    playerId: String,
    moves: Number,
    playedAt: {
        type: Date,
        default: Date.now
    }
});

const Player = mongoose.model('Player', playerSchema);

// 📨 API to save player data
app.post('/save', async (req, res) => {
    const { playerId, moves } = req.body;

    // ⬇️ Add this line to log the incoming data
    console.log('🔥 Received:', playerId, moves);

    try {
        const newPlayer = new Player({ playerId, moves });
        await newPlayer.save();

        // ⬇️ Add this line to confirm saving
        console.log('✅ Saved to DB');

        res.status(200).json({ message: 'Data saved successfully' });
    } catch (err) {
        // ⬇️ Already here, shows error if saving fails
        console.error('❌ Save error:', err);
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// 🚀 Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
