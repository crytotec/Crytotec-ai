import { app } from "./app.js";
import { connectToDb } from "./Connection/ConnectToDb.js";
const PORT = process.env.PORT || 5000;
const serverset = async () => {
    await connectToDb();
    app.listen(PORT, () => {
        console.log(`server is running ${PORT} `);
    });
};
serverset();
//# sourceMappingURL=index.js.map