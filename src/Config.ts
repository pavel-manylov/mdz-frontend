import {ComponentsApi, PostsApi} from "./api";

export default class Config {
    // @ts-ignore
    static apiBasePath = window.apiBasePath || "http://mac.mini:3000";
    static postApi = new PostsApi(undefined, Config.apiBasePath);
    static componentApi = new ComponentsApi(undefined, Config.apiBasePath);
}