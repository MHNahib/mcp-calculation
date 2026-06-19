import express from "express";
import router from "./routes";

const app = express();
app.use(express.json());
const PORT = Number(process.env.PORT) || 3000;

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}/mcp`);
});
