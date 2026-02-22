export class UserDTO {
    id;
    name;
    email;
    role;
    joined;
    notifications;
    lastActivity;
    lastLogin;
    hasAvatar;

    constructor(userModel) {
        this.id = String(userModel._id);
        this.name = userModel.name;
        this.email = userModel.email;
        this.role = userModel.role;
        this.joined = userModel.joined;
        this.notifications = userModel.notifications;
        this.lastActivity = userModel.lastActivity;
        this.lastLogin = userModel.lastLogin;
        this.hasAvatar = Boolean(userModel.avatar);
    }
}
