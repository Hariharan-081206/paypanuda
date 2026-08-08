import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./routes/authroutes.js";
import groupRoutes from "./routes/grouproutes.js";
import expenseRoutes from "./routes/expenseroutes.js";
import balanceRoutes from "./routes/balanceroutes.js";
import settlementRoutes from "./routes/settlementroutes.js";
//import dashboardRoutes from "./routes/dashboardroutes.js";
import notificationRoutes from "./routes/notificationroutes.js";
const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/balance", balanceRoutes);
app.use("/api/settlements", settlementRoutes);
app.use("/api/notifications", notificationRoutes);
//app.use("/api/dashboard", dashboardRoutes);


app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Expense Split API Running"
    });
});

export default app;