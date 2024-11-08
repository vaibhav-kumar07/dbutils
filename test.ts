import dotenv from "dotenv";
dotenv.config();
import dbutils from "./src/index";

dbutils.connectToDatabase();

setTimeout(() => {
    console.log(dbutils.isDatabaseConnected());
    dbutils.closeDatabaseConnection();
}, 5000);
