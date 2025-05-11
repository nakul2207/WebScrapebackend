import express from "express";
import {scrapeSydneyEvents} from "../controller/dataScraper";
const Mainrouter = express.Router();


Mainrouter.get("/scrape", scrapeSydneyEvents);

export default Mainrouter;