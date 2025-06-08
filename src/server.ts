import { Server } from "http";
import app from "./app";
const PORT = 5001;

async function main() {
    try {
        const server: Server = app.listen(PORT, () => {
            console.log("[LOG <server.ts>]: App is listening to port ", PORT);
        });
    } catch (error) {
        console.log("[LOG <server.ts>]: Failed to run server.\n", error);
    }
}

main();
