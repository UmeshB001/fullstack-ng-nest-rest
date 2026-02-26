import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// 1. Define the class as a Mongoose Document for type safety
export type UserDocument = User & Document;

@Schema({ timestamps: true }) // Automatically adds createdAt and updatedAt fields
export class User {
  @Prop({
    required: true,
    unique: true, // Prevents duplicate registrations with the same username
    trim: true, // Removes accidental whitespace
  })
  username: string;

  @Prop({
    required: true,
  })
  password: string; // This will store the Hashed version, never plain text

  @Prop({
    required: true,
    enum: ['admin', 'user'], // Restricts roles to only these two options
    default: 'user',
  })
  role: string;
}

// 2. Generate the Schema factory
export const UserSchema = SchemaFactory.createForClass(User);
