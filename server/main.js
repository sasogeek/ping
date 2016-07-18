import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
    sys = require('sys');
    exec = require('child_process').exec;
    Fiber = Npm.require('fibers')

});


Meteor.methods({

    clear: function() {
        Pings.remove({});
    },

    ping: function (hostname) {
        function puts(error, stdout, stderr) {
            Fiber(function() {
                if (stdout) {
                    console.log("stdout: "+stdout);
                    if (stdout.search("from")!=-1) {
                        Pings.upsert({host: hostname}, {host: hostname, status: "Alive", response: stdout});
                    } else {
                        Pings.upsert({host: hostname}, {host: hostname, status: "Dead", response: stdout});
                    }
                } else if (stderr) {
                    console.log("stderr: "+stderr);
                    Pings.upsert({host: hostname}, {host: hostname, status: "Dead", response: stderr});
                } else {
                    console.log("error: "+ error);
                    Pings.upsert({host: hostname}, {host: hostname, status: "Technical Difficulties", response: error});
                }
            }).run();


        }


        setInterval(function() {
                        exec("ping -c 1 "+hostname+" | grep icmp_seq", puts)
                    },
        1000);
    }



});
