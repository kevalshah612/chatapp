import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {messages} from '../both/messagecollection.js'
import './main.html';

  Accounts.ui.config({
  		passwordSignupFields: 'USERNAME_AND_EMAIL'
	});

if(Meteor.isClient) 
{
	Template.chatmsgg.helpers({
		chat: function(){
			if(Meteor.userId()){
				return messages.find({
	$or:[
	{
		$and:[
			{
				from:Meteor.userId()
			},
			{
				to:Session.get('with')
			}
		]
	},
	{
		$and:[
			{
				to:Meteor.userId()
			},
			{
				from:Session.get('with')
			}
		]
	}
	]
},{sort: {date: 1}}).fetch();
			}			
		},
		isuser: function (id){
			$('.msg_history').scrollTop($('.msg_history')[0].scrollHeight);
			return Meteor.userId()===id;
		},
		reciver: function (id){
			$('.msg_history').scrollTop($('.msg_history')[0].scrollHeight);
			return Meteor.userId()!==id;
		},
		formatDate:function (d){
			return  ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2)+ " " +("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
    d.getFullYear(); 
		},
	})

	Template.chatapp.helpers({
		user_list: function (){
			if(Meteor.userId()){
				var first=Meteor.users.findOne({_id: {$ne: Meteor.userId()}});
				Session.set('with',first._id);
				return Meteor.users.find({_id: {$ne: Meteor.userId()}}).fetch();
				$('.inbox_chat .chat_list').eq(1).addClass('aaaa');
			}
		},
		call: function(id){
			return messages.find({
	$or:[
	{
		$and:[
			{
				from:Meteor.userId()
			},
			{
				to:id
			}
		]
	},
	{
		$and:[
			{
				to:Meteor.userId()
			},
			{
				from:id
			}
		]
	}
	]
},{sort: {date: -1},limit:1}).fetch();
		},
		setdate:function (d){
			return  ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2)+ " " +("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
    		d.getFullYear(); 
		},

	})

	Template.chatapp.events({
		'click .msg_send_btn':function(events){
			if(Meteor.userId()){
				var msg=$('.write_msg').val();
				if(msg.trim(msg).length!=0){
					//enter in to database 
					var data = {
						from: Meteor.userId(),
						to:Session.get('with'),
						message:msg,
						date:new Date()
					}
					messages.insert(data)
					$('.write_msg').val('');
				}
				else{
					$('.write_msg').val('');
				}
			}
		},

		
		'click .chat_list':function (event){
			$('.msg_history').scrollTop($('.msg_history')[0].scrollHeight);
			var id = Session.get('with');
			$('#'+id).removeClass('active_chat');			
			Session.set('with',this._id)
			//$().addClass('active_chat');
			$('#'+this._id).addClass('active_chat');
			Template.chatmsgg.__helpers.get('chat').call()
		}

	});

	$(function() {
	  if(Meteor.userId()==null){
	  	$('.log').addClass('alert-primary')
	  	$('.log').text("Please Login First!!")
	  }
	  else{
	  	$('.log').removeClass('alert-primary')
	  	$('.log').text("")	  	
	  }
	});

	Meteor.setInterval(function (){
		$(function() {
		  if(Meteor.userId()==null){
		  	$('.log').addClass('alert-primary')
		  	$('.log').text("Please Login First!!")
		  }
		  else{
		  	$('.log').removeClass('alert-primary')
		  	$('.log').text("")	  	
		  }
		});	
	},1000);
}