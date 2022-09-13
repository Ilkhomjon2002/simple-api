const { response } = require("express");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: ".env-local" });
const PORT = process.env.PORT || "3000";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => {
  console.log("listening for requests on port " + PORT);
});

const userRouter = require("./routes/user");

app.use("/user", userRouter);

app.get("/", (req, res) => {
  res
    .status(200)
    .send(
      "this is not why you are here. Head to /user/:id and replace :id with your user:"
    );
});
