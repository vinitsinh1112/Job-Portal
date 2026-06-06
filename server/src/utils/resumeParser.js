import axios from "axios";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse/lib/pdf-parse.js");

export const extractResumeText = async (fileUrl) => {
    try {
        const response = await axios.get(fileUrl, {
            responseType: "arraybuffer",
        });

        const data = await pdf(response.data);

        return data.text;

    } catch (error) {
        throw error;
    }
};