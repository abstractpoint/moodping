// DB
// ##
// ##

Words = new Mongo.Collection("words");
//console.log(Words);

if(Meteor.isClient){
    // client code goes here
    Meteor.subscribe("words");
    Meteor.subscribe("publication");
    Template.words.helpers({
        word: function(){
            return Words.find({},{'limit':100, sort: {createdAt: -1}});
        }
    });

    var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    console.log(is_chrome);
    if(is_chrome)
    {
        var recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.onresult = function (e) {
            console.log(e.resultIndex);
            _.each(e.results, function(result, i) {
                console.log("iteration:"+i);
                console.log(result);
                if (result.isFinal == true) {
                    console.log(result[0].transcript);
                    processPhrase(result[0].transcript);
                    console.log(Counts.get('words'));
                }
            });
        }

        recognition.addEventListener('end', function () {
             recognition.start();
             console.log('restarting recognition');
        })

    }  
    
}

Meteor.startup(function () {
    //Words.remove({});
    // The correct way
    if(Meteor.isClient){
        recognition.start();
        console.log(Counts.get('words'));
    }
});


if(Meteor.isServer){
    // server code goes here
    Meteor.publish("words", function () {
        return Words.find({}, {'limit':100, sort: {createdAt: -1}});
    });

    Meteor.publish('publication', function() {
      Counts.publish(this, 'words', Words.find());
    });

    // must have an allow function on server to use batchInsert() on client.
    Words.allow({
      insert: function(){ return true }
    });
}




processPhrase = function (phrase) {
    if (hasWhiteSpace(phrase) > 0) {
        wordsArray = phrase.split(" ");
        wordsInsert = [];
        _.each(wordsArray, function(word, index) {
            
            if (word == 'of' || word == 'he' || word == 'the' || word == 'a') {
                wordsInsert.push({name: word, createdAt: new Date()});
            }

            //wordsInsert.push({name: word, createdAt: new Date()});
        });
        console.log(wordsInsert);
        Words.batchInsert(wordsInsert);
    } else {
        Words.insert({name: phrase, createdAt: new Date()});
    }
}


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

Router.route('/mood-super-good', {
    name: 'mood-good', //optional
    where: 'server', //important to make sure that the function is synchronous
    action: function() {
        //console.log(this.request.body);
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

hasWhiteSpace = function (s) {
  return s.indexOf(' ') >= 0;
}


/*
<pingdom_http_custom_check>
    <status>OK</status>
    <response_time>96.777</response_time>
</pingdom_http_custom_check>
*/