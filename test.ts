import dotenv from "dotenv";
dotenv.config();
// import dbutils from './src/index';
import dbutils from "@api-utils/dbutils/src/index";

dbutils.connectToDatabase();

setTimeout(() => {
    console.log(dbutils.isDatabaseConnected());
    dbutils.closeDatabaseConnection();
}, 5000);
