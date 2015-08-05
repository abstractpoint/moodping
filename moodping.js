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

    Template.face.helpers({
        faceImage: function(){

            happyWords = Words.find({mood: 'positive', createdAt:{ $gte : new Date(moment().subtract(20, 'minutes').format()) }},{'limit':100, sort: {createdAt: -1}}).count();
            unhappyWords = Words.find({mood: 'negative',createdAt:{ $gte : new Date(moment().subtract(20, 'minutes').format()) }},{'limit':100, sort: {createdAt: -1}}).count();
            
            console.log(moment().subtract(20, 'minutes').format());
            console.log("happy:"+happyWords+" unhappy:"+unhappyWords);

            if (happyWords >= unhappyWords) {
                return 'happy';   
            } else {
                return 'unhappy';  
            }
            
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

    return Meteor.methods({
        removeAllWords: function() {
            return Words.remove({});
        }
    });
});


if(Meteor.isServer){
    // server code goes here
    Meteor.publish("words", function () {
        return Words.find({}, {'limit':1000, sort: {createdAt: -1}});
    });

    Meteor.publish('publication', function() {
      Counts.publish(this, 'words', Words.find());
    });
}


var neutralArray = [
"of", "he", "she", "the", "a", "is"
];

var negativeArray = [
"abysmal","adverse","alarming","angry","annoy","anxious","apathy","appalling","atrocious","awful","bad","banal","barbed","belligerent","bemoan","beneath","boring","broken","callous","can't","clumsy","coarse","cold","cold-hearted","collapse","confused","contradictory","contrary","corrosive","corrupt","crazy","creepy","criminal","cruel","cry","cutting","dead","decaying","damage","damaging","dastardly","deplorable","depressed","deprived","deformed","deny","despicable","detrimental","dirty","disease","disgusting","disheveled","dishonest","dishonorable","dismal","distress","don't","dreadful","dreary","enraged","eroding","evil","fail","faulty","fear","feeble","fight","filthy","foul","frighten","frightful","gawky","ghastly","grave","greed","grim","grimace","gross","grotesque","gruesome","guilty","haggard","hard","hard-hearted","harmful","hate","hideous","homely","horrendous","horrible","hostile","hurt","hurtful","icky","ignore","ignorant","ill","immature","imperfect","impossible","inane","inelegant","infernal","injure","injurious","insane","insidious","insipid","jealous","junky","lose","lousy","lumpy","malicious","mean","menacing","messy","misshapen","missing","misunderstood","moan","moldy","monstrous","naive","nasty","naughty","negate","negative","never","no","nobody","nondescript","nonsense","not","noxious","objectionable","odious","offensive","old","oppressive","pain","perturb","pessimistic","petty","plain","poisonous","poor","prejudice","questionable","quirky","quit","reject","renege","repellant","reptilian","repulsive","repugnant","revenge","revolting","rocky","rotten","rude","ruthless","sad","savage","scare","scary","scream","severe","shoddy","shocking","sick","sickening","sinister","slimy","smelly","sobbing","sorry","spiteful","sticky","stinky","stormy","stressful","stuck","stupid","substandard","suspect","suspicious","tense","terrible","terrifying","threatening","ugly","undermine","unfair","unfavorable","unhappy","unhealthy","unjust","unlucky","unpleasant","upset","unsatisfactory","unsightly","untoward","unwanted","unwelcome","unwholesome","unwieldy","unwise","upset","vice","vicious","vile","villainous","vindictive","wary","weary","wicked","woeful","worthless","wound","yell","yucky","zero"
];

var positiveArray = [
"absolutely","adorable","accepted","acclaimed","accomplish","accomplishment","achievement","action","active","admire","adventure","affirmative","affluent","agree","agreeable","amazing","angelic","appealing","approve","aptitude","attractive","awesome","beaming","beautiful","believe","beneficial","bliss","bountiful","bounty","brave","bravo","brilliant","bubbly","calm","celebrated","certain","champ","champion","charming","cheery","choice","classic","classical","clean","commend","composed","congratulation","constant","cool","courageous","creative","cute","dazzling","delight","delightful","distinguished","divine","earnest","easy","ecstatic","effective","effervescent","efficient","effortless","electrifying","elegant","enchanting","encouraging","endorsed","energetic","energized","engaging","enthusiastic","essential","esteemed","ethical","excellent","exciting","exquisite","fabulous","fair","familiar","famous","fantastic","favorable","fetching","fine","fitting","flourishing","fortunate","free","fresh","friendly","fun","funny","generous","genius","genuine","giving","glamorous","glowing","good","gorgeous","graceful","great","green","grin","growing","handsome","happy","harmonious","healing","healthy","hearty","heavenly","honest","honorable","honored","hug","idea","ideal","imaginative","imagine","impressive","independent","innovate","innovative","instant","instantaneous","instinctive","intuitive","intellectual","intelligent","inventive","jovial","joy","jubilant","keen","kind","knowing","knowledgeable","laugh","legendary","light","learned","lively","lovely","lucid","lucky","luminous","marvelous","masterful","meaningful","merit","meritorious","miraculous","motivating","moving","natural","nice","novel","now","nurturing","nutritious","okay","one","one-hundred percent","open","optimistic","paradise","perfect","phenomenal","pleasurable","plentiful","pleasant","poised","polished","popular","positive","powerful","prepared","pretty","principled","productive","progress","prominent","protected","proud","quality","quick","quiet","ready","reassuring","refined","refreshing","rejoice","reliable","remarkable","resounding","respected","restored","reward","rewarding","right","robust","safe","satisfactory","secure","seemly","simple","skilled","skillful","smile","soulful","sparkling","special","spirited","spiritual","stirring","stupendous","stunning","success","successful","sunny","super","superb","supporting","surprising","terrific","thorough","thrilling","thriving","tops","tranquil","transforming","transformative","trusting","truthful","unreal","unwavering","up","upbeat","upright","upstanding","valued","vibrant","victorious","victory","vigorous","virtuous","vital","vivacious","wealthy","welcome","well","whole","wholesome","willing","wonderful","wondrous","worthy","wow","yes","yummy","zeal","zealous"
];

processPhrase = function (phrase) {
    wordsArray = [];
    if (hasWhiteSpace(phrase) > 0) {
        wordsArray = phrase.split(" ");
    } else {
        wordsArray.push(phrase);
    }
        
    wordsInsert = [];
    _.each(wordsArray, function(word, index) {
        


        if (_.indexOf(neutralArray, word.toLowerCase()) > -1) {
            wordsInsert.push({name: word.toLowerCase(), createdAt: new Date(), mood: 'neutral'});
        }

        if (_.indexOf(negativeArray, word.toLowerCase()) > -1) {
            wordsInsert.push({name: word.toLowerCase(), createdAt: new Date(), mood: 'negative'});
        }

        if (_.indexOf(positiveArray, word.toLowerCase()) > -1) {
            wordsInsert.push({name: word.toLowerCase(), createdAt: new Date(), mood: 'positive'});
        }

        //wordsInsert.push({name: word, createdAt: new Date()});
    });
    console.log(wordsInsert);
    if (wordsInsert) {
        _.each(wordsInsert, function(word) {
            Words.insert(word);
        });
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