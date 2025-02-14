import { connectDB } from "lib/db";
import User from 'modules/user/user.model';
import { ObjectId } from "mongoose";
import { CreateUserDTO } from "./user.interface";

/**
 * ============
 * User service
 * ============
 */
export class UserService {
	/**
	 * @summary create new user service
	 * @param payload
	 */
	static async createUser(payload: CreateUserDTO) {
		const { name, email, password } = payload;

		await connectDB();

		const user = new User({ name, email, password });

		return user.save();
	}

	/**
	 * @summary Get user by id or email
	 * @param payload {id: ObjectId} or {email: string}
	 */
	static async getUser(payload: { id?: ObjectId } | { email?: string }) {

		let user = null;

		if ("id" in payload) {
			user = await User.findById(payload.id);
		} else if ("email" in payload) {
			user = await User.findOne({ email: payload.email });
		}
		return user
	}

	/**
	 * @summary get all users
	 * @returns 
	 */
	static async getUsers() {

		await connectDB();

		const users = await User.find({});

		return users;

	}

}
