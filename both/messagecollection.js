import { Mongo } from 'meteor/mongo';
export const messages = new Mongo.Collection('messages');
export const friends = new Mongo.Collection('friends');
export const reject = new Mongo.Collection('reject');
