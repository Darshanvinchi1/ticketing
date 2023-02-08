import express, { Request, Response } from "express";
import "express-async-errors";
import { json } from "body-parser";

import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@dvticketing/common";
import { deleteOrdersRouter } from "./routes/delete";
import { indexOrdersRouter } from "./routes";
import { showOrdersRouter } from "./routes/show";
import { newOrdersRouter } from "./routes/new";

const app = express();
app.set('trust proxy',true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV != 'test'
    })
);
app.use(currentUser);

app.use(deleteOrdersRouter)
app.use(indexOrdersRouter);
app.use(showOrdersRouter);
app.use(newOrdersRouter);

app.all('*', async (req: Request, res: Response) => {
    throw new NotFoundError();
})

app.use(errorHandler);

export { app };