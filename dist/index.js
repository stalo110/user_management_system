"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const database_config_1 = __importDefault(require("./config/database.config"));
const dotenv_1 = __importDefault(require("dotenv"));
// import AdminRouter from "./routes/adminRoutes";
// import EventRouter from "./routes/eventsRoutes";
// import GuestRouter from "./routes/guestRoutes";
dotenv_1.default.config();
const app = (0, express_1.default)();
const corsOptions = {
    origin: [
        "http://localhost:3000",
        "http://192.168.0.197:4000",
        "http://100.64.100.6:5000",
    ],
    credentials: true,
};
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
// app.use("/admin", AdminRouter);
// app.use("/events", EventRouter);
// app.use("/guest", GuestRouter);
app.use((0, helmet_1.default)());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000,
    max: 10,
    message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);
app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status || 500;
    const response = Object.assign({ message: err.message }, (process.env.NODE_ENV === "development" && { stack: err.stack }));
    res.status(status).json(response);
});
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404, "Not Found"));
});
// db connection
database_config_1.default.sync().then(() => {
    console.log("Database Connected Successfully");
}).catch((err) => {
    console.log("Error Connecting to Dtabase", err);
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
