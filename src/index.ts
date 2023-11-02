import { loadEnvFile } from "./common";
import { APP_NAME, APP_SHORTENED, APP_TEXT_ART, VERSION } from "./version";


console.log(APP_TEXT_ART);
console.log(`${APP_NAME} (${APP_SHORTENED}) - VERSION ${VERSION}\n\n`);
main();

async function main() {
    loadEnvFile();
}