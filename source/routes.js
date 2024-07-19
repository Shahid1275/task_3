//TO STORE ROUTES OF ITEMS:
const { Router } = require("express");
const controller = require("./controller"); //logic for handling CRUD using db
const router = Router();
//routes for curd of Items table:
router.get("/", controller.getItems);
router.get("/:id", controller.getItemById);
router.post("/", controller.addItem);
router.put("/:id", controller.updateItem);
router.delete("/:id", controller.deleteItem);
router.patch("/:id", controller.patchItem);
module.exports = router;