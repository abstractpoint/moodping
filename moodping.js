if(Meteor.isClient){
    // client code goes here
    Meteor.subscribe("words");

    Template.words.helpers({
        word: function(){
            return Words.find({},{'limit':20, sort: {createdAt: -1}});
        }
    });

    var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    console.log(is_chrome);
    if(is_chrome)
    {
        var recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = function (e) {
            console.log(e.results);
            i = e.results.length - 1;
            if (e.results[i].isFinal == true) {
            console.log(e.results[i].isFinal);
            Words.insert({name: e.results[i][0].transcript, createdAt: new Date()});
            }
        }

        recognition.onend = function() {
            recognition.start();
            console.log('restarting recognition');

        }
    }  
    
}

Meteor.startup(function () {
    // The correct way
    if(Meteor.isClient){
        recognition.start();
    }
});


if(Meteor.isServer){
    // server code goes here
    Meteor.publish("words", function () {
      return Words.find({},{'limit':20, sort: {createdAt: -1}});
    });
}

// DB
// ##
// ##

Words = new Mongo.Collection("words");
//console.log(Words);

//


// ROUTES
// ######
// ######

Router.route('/');

Router.route('/words', {
    name: 'words', //optional
    where: 'server', //important to make sure that the function is synchronous
    action: function() {
        console.log(this.request.body);
        Words.insert({
            name: this.request.body.name,
            createdAt: new Date()
        });
        this.response.writeHead(200);
        this.response.end();
    }
});

Router.route('/mood-feed-good', {
    name: 'mood-feed-good', //optional
    where: 'server', //important to make sure that the function is synchronous
    action: function() {
        //console.log(this.request.body);
        var xmlData = myfeedExport(); //grabs your data
        this.response.writeHead(200, {'Content-Type': 'application/xml'}); //outputs data to visitor
        this.response.end(xmlData);
    }
});

Router.route('/mood-feed-super-good', {
    name: 'mood-feed-super-good', //optional
    where: 'server', //important to make sure that the function is synchronous
    action: function() {
        var xmlData = myfeedExport(); //grabs your data
        this.response.writeHead(200, {'Content-Type': 'application/xml'}); //outputs data to visitor
        this.response.end(xmlData);
    }
});

myfeedExport = function () {
    
    var obj = {
      'pingdom_http_custom_check': {
        status: "OK",
        response_time: 0,
      }
    };

    var feed = XmlBuilder.create(obj) //sets up the "parent" xml object

    return feed.end({pretty: true})
}

/*
<pingdom_http_custom_check>
    <status>OK</status>
    <response_time>96.777</response_time>
</pingdom_http_custom_check>
*/