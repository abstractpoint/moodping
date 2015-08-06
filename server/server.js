// server code goes here
Meteor.startup(function () {
    return Meteor.methods({
        removeAllWords: function() {
            return Words.remove({});
        }
    });
});

Meteor.publish("words", function () {
    return Words.find({}, {'limit':50, sort: {createdAt: -1}});
});

Meteor.publish('publication', function() {
  Counts.publish(this, 'words', Words.find());
});