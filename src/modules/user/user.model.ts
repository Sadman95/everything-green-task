/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model, models } from "mongoose";
import { IUserSchema, UserModel } from "./user.interface";
import bcrypt from "bcryptjs";
import config from "config";

const UserSchema = new Schema<IUserSchema, UserModel>(
  {
    id: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

//hash password
UserSchema.pre("save", async function (next) {
	const user = this;

	user.password = await bcrypt.hash(
		user.password,
		Number(config.bcrypt_salt_round)
	);

	next();
});


/* check password match or not */
UserSchema.static(
	"isPasswordMatch",
	async function (
		givenPassword: string,
		savedPassword: string
	): Promise<boolean> {
		return await bcrypt.compare(givenPassword, savedPassword);
	}
);

export default models.User || model<IUserSchema>("User", UserSchema);
