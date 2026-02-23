import {Prop,Schema,SchemaFactory} from '@nestjs/mongoose';
import e from 'express';
import { Document } from 'mongoose';
@Schema()
export class Task extends Document{
    @Prop({required:true})
    title:string;

    @Prop({default:'Pending'})
    status:string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);