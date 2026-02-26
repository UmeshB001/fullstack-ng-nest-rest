import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; // Import decorators and functions from @nestjs/mongoose to define a Mongoose schema for the Task model. Prop is used to define properties of the schema, Schema marks the class as a Mongoose schema, and SchemaFactory is used to create the actual schema from the class definition.
import { Document } from 'mongoose'; // Import Document from mongoose to extend our Task class, allowing us to use Mongoose's document features (e.g., saving, querying) when working with tasks in the database.
@Schema() // This decorator marks the Task class as a Mongoose schema, allowing us to define the structure of the documents in the tasks collection in MongoDB. It enables us to use this class to create and manage task documents in the database.
export class Task extends Document {
  // The Task class extends Document, which means it inherits all the properties and methods of a Mongoose document. This allows us to create, save, and query task documents in MongoDB using this class as a model.
  @Prop({ required: true }) // The @Prop decorator defines a property of the schema. In this case, it marks the title property as required, meaning that every task document must have a title when it is created or saved to the database.
  title: string; //    The title property is a string that represents the title of the task. It is marked as required, so it must be provided when creating a new task document in the database.

  @Prop({ default: 'Pending' }) // The @Prop decorator defines the status property of the schema. It has a default value of 'Pending', which means that if no status is provided when creating a new task document, it will automatically be set to 'Pending'. This property represents the current status of the task (e.g., 'Pending' or 'Done').
  status: string; // The status property is a string that represents the current status of the task.
}

export const TaskSchema = SchemaFactory.createForClass(Task); // This line creates a Mongoose schema from the Task class using the SchemaFactory. The resulting TaskSchema can be used to define the structure of the tasks collection in MongoDB and to create and manage task documents in the database.
