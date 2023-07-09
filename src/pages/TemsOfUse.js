import { Lightning, Utils, Router } from "@lightningjs/sdk";

const Terms = [
  `TERMS OF USE`,
  `\n\n© 2021 tmdb Pictures Networks India Private Limited. All rights reserved.`,
  `\n\n\ntmdbLiv Offers`,
  `\n\nMyntra Offer:`,
  `\n\nFlat 10% up to Rs.999/- off on min spend of Rs. 999/- on select styles on Myntra on purchasing tmdbLIV Annual subscription.`,
  `\n\n\nTerms and Conditions:`,
  `\n\n1.  Get Flat 10% up to Rs.999/- off on min spend of Rs 999- on the Myntra app or website on purchasing tmdbLIV annual subscription`,
  `\n\n2.  The Offer is valid from 31st May 2021 to 31st Dec 2021`,
  `\n\n1.  On viewing the Offer as promoted by Mytra, any customer wanting to avail the Offer is required to visit the tmdbLIV app`,
  `\n\n2.  Customer should then subscribe to the tmdbLIV annual package and maky payments towards the same `,
  `\n\n3.  While subscribing to tmdbLIV annual subscription the customer is required to enter the code "MYNTRA", which will  enable the customer to receive a Myntra digital coupon code ("Code")`,
  `\n\n4.  The customer can then redeem the Code on minimum spend of Rs. 999/- on selected style on Myntra`,
  `\n\nOther Terms`,
  `\n\n1.	The Code can be used once per customer and multiple codes cannot be clubbed in a single order`,
  `\n\n2.	This Offer is not valid at any of the alliance partner retail outlets/stores`,
  `\n\n3.	The balance amount, after the discount is availed, will have to be paid by the customer at the time of purchase on Myntra`,
  `\n\n4.	In no case, whatsoever, can the Code amount be refunded, encashed or partly encashed`,
  `\n\n5.	Myntra's Return and Exchange Policy offers you the option to return or exchange items purchased on Myntra's application within 30 days of the receipt. In case of return of the purchased item, please refer to the "Return Policy" on the website/ app or call Myntra Customer care`,
  `\n\n6.	All orders would be subject to availability at the time of purchase and will be governed by the standard terms and conditions listed on the Myntra App`,
  `\n\n7.	All disputes arising out of or in connection to this Offer are subject to exclusive jurisdiction of the courts in Bangalore only`,
  `\n\n8.	Disclaimers: tmdb Pictures Networks India Pvt. Ltd. ("SPNI") is not responsible for any dispute and/or claims by any customer in relation to this Offer`,
  `\n\n9.	Myntra and/or SPNI is not responsible for any typographical error leading to the code being invalid`,
  `\n\n10.	Please contact Myntra's customer care - 08061561999 for any queries in relation to this Offer`,
];

export default class TermsOfUse extends Lightning.Component {
  static getFonts() {
    return [
      { family: "Regular", url: Utils.asset("fonts/Roboto-Regular.ttf") },
    ];
  }

  static _template() {
    return {
      Background: {
        x: 560,
        w: 1300,
        h: 1100,
        rect: false,
        color: 0xff404249,
      },
      TermsOfUSe: {
        y: 35,
        x: 560,
        TermsTitle: {
          w: 1250,
          text: {
            text: Terms[0],
            textAlign: "center",
            fontStyle: "bold",
            fontSize: 40,
          },
        },
        text: {
          text:
            Terms[1] +
            Terms[2] +
            Terms[3] +
            Terms[4] +
            Terms[5] +
            Terms[6] +
            Terms[7] +
            Terms[8] +
            Terms[9] +
            Terms[10] +
            Terms[11] +
            Terms[12] +
            Terms[13] +
            Terms[14] +
            Terms[15] +
            Terms[16] +
            Terms[17] +
            Terms[18] +
            Terms[19] +
            Terms[20] +
            Terms[21] +
            Terms[22],

          wordWrapWidth: 1250,
          fontSize: 32,
        },
      },
    };
  }

  _focus() {
    this.tag("Background").rect = true;
    this.tag("Background").patch({
      smooth: { scale: 1.1 },
    });
  }

  _unfocus() {
    this.tag("Background").rect = false;

    this.tag("Background").patch({
      smooth: { scale: 1 },
    });
  }
  _handleDown() {
    console.log(this.tag("TermsOfUSe").y);
    if (this.tag("TermsOfUSe").y > -1050) {
      this.tag("TermsOfUSe").y -= 35;
    }
  }
  _handleUp() {
    if (this.tag("TermsOfUSe").y < 35) {
      this.tag("TermsOfUSe").y += 35;
    }
  }
}
