// @ts-nocheck
import Urbit from "@urbit/http-api";

export const api = new Urbit("", "", window.desk);
api.ship = window.ship;

window.api = api;
