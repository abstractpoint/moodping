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

Picker.route('/mood-super-good', function(params, req, res, next) {
	var percent = moodPercent();
	var xmlData = myfeedExport(percent); //grabs your data
	//this.response.writeHead(200, {'Content-Type': 'application/xml'}); //outputs data to visitor
	//this.response.end(xmlData);
  	res.end(xmlData);
});

var neutralArray = [
"of", "he", "she", "the", "a", "is"
];

var negativeArray = [
"abysmal","adverse","alarming","angry","annoy","anxious","apathy","appalling","atrocious","awful","bad","banal","barbed","belligerent","bemoan","beneath","boring","broken","callous","can't","clumsy","coarse","cold","cold-hearted","collapse","confused","contradictory","contrary","corrosive","corrupt","crazy","creepy","criminal","cruel","cry","cutting","dead","decaying","damage","damaging","dastardly","deplorable","depressed","deprived","deformed","deny","despicable","detrimental","dirty","disease","disgusting","disheveled","dishonest","dishonorable","dismal","distress","don't","dreadful","dreary","enraged","eroding","evil","fail","faulty","fear","feeble","fight","filthy","foul","frighten","frightful","gawky","ghastly","grave","greed","grim","grimace","gross","grotesque","gruesome","guilty","haggard","hard","hard-hearted","harmful","hate","hideous","homely","horrendous","horrible","hostile","hurt","hurtful","icky","ignore","ignorant","ill","immature","imperfect","impossible","inane","inelegant","infernal","injure","injurious","insane","insidious","insipid","jealous","junky","lose","lousy","lumpy","malicious","mean","menacing","messy","misshapen","missing","misunderstood","moan","moldy","monstrous","naive","nasty","naughty","negate","negative","never","no","nobody","nondescript","nonsense","not","noxious","objectionable","odious","offensive","old","oppressive","pain","perturb","pessimistic","petty","plain","poisonous","poor","prejudice","questionable","quirky","quit","reject","renege","repellant","reptilian","repulsive","repugnant","revenge","revolting","rocky","rotten","rude","ruthless","sad","savage","scare","scary","scream","severe","shoddy","shocking","sick","sickening","sinister","slimy","smelly","sobbing","sorry","spiteful","sticky","stinky","stormy","stressful","stuck","stupid","substandard","suspect","suspicious","tense","terrible","terrifying","threatening","ugly","undermine","unfair","unfavorable","unhappy","unhealthy","unjust","unlucky","unpleasant","upset","unsatisfactory","unsightly","untoward","unwanted","unwelcome","unwholesome","unwieldy","unwise","upset","vice","vicious","vile","villainous","vindictive","wary","weary","wicked","woeful","worthless","wound","yell","yucky","zero"
];

var positiveArray = [
"absolutely","adorable","accepted","acclaimed","accomplish","accomplishment","achievement","action","active","admire","adventure","affirmative","affluent","agree","agreeable","amazing","angelic","appealing","approve","aptitude","attractive","awesome","beaming","beautiful","believe","beneficial","bliss","bountiful","bounty","brave","bravo","brilliant","bubbly","calm","celebrated","certain","champ","champion","charming","cheery","choice","classic","classical","clean","commend","composed","congratulation","constant","cool","courageous","creative","cute","dazzling","delight","delightful","distinguished","divine","earnest","easy","ecstatic","effective","effervescent","efficient","effortless","electrifying","elegant","enchanting","encouraging","endorsed","energetic","energized","engaging","enthusiastic","essential","esteemed","ethical","excellent","exciting","exquisite","fabulous","fair","familiar","famous","fantastic","favorable","fetching","fine","fitting","flourishing","fortunate","free","fresh","friendly","fun","funny","generous","genius","genuine","giving","glamorous","glowing","good","gorgeous","graceful","great","green","grin","growing","handsome","happy","harmonious","healing","healthy","hearty","heavenly","honest","honorable","honored","hug","idea","ideal","imaginative","imagine","impressive","independent","innovate","innovative","instant","instantaneous","instinctive","intuitive","intellectual","intelligent","inventive","jovial","joy","jubilant","keen","kind","knowing","knowledgeable","laugh","legendary","light","learned","lively","lovely","lucid","lucky","luminous","marvelous","masterful","meaningful","merit","meritorious","miraculous","motivating","moving","natural","nice","novel","now","nurturing","nutritious","okay","one","one-hundred percent","open","optimistic","paradise","perfect","phenomenal","pleasurable","plentiful","pleasant","poised","polished","popular","positive","powerful","prepared","pretty","principled","productive","progress","prominent","protected","proud","quality","quick","quiet","ready","reassuring","refined","refreshing","rejoice","reliable","remarkable","resounding","respected","restored","reward","rewarding","right","robust","safe","satisfactory","secure","seemly","simple","skilled","skillful","smile","soulful","sparkling","special","spirited","spiritual","stirring","stupendous","stunning","success","successful","sunny","super","superb","supporting","surprising","terrific","thorough","thrilling","thriving","tops","tranquil","transforming","transformative","trusting","truthful","unreal","unwavering","up","upbeat","upright","upstanding","valued","vibrant","victorious","victory","vigorous","virtuous","vital","vivacious","wealthy","welcome","well","whole","wholesome","willing","wonderful","wondrous","worthy","wow","yes","yummy","zeal","zealous"
];

Meteor.methods({
    processPhrase: function (params) {
        wordsArray = [];
        if (hasWhiteSpace(params.phrase) > 0) {
            wordsArray = params.phrase.split(" ");
        } else {
            wordsArray.push(params.phrase);
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
});

myfeedExport = function (percent) {

    if (percent >= 33) {
        status = "OK";
    } else {
        status = "DOWN";
    }

    var obj = {
      'pingdom_http_custom_check': {
        status: status,
        response_time: percent,
      }
    };

    var feed = XmlBuilder.create(obj) //sets up the "parent" xml object

    return feed.end({pretty: true})
}