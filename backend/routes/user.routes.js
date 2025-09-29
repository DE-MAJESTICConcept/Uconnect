// import express from "express";
// import { fetchDetails, getUsers, addFriend } from "../controllers/student.controller.js";

// const studentRoutes=express.Router();

// studentRoutes.post("/fetchDetails",fetchDetails);
// studentRoutes.get("/getUsers",getUsers);
// studentRoutes.post("/addFriend",addFriend);

// export default studentRoutes;
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { discoverPeople } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/discover", protect, discoverPeople);
// studentRoutes.post("/fetchDetails",fetchDetails);
// studentRoutes.get("/getUsers",getUsers);
// studentRoutes.post("/addFriend",addFriend);

export default router;