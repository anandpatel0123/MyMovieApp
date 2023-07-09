import { Lightning, Utils, Router } from "@lightningjs/sdk";

const privacy = [
  `PRIVACY POLICY`,
  `© 2021 tmdb Pictures Networks India Private Limited. All rights reserved.`,
  `1. Application`,
  `This Privacy Policy is applicable to personally identifiable information collected, processed, stored and used in connection with http://www.tmdbliv.com or via an dedicated application of the said URL accessible on Users’ mobile phones / tablets / other devices connected to the internet ("Site") operated by tmdb Pictures Networks India Private Limited ("SPN"/ "we"/ "us"/ "our") having its office at Interface Building 7, 4th Floor, Off Malad Link Road, Malad (West), Mumbai – 400064, India. This policy is in addition to the Privacy Policy incorporated otherwise on the URL.`,
  `2. Services`,
  `To facilitate your viewership and access of the content on the Site, the content may have been packaged by SPN differently, wherein the Content or Services may be accessible free of charge which may include advertisements or commercials or via a subscription model or a pay-per-view model with or without advertisements / commercials or with a combination of the foregoing.`,
  `3. Types of Information collected`,
  `3.1 Information You Provide`,
  `In order to use the Site and the services offered, Users ("User" / "You") must create an account with SPN ("SPN Account"). Creating the SPN Account may require the User to provide inter alia the following personal information associated with the User, including but not limited to his / her name; gender; residential address, including city / state / province (if applicable), postal code, country, and region; phone and mobile number, e-mail address; preferred language; and login name and password ("Personal Information").`,
  `3.2 Automatic Information Collection`,
  `3.2.1 SPN may use a variety of technologies that automatically or passively collect information about how the Site is accessed and used ("Usage Information"). Usage Information may consist inter alia of the following data about your visit to the Site: content viewed, date and time of view, content listed on watch-later-list; followed content; favoured content; access type depending on the model of services described hereinabove, number of website hits, type of computer operating system including the type of internet browser and internet service provider. Usage Information is generally non-identifying in nature, but SPN may associate the same with other information collected and hence treats it as Personal Information.
    3.2.2 SPN also may automatically collect your IP address or other unique identifier for the computer, mobile device, technology or other device (collectively, "Device") which you use to access the Site. A unique identifier is a number that is automatically assigned to your Device when you access a web site or its servers, and our computers identify your Device by this number ("Device Identifier"). Some mobile service providers may also provide us with the physical location of the Device used to access the Site.`,
  `3.3 Cookies and Web Beacons`,
  `
	
	3.3.1 By using the Site, you consent to our cookies, which are basically files that web servers place on your Device. The use of cookies on the Site allows you to enjoy more seamless visits to the Site and more accurately measures your behavior on it. There are two types of cookies that we may use: session and persistent. Session cookies exist only during an online session and are removed from your Device when you close the browser software. Persistent cookies remain on your Device after the browser has been closed. While the cookies used on the Site do not identify you personally, they recognize your browser, unless you choose to identify yourself voluntarily. You may choose to identify yourself for any one of the following reasons: by asking the browser to remember your username and password, or by requesting more information on any content or service available on the Site. You may prevent the installation of cookies through your browser settings; in which case not all functionalities of the Site may be available to you depending on the browser settings. You may also configure your browser to accept all cookies, reject all cookies, or notify you when a cookie is set. SPN requests you to check your browser and/or contact the administrators to learn how to change your cookie preferences.`,
  `
	
	3.3.2 SPN may also use Web Beacons in combination with cookies to understand how you interact with Site. Web Beacons are typically transparent graphic images that are placed on the Site or in an email and allows the Site to measure your actions in opening the page that contains the Web Beacon.`,
  `
	
	3.3.3 SPN may also use other asynchronous methods and / or technology in combination with / without other tracking technologies to understand a User’s interaction with Site and content residing therein. `,
  `
	
	3.3.4 This Site may also use a web analytics service provider who may use an Analytics Tool. Analytics Tools use cookies, text files, SDKs, APIs that are stored on your Device and allow an analysis of your use of the Site. The information generated by the cookie about your use of the Site, including the IP address, may be transferred to and stored on a server of analytics service provider, `,
  `which may not be located within India and who may use such information, to analyze your use of the Site, to create reports about the web site activities and to provide further services associated with the use of the Site. Furthermore, it may transfer such information to third parties, to the extent legally required or if such third parties process the data on behalf of the service provider. By using the Site, you consent to such transfer of Personal Information including storage on servers not located within India.`,
  `4. Purpose of collection and usage of personal information`,
  `
	
	4.1 SPN may use the Personal Information collected for the following purposes, amongst others: `,
  `
	
	(1) process your registration;`,
  `
	
	(2) enable you to visit the Site and enjoy more seamless visits to the Site;`,
  `
	(3) enable you to use and receive the services offered on the Site, including e-mail communications informing you about the services and content provided by SPN through the Site; `,
  `
	
	(4) contact you with regard to your SPN Account and in connection with any services or content subscribed through the Site;`,
  `
	
	(5) tailor content and offers to you according to your preferences relating to business interests;`,
  `
	
	(6) improve and enhance the Site according to your preferences relating to business interests and relating to website usage; and `,
  `
	
	(7) other purposes specifically disclosed to you prior to the collection of your Personal Information or otherwise with your consent. Subject to your consent, we may provide you with marketing materials about other services and content offered by SPN on the Site and may share your Personal Information with our affiliated companies only for marketing purposes.`,
  `

	4.2 In particular, SPN may use tracking methods, mentioned hereinabove, for a number of purposes, including but not limited to:`,
  `
	
	4.2.1 provide general internal and customer analytics;`,
  `
	
	4.2.2 study traffic patterns in order to improve website performance, to customize the user experience, and to better match the users' interests and preferences;`,
  `
	
	4.2.3 keep track of preferences you specify while you are using SPN’s content or services;`,
  `
	
	4.2.4 recommendations of content to the user, based on usage;`,
  `
	
	4.2.5 support security measures, such as requiring re-login into the Site after a certain amount of time has elapsed;`,
  `
	
	4.2.6 when you login to the Site, cookies can also be used to save the username so that we can process the saved login information and quickly log you into the Site;`,
  `
	
	4.2.7 assist in identifying possible fraudulent activities;`,
  `
	
	4.2.8 ensure if an email has been opened and acted upon.`,
];
export default class PrivacyPolicy extends Lightning.Component {
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

      PrivacyPolicy: {
        y: 35,
        x: 560,
        PolicyTitle: {
          w: 1250,
          text: {
            text: privacy[0],
            textAlign: "center",
            fontStyle: "bold",
            fontSize: 40,
          },
        },
        text: {
          text:
            "\n\n\n" +
            privacy[1] +
            "\n\n" +
            privacy[2] +
            "\n\n" +
            privacy[3] +
            "\n\n" +
            privacy[4] +
            "\n\n" +
            privacy[5] +
            "\n\n" +
            privacy[6] +
            "\n\n    " +
            privacy[7] +
            "\n\n" +
            privacy[8] +
            "\n\n" +
            privacy[9] +
            "\n\n" +
            privacy[10] +
            "\n\n" +
            privacy[11] +
            +"\n\n\n" +
            privacy[12] +
            privacy[13] +
            privacy[14] +
            privacy[15] +
            privacy[16] +
            privacy[17] +
            privacy[18] +
            privacy[19] +
            privacy[20] +
            privacy[21] +
            privacy[22] +
            privacy[23] +
            privacy[24] +
            privacy[25] +
            privacy[26] +
            privacy[27] +
            privacy[28] +
            privacy[29] +
            privacy[30] +
            privacy[31] +
            privacy[32] +
            privacy[33] +
            privacy[34],

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
    console.log(this.tag("PrivacyPolicy").y);
    if (this.tag("PrivacyPolicy").y > -3535) {
      this.tag("PrivacyPolicy").y -= 35;
    }
  }
  _handleUp() {
    if (this.tag("PrivacyPolicy").y < 35) {
      this.tag("PrivacyPolicy").y += 35;
    }
  }
}
