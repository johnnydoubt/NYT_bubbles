const API_KEY = '5oSAJ1ki5q1yORMut1lj9CrxCiwK3qCC';
const ns = 'http://www.w3.org/2000/svg'

// On crée la base SVG
var div = document.getElementById('svg-container')
var svg = document.createElementNS(ns, 'svg')
svg.setAttributeNS(null, 'width', '100vw')
svg.setAttributeNS(null, 'height', '80vh')
div.appendChild(svg)


// function de call

var callArchiveAPI = function (e) {
    e.preventDefault();

    let url = "https://api.nytimes.com/svc/archive/v1";
    let yearValue = document.forms["archiveForm"]["year"].value;
    let monthValue = document.forms["archiveForm"]["month"].value;

    if (!!yearValue) {
        url += "/" + yearValue
    }
    if (!!monthValue) {
        url += "/" + monthValue
    } else {
        url += "/1"
    }
    url += ".json"
    url += '?' + $.param({
        'api-key': API_KEY
    });
    $.ajax({
        url: url,
        method: 'GET',
    }).done(function (result) {
        console.log(result);
        treatData(result.response.docs)
    }).fail(function (err) {
        throw err;
    });
}

// traitement des données renvoyées

var treatData = function (docArray) {
    let size = document.forms["archiveForm"]["size"].value || 20;
    console.log(size);

    /* Below is a regular expression that finds alphanumeric characters
       Next is a string that could easily be replaced with a reference to a form control
       Lastly, we have an array that will hold any words matching our pattern */
    var pattern = /(?!of|if|the|a|as|has|no|for|his|her|with|says|have\b)\b[a-zA-Z]{5,}/gi,
        headlineString = " ";

    docArray.forEach(function (article) {
        headlineString += article.headline.main.toUpperCase()
    })

    matchedWords = headlineString.match(pattern);
      console.log(matchedWords);


    /* The Array.prototype.reduce method assists us in producing a single value from an
       array. In this case, we're going to use it to output an object with results. */
    var counts = matchedWords.reduce(function (stats, word) {

        /* `stats` is the object that we'll be building up over time.
           `word` is each individual entry in the `matchedWords` array */
        if (stats.hasOwnProperty(word)) {
            /* `stats` already has an entry for the current `word`.
               As a result, let's increment the count for that `word`. */
            stats[word] = stats[word] + 1;
        } else {
            /* `stats` does not yet have an entry for the current `word`.
               As a result, let's add a new entry, and set count to 1. */
            stats[word] = 1;
        }

        /* Because we are building up `stats` over numerous iterations,
           we need to return it for the next pass to modify it. */
        return stats;

    }, {});
    console.log(counts)
    countSorted = Object.keys(counts).sort(function (a, b) {
        return counts[b] - counts[a]
    }).slice(0, size)
    /* Now that `counts` has our object, we can log it. */
    console.log(countSorted);

    $('body').append('<ul><li>' + countSorted + '</li></ul>')


    // Création des éléments SVG
    countSorted.forEach(function (entry) {
        console.log(entry, counts[entry])
        var g = document.createElementNS(ns, 'g')
        g.setAttributeNS(null, 'fill', 'transparent')
        g.setAttributeNS(null, 'stroke', 'red')
        var rect = document.createElementNS(ns, 'rect')
        rect.setAttributeNS(null, 'width', counts[entry]*2)
        rect.setAttributeNS(null, 'height', counts[entry])
        rect.setAttributeNS(null, 'x', Math.floor(Math.random() * 901))
        rect.setAttributeNS(null, 'y', Math.floor(Math.random() * 901))
        rect.setAttributeNS(null, 'rx', '20px')
        rect.setAttributeNS(null, 'ry', '20px')
        var text = document.createElementNS(ns, 'text')
        text.setAttributeNS(null, 'font-family', 'Verdana')
        text.setAttributeNS(null, 'font-size', counts[entry] / 8 + 'px')
        text.setAttributeNS(null, 'x', rect.getAttributeNS(null, 'x'))
        text.setAttributeNS(null, 'y', rect.getAttributeNS(null, 'y'))
        text.setAttribute('style', "transform:translate("+counts[entry] +"px,"+counts[entry]/2+"px)")

        var textNode = document.createTextNode(entry)
        text.appendChild(textNode)
        g.appendChild(rect)
        g.appendChild(text)
        svg.appendChild(g)
    })
}