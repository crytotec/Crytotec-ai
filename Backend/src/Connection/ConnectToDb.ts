    import mongoose from "mongoose"
    



    export const connectToDb = async () => {
        try {
            await mongoose.connect(process.env.MONGODB_URL)
            console.log('connect successful to db');
        } catch (error) {
            console.log(error, 'connectionn fail');
            
        }
    }