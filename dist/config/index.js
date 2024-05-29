"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TWILIO_AUTH_TOKEN = exports.TWILIO_ACCOUNT_SID = exports.PORT = exports.APP_SECRET = exports.MONGO_URL = void 0;
exports.MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/online_food_delivery';
exports.APP_SECRET = process.env.APP_SECRET || 'some_very_secret_key';
exports.PORT = process.env.PORT || 8000;
exports.TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
exports.TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
//# sourceMappingURL=index.js.map