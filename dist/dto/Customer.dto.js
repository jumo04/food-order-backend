"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditCustomerProfileInputs = exports.UserLoginInputs = exports.CustomerInput = void 0;
const class_validator_1 = require("class-validator");
class CustomerInput {
}
exports.CustomerInput = CustomerInput;
__decorate([
    (0, class_validator_1.IsEmail)()
], CustomerInput.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.Length)(7, 12)
], CustomerInput.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.Length)(6, 12)
], CustomerInput.prototype, "password", void 0);
class UserLoginInputs {
}
exports.UserLoginInputs = UserLoginInputs;
__decorate([
    (0, class_validator_1.IsEmail)()
], UserLoginInputs.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.Length)(6, 12)
], UserLoginInputs.prototype, "password", void 0);
class EditCustomerProfileInputs {
}
exports.EditCustomerProfileInputs = EditCustomerProfileInputs;
__decorate([
    (0, class_validator_1.Length)(6, 12)
], EditCustomerProfileInputs.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.Length)(6, 12)
], EditCustomerProfileInputs.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.Length)(6, 12)
], EditCustomerProfileInputs.prototype, "address", void 0);
//# sourceMappingURL=Customer.dto.js.map