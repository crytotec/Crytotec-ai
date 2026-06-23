import { app } from "./app"
import { connectToDb } from "./Connection/ConnectToDb"

const PORT = process.env.PORT || 5000

const serverset = async () => {
  await connectToDb();
  app.listen(PORT, () => {
    console.log(`server is running ${PORT}`);
  })
}

serverset();

export default app  // ✅ Add this line for Vercel