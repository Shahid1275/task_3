//ALL SQL QUERIES:
const getAllItems = `SELECT * FROM items;`;
const getShowItems = `SELECT * FROM items WHERE hidden=FALSE;`;
const getHideItems = `SELECT * FROM items WHERE hidden=TRUE;`;
const getItemById = `SELECT * FROM items WHERE id=$1;`;
const getlastItemId = `SELECT MAX(id) FROM items;`;
const addItem = `INSERT INTO items (topic,duration,link) VALUES($1,$2,$3);`;
const updateItem = `UPDATE items SET topic=$2, duration=$3, link=$4 WHERE id=$1`;
const deleteItem = `DELETE FROM items WHERE id=$1`;
const updateStatus = `UPDATE items SET hidden=$1 WHERE id=$2`;
module.exports = {
  getAllItems,
  getShowItems,
  getHideItems,
  getItemById,
  getlastItemId,
  addItem,
  updateItem,
  deleteItem,
  updateStatus,
};