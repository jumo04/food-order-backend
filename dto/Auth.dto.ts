import { VandorPayLoad } from "./Vandor.dto";

import { CustomerPayLoad } from "./Customer.dto";

export type AuthPayLoad = VandorPayLoad  | CustomerPayLoad;