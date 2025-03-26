export default async function handler(req, res) {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ error: 'No token provided' });
    }
    const clientId = process.env.TWITCH_CLIENT_ID;
    if (!clientId) {
      return res.status(500).json({ error: 'TWITCH_CLIENT_ID is not set' });
    }
    try {
      const response = await fetch('https://api.twitch.tv/helix/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Client-Id': clientId
        }
      });
      if (!response.ok) {
        return res.status(response.status).json({ error: 'Error fetching user info' });
      }
      const data = await response.json();
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: err.toString() });
    }
  }
  