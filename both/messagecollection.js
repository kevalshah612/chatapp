import { Mongo } from 'meteor/mongo';
export const messages = new Mongo.Collection('messages');
