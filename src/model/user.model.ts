import bcrypt from "bcrypt";
import config from "config";
import mongoose from "mongoose";

export interface UserDocument extends mongoose.Document{
    email: string,
    name: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        password: { type: String, required: true },
    },
    {
        timestamps: true
    }
);

UserSchema.methods.comparePassword = async function( candidatePassword: string ){
    const user = this as UserDocument;
    return bcrypt.compare(candidatePassword, user.password).catch((e) => false)
} 

UserSchema.pre("save", async function ( next: mongoose.HookNextFunction){
    let user = this as UserDocument;
    if(!user.isModified("password")) return next();

    const salt = await bcrypt.genSalt(config.get("saltWorkFactor"));

    const hash = await bcrypt.hashSync(user.password, salt);

    user.password = hash;

    return next();
})
const User = mongoose.model<UserDocument>("User", UserSchema);

export default User;