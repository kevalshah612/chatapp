import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {messages} from '../both/messagecollection.js'
import {friends} from '../both/messagecollection.js'
import {reject} from '../both/messagecollection.js'
import './main.html';

  Accounts.ui.config({
  		passwordSignupFields: 'USERNAME_AND_EMAIL'
	});

Router.route('/', function () {
	$('.home').addClass('active')
	$('.frd').removeClass('active')
  	this.render('chatapp');
  	this.render('chatapp');  	
});

Router.route('/find-friends', function () {
	$('.home').removeClass('active')
	$('.frd').addClass('active')
	this.render('findfriends');
});

if(Meteor.isClient) 
{
	Template.findfriends.helpers({
		finds:function(){
			if(Meteor.userId()){
				return Meteor.users.find({_id : {$ne : Meteor.userId()}})
			}
		},
		isvalid: function(id){
			var frd = friends.find({$and: [
    {from:Meteor.userId()},
    {to:id}
  ]},{limit:1}).fetch();
			if (frd==""){
				return true;
			}
			else
			{
				return false;
			}
		},
		blank: function(){
			if($("a").hasClass("js-accept")){
				return true;
			}
		},
		isreject: function(id){
			var rej = reject.find({$and: [
		    {from:Meteor.userId()},
		    {to:id}
		  ]},{limit:1}).fetch();
			//alert(rej)
			if(rej==""){
				
				return true;
			}
			else{
				return false;
			}
		},

	})

	Template.chatmsgg.helpers({
		chat: function(){
			if(Meteor.userId()){
				//alert(Session.get('with'))
				var chat= messages.find({
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
			//alert(chat[0].message)
			return chat;
			}
			//alert(Session.get('with'))			
		},
		isuser: function (id){
			return Meteor.userId()===id;
		},
		reciver: function (id){
			return Meteor.userId()!==id;
		},
		formatDate:function (d){
			$('.msg_history').scrollTop($('.msg_history').prop('scrollHeight'));
			return  ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2)+ " " +("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
    d.getFullYear(); 
		},
	})

	Template.chatapp.helpers({
		user_list: function (){
			if(Meteor.userId()){
				var first=friends.find({from:Meteor.userId()},{limit:1}).fetch();
				Session.set('with',first[0].to);
				//alert(Session.get('with'))
				return friends.find({from:Meteor.userId()}).fetch();
			}
		},
	getname: function(id){
			var name = Meteor.users.findOne({_id: id});
			return name.username;
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

	Template.chatmsgg.rendered = function() {
	  jQuery(document).ready(checkContainer);
		function checkContainer () {
		  if($('#'+Session.get('with')).is(':visible')){ //if the container is visible on the page
		  	$('#'+ Session.get('with')).addClass('active_chat');
		  } else {
		  	setTimeout(checkContainer, 50); 
		  }
		}
	}
	
	Template.findfriends.events({
		'click .js-accept':function(){
			var temp = friends.find({
				$and:[
				{
					from:Meteor.userId()
				},
				{
					to:this._id
				}
			]
		}).fetch()
			try {
				var a = temp[0]._id
			}
			catch (e){
				//alert("insert")
				var frd = {
					from:Meteor.userId(),
					to: this._id
				}
				friends.insert(frd)
			}	
		},
		'click .js-reject':function(){

			var temp = reject.find({
				$and:[
				{
					from:Meteor.userId()
				},
				{
					to:this._id
				}
			]
		}).fetch()
			try {
				var a = temp[0]._id
			}
			catch (e){
				//alert("insert")
				var frd = {
					from:Meteor.userId(),
					to: this._id
				}
				reject.insert(frd)
			}
		}

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
			var id = Session.get('with');
			$('#'+id).removeClass('active_chat');
			Session.set('with',this.to)
			//alert(Session.get('with'))
			$('#'+this.to).addClass('active_chat');
			$('.msg_history').scrollTop($('.msg_history').prop('scrollHeight'));
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