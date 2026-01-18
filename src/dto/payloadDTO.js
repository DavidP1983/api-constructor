export class PayloadDTO {
    id;
    name;
    email;
    avatar;

    constructor(userModel) {
        this.id = userModel.id;
        this.name = userModel.name;
        this.email = userModel.email;
        this.role = userModel.role;
    }
}

