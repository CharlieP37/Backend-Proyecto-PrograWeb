const axios = require('axios');
require('dotenv').config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

async function getAccessToken() {
    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token',
            new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
            {
                headers: {
                    Authorization: `Basic ${authString}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error.message);
        throw error;
    }
};

const getRecommendation = async (req, res, next) => {
    const mood = req.body.mood;
    const token = await getAccessToken();

    if (!mood) {
        return res.status(400).json({ message: "No mood specified", error: "A mood most be specified" });
    }

    try {
        const searchResponse = await axios.get('https://api.spotify.com/v1/search', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                q: mood,
                type: 'playlist',
                limit: 50
            }
        });

        const playlists = searchResponse.data.playlists.items;
        const validPlaylists = playlists.filter(p => p !== null);

        if (validPlaylists.lenght === 0){
            return res.status(404).json({ error: `No playlists found for mood: ${mood}` });
        };
        
        const randomIndex = Math.floor(Math.random() * validPlaylists.length);
        const randomPlaylist = validPlaylists[randomIndex];
        const playlistId = randomPlaylist.id;

        const tracksResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                limit: 50
            }
        });

        const validTracks = tracksResponse.data.items.filter(item => item.track !== null);

        if (validTracks.lenght === 0) {
            return res.status(404).json({ error: `No valid tracks found in playlist: ${randomPlaylist.name}` });
        }

        const track = validTracks[Math.floor(Math.random() * validTracks.length)].track;
        res.status(200).json({ mood: mood, name: track.name, artist: track.artists.map(a => a.name).join(', '), cover: track.album.images[1].url, track: track });

    } catch (error) {
        console.error('Error fetching playlist tracks:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data || 'Internal Server Error'
        });
    };

};

const getHistory = async (req, res, next) => {
    res.status(200).json({ message: "Exito" });
};

const getLatest = async (req, res, next) => {
    res.status(200).json({ message: "Exito" });
};

module.exports = { getRecommendation, getHistory, getLatest };