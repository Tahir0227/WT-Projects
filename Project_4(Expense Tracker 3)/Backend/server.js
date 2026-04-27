const express = require("express");
const app = express();
const cors = require("cors");

const { PORT } = require("./utils/config");
const { authUser } = require("./utils/auth");
const commonRoutes = require("./routes/common");
const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expenses");

app.use(cors());
app.use(express.json());

app.use(authUser);
app.use("/", commonRoutes);
app.use("/expenses", expenseRoutes);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
