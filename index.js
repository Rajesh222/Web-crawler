const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
function loadCrawler(url, maxDepth) {

    console.log('url ', process.argv[2])
    console.log('maxDepth ', process.argv[3])
    crawler(url, 0, Number(maxDepth));
}

function crawler(url, depth, maxDepth) {
    const result = []
    if (depth === maxDepth) {
        return;
    }

    request(url, (error, response, html) => {

        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            $('img').each((i, a) => {
                imgMetaData = {
                    imageUrl: $(a).attr('src'),
                    sourceUrl: url,
                    depth: depth
                }

                result.push(imgMetaData)
                console.log('imgMetaData: ', result)

            });

            $('a').each((i, link) => {
                const href = $(link).attr('href')
                if (isValidLink(href)) {

                    crawler(href, depth + 1, maxDepth)
                }

            })
        }
        fs.appendFileSync("result.json", JSON.stringify(result));

    });

}

function isValidLink(link) {
    const linkRegex = /^(http|https):\/\/[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})?(:[0-9]{1,5})?(\/.*)?$/i;
    return linkRegex.test(link);
}

loadCrawler(process.argv[2], process.argv[3])



