// The server installs the same catalog that the browser loads on demand.
import catalog from "./zh-CN.json";
import { installCatalog } from "./translate.ts";

installCatalog("zh-CN", catalog);
