import mongoose from "mongoose";
export default function(){
    const username = process.env.MONGO_USERNAME;
    const password = process.env.MONGO_PASSWORD;
    const MONGO_HOST = process.env.MONGO_HOST || 'localhost'; // Default to localhost
    const MONGO_PORT = process.env.MONGO_PORT || 27017; // Default MongoDB port

    let dbURL = `mongodb://${MONGO_HOST}:${MONGO_PORT}/users`;
    dbURL = "mongodb+srv://kshahkolaee:oSAA7qZDZg7xJnqj@cluster0.8vvtryx.mongodb.net/dg-kala-sample?retryWrites=true&w=majority&appName=Cluster0"; 
    if (username){
        dbURL = "mongodb://mongo-0.mongo,mongo-1.mongo,mongo-2.mongo:27017";
        dbURL += "/users?authSource=admin&replicaSet=rs0&readPreference=secondaryPreferred";
    }
    console.log(dbURL)
    mongoose.connect(dbURL).then(() => console.log("connected")).catch(err => console.log(err));
}
