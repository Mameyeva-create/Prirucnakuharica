import { DATA_SOURCE } from "../constants";
import SastojakServiceLocalStorage from "./SastojakServiceLocalStorage";
import SastojakServiceMemorija from "./SastojakServiceMemorija";


const SastojakService = 
DATA_SOURCE === "memorija"
? SastojakServiceMemorija : SastojakServiceLocalStorage

export default SastojakService