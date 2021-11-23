/**
 * 
 {
  "eventType": "Participant.Joined",
  "thirdPartyId": "example_thirdpartyId",
  "conference": {
    "confId": "conferenceId_UUID",
    "confAlias": "example_conference_alias"
  },

  "region": "eu",
  "participant": {
    "userId": "userId_UUID"
    "externalId": "example_externalId",
    "externalName": "example_externalName",
    "externalPhotoUrl": "example_externalPhotoUrl"
  }
}
 */

// const querystring = require("querystring");
// const fetch = require("node-fetch");
import { fetch } from 'node-fetch';

//  Our FAS
exports.handler = async (event, context) => {

  // Dolby.io logo image
  const logoImage = "https://avatars.slack-edge.com/2021-07-28/2316131338342_1f6488351e04582ba704_512.jpg"


  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // When the method is POST, the name will no longer be in the event’s
  // queryStringParameters – it’ll be in the event body encoded as a queryString
  const jsonPayload = parse(event.body);
  const eventType = jsonPayload.eventType;
  const conference = jsonPayload.conference;
  const participant = jsonPayload.participant;
  let text = "Houston we have a problem..." // default error

  let announcement = `*${conference.confAlias} conference*`
  let message = '';
  let includeParticipantInfo = (eventType == 'Participant.Joined' || eventType == 'Participant.Joined') ? true : false;

  switch (eventType) {
    case 'Conference.Created':
      text = `${announcement} has been created.`
      break;
    case 'Conference.Ended':
      text = `${announcement} has ended.`
      break;
    case 'Participant.Joined':
      text = `${announcement} has a new particpant.`
      message = `${participant.externalName} has joined the  conference.`;
      imageURL = participant.externalPhotoUrl;
      break;
    case 'Participant.Left':
      text = `A particpant has left ${announcement}`
      message = `${participant.externalName} has left the conference.`;
      imageURL = participant.externalPhotoUrl;
      break;
    default:
      break;
  }

  /**
   * Format output for Slask Block Kit 
   * https://app.slack.com/block-kit-builder/ 
   *  We'll create a header and conditional participant info 
   *  blocks of info and store as arrays.
   */

  // message header
  let headerBlock = [{
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": announcement
    },
    "accessory": {
      "type": "image",
      "image_url": logoImage,
      "alt_text": "Dolby.io"
    }
  }]

  // conditional participant info
  let participantInfoBlock = [{
    "type": "divider"
  },
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": message
    },
    "accessory": {
      "type": "image",
      "image_url": participant.externalPhotoUrl,
      "alt_text": `${participant.externalName}'s Avatar`
    }
  },
  {
    "type": "divider"
  }];

/**
 *  Conditionally include the participant info
 */

  let slackBlocks = (includeParticipantInfo) ? headerBlock.concat(participantInfoBlock) : headerBlock;
  
  // Final composed slack formatted block message
  let slackBlockMessage = {
    "blocks": slackBlocks
  };


  // Send slackBlockMessage to Slack
  return fetch(process.env.SLACK_WEBHOOK_URL, {
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(slackBlockMessage),
  })
    .then(() => ({
      statusCode: 200,
      body: `${announcement} message has been sent to Slack 👋`,
    }))
    .catch((error) => ({
      statusCode: 422,
      body: `Oops! Something went wrong. ${error}`,
    }));
};
