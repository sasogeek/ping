import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.ping.events({
    'submit form': function() {
        event.preventDefault();
        var hostname = $('#hostname').val();
        Meteor.call('ping', hostname, function(){});
    },

    'click #clear': function(){
        Meteor.call('clear', function(){});
    }
});

Template.ping.helpers({
    pings: function () {
        return Pings.find({});
    }
});