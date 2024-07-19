const pool = require('../db');

const getItems = async (req, res) => {
    try {
        const { hidden } = req.query;
        let query = 'SELECT * FROM items';
        let params = [];
        
        if (hidden !== undefined) {
            query += ' WHERE hidden = $1';
            params.push(hidden === 'true');
        }
        
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: `Item with ID ${id} not found` });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createItem = async (req, res) => {
  try {
      const { topic, duration, link, hidden } = req.body;

      // Validate and format the topic
      if (!topic || typeof topic !== 'string' || topic.trim() === '') {
          return res.status(400).json({ message: 'Topic is required and should be a non-empty string' });
      }

      // Validate and format the link
      if (!link || typeof link !== 'string' || link.trim() === '') {
          return res.status(400).json({ message: 'Link is required and should be a non-empty string' });
      }

      // Validate and format the duration
      if (!duration || typeof duration !== 'number' || duration <= 0) {
          return res.status(400).json({ message: 'Duration must be a positive number representing minutes' });
      }

      let formattedDuration = '';
      if (duration < 60) {
          formattedDuration = `${duration} min`;
      } else if (duration === 60) {
          formattedDuration = `1 hr`;
      } else {
          formattedDuration = `${Math.floor(duration / 60)} hr ${duration % 60} min`;
      }

      const formattedTopic = topic.trim();
      const formattedLink = link.trim();
      const formattedHidden = hidden !== undefined ? hidden : false;

      const result = await pool.query(
          'INSERT INTO items (topic, duration, link, hidden) VALUES ($1, $2, $3, $4) RETURNING *',
          [formattedTopic, formattedDuration, formattedLink, formattedHidden]
      );

      const newItem = result.rows[0];

      res.status(201).json({
          id: newItem.id,
          topic: newItem.topic,
          duration: newItem.duration,
          link: newItem.link,
          hidden: newItem.hidden
      });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { topic, duration, link, hidden } = req.body;

        // Validate and format the topic
        if (!topic || typeof topic !== 'string' || topic.trim() === '') {
            return res.status(400).json({ message: 'Topic is required and should be a non-empty string' });
        }

        // Validate and format the duration
        const durationRegex = /^(\d+) hr(?: (\d+) min)?$/;
        if (!duration || !durationRegex.test(duration)) {
            return res.status(400).json({ message: 'Duration must be in the format "X hr" or "X hr Y min"' });
        }

        const formattedTopic = topic.trim();
        const formattedDuration = duration.trim();
        const formattedHidden = hidden !== undefined ? hidden : false;

        const result = await pool.query(
            'UPDATE items SET topic = $1, duration = $2, link = $3, hidden = $4 WHERE id = $5 RETURNING *',
            [formattedTopic, formattedDuration, link, formattedHidden, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: `Item with ID ${id} not found` });
        }

        res.json({ message: `Item with ID ${id} updated`, item: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: `Item with ID ${id} not found` });
        }

        res.json({ message: `Item with ID ${id} deleted` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const changeItemStatus = async (req, res) => {
    try { 
        const { id } = req.params;
        const { hidden } = req.body;

        if (hidden === undefined) {
            return res.status(400).json({ message: 'Hidden status is required' });
        }

        const item = await pool.query('SELECT * FROM items WHERE id = $1', [id]);

        if (item.rows.length === 0) {
            return res.status(404).json({ message: `Item with ID ${id} not found` });
        }

        const result = await pool.query('UPDATE items SET hidden = $1 WHERE id = $2 RETURNING *', [hidden, id]);

        res.json({ message: `Status of item with ID ${id} changed to ${hidden}`, item: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
    changeItemStatus
};
