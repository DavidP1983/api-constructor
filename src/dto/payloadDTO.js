export class PayloadDTO {
    id;
    name;
    email;
    avatar;

    constructor(userModel) {
        this.id = String(userModel._id);
        this.name = userModel.name;
        this.email = userModel.email;
        this.role = userModel.role;
    }
}

