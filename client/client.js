// client code goes here
Meteor.startup(function () {
    if (recognition) { recognition.start(); }
});


Meteor.subscribe("words");
Template.words.helpers({
    word: function(){
        return Words.find({},{'limit':60, sort: {createdAt: -1}});
    }
});

Template.face.helpers({
    faceImage: function(){

        var mood = moodPercent();

        if (mood >= 50) {
            return 'smile';
        } else if (mood > 33 && mood < 50) {
            return 'meh';
        }  else if (mood < 33) {
            return 'frown';  
        }
    },
    mood: function() { return numeral(moodPercent()).format('0'); }
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