const request = require('request');
const cheerio = require('cheerio');
const log = require('loglevel');
const mailer = require('./mailer');
const transporter = mailer.transporter;
const { user } = require('./config');
const fs = require('fs');
const { options: Options } = mailer;
const url = 'http://www.megabox.co.kr/pages/store/Store_MenuList.jsp';

log.setLevel('trace', true);

let itemNameArray = [];
let time = 0;
let isFirst = true;

const checkMegaChance = () => {
  request(url, (err, res, body) => {
    if (err) console.log(err);
    const $ = cheerio.load(body);
    const megaChanceTab = $('#storeTeb_03');
    const megaChanceList = megaChanceTab.next().find('li');
    const ticketRemains = megaChanceList.find('div').find('.price').find('p').find('b');
    let megaChangeOnePlusItems = megaChanceList.find('div').find('h5');
    let newItemNameArray = [];
    let itemArray = [];

    ticketRemains.each(function () {
      let ticket = {
        remain: 0,
        name: '',
      };
      ticket.remain = $(this).text();
      itemArray.push(ticket);
    });

    megaChangeOnePlusItems.each(function (i, el) {
      let itemName = '';
      el.children.forEach((node) => {
        if (node.type === 'text') {
          itemName += node.data
        }
        else {
          itemName += node.name;
        }
      });
      itemArray[i].name = itemName;
      newItemNameArray[i] = itemName;
    });

		console.log('item array:', itemArray.map(item => `${item.name}: ${item.remain}`).join(' //  '));
		console.log('Date:', new Date());

		for (let i = 0; i < newItemNameArray.length; i++) {
			if (!(itemNameArray.includes(newItemNameArray[i]))) {
				itemNameArray = newItemNameArray.slice(0);
				let option = new Options();
				option.html = makeHtml(itemArray);
				option.to = user.to;
				if (!isFirst) {
					transporter.sendMail(option, (err) => {
						if (err) {
							console.log(err);
						}
						console.log('send mail');
						return null;
					});
				} else {
					isFirst = false;
					}
				break;
      }
    }
  });
};

function makeHtml (itemArray) {
  let html = '';

  itemArray.forEach((item) => {
    let name = item.name;
    let remain = item.remain;
    let text = `영화 <strong style="color: #48adf3; font-size: 20px">${name}
            </strong>는 <strong style="color: #48adf3; font-size: 20px">${remain}</strong>
            개 남음`;
    html += makePtag(text);
  });

  function makePtag (text) {
    return `<p style="font-size: 16px; margin: 0 0 10px">
              <a href="http://www.megabox.co.kr/?menuId=store" style="text-decoration: none; color: black;">
              ${text} (click) 
              </a>
            </p>`;
  }
  return html;
}

const mm = (new Date()).getMinutes();
const minute = mm > 30 ? (60 - mm) : (30 - mm);
const intervalMinute = 10;

setTimeout(() => {
	checkMegaChance();
	setInterval(() => {
		checkMegaChance();
	}, 1000 * 60 * intervalMinute);
}, 1000 * 60 * minute);
