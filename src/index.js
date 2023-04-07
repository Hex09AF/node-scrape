const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const getPUrl = (pid) =>
  `https://www.amazon.com/gp/product/ajax/ref=dp_aod_unknown_mbc?asin=${pid}&m=&qid=1680878684&smid=&sourcecustomerorglistid=&sourcecustomerorglistitemid=&sr=8-1&pc=dp&experienceId=aodAjaxMain`;

async function getPrices(pid) {
  const pUrl = getPUrl(pid);
  const { data } = await axios.get(pUrl);

  const dom = new JSDOM(data);

  const $ = (selector) => dom.window.document.querySelector(selector);

  const title = $("#aod-asin-title-text").textContent.trim();

  const getOffer = (element) => {
    const price = element.querySelector(".a-price .a-offscreen").textContent;
    const offer_id = element
      .querySelector('input[name="offeringID.1"]')
      .getAttribute("value");
    const ships_from = element
      .querySelector("#aod-offer-shipsFrom .a-col-right .a-size-small")
      .textContent.trim();
    const sold_by = element
      .querySelector("#aod-offer-soldBy .a-col-right .a-size-small")
      .textContent.trim();
    const delivery_message = element
      .querySelector("#delivery-message")
      .textContent.trim();

    return {
      price,
      offer_id,
      ships_from,
      sold_by,
      delivery_message: delivery_message
        .replace(/\s+/g, " ")
        .replace("Details", "")
        .trim(),
    };
  };
  const pinnedElement = $("#pinned-de-id");
  const offerListElement = $("#aod-offer-list");

  const offerElements = offerListElement.querySelectorAll(
    ".aod-information-block"
  );

  const offers = [];
  offerElements.forEach((offerElement) => {
    offers.push(getOffer(offerElement));
  });

  const result = {
    product_id,
    title,
    pinned: getOffer(pinnedElement),
    offers,
  };
  console.log(result);
}

getPrices("B0B35DQNW1");
