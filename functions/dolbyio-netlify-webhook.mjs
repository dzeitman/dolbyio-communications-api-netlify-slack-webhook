exports.handler = async (event, context) => {

  console.log(event);
  console.log(context);
  const axios = require('axios');

  // Dolby.io logo image
  const logoImage = "https://avatars.slack-edge.com/2021-07-28/2316131338342_1f6488351e04582ba704_512.jpg"


  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // When the method is POST, the name will no longer be in the event’s

  const jsonPayload = JSON.parse(event.body);
  const eventType = jsonPayload.eventType;
  const conference = jsonPayload.conference;
  const participant = (jsonPayload.participant != null) ? jsonPayload.participant : null;

  let text = "Houston we have a problem..." // default error

  let alias = (conference.confAlias != null) ? conference.confAlias : conference.confId;

  let announcement = `*${alias} conference*`;
  let message = '';

  let includeParticipantInfo = false;
  let hasParticpantInfo = (participant != null) ? true : false;

  // process conference
  switch (eventType) {
    case 'Conference.Created':
      text = `${announcement} has been created.`
      break;
    case 'Conference.Ended':
      text = `${announcement} has ended.`
      break;
    default:
      break;
  }

  includeParticipantInfo = (hasParticpantInfo && (eventType == 'Participant.Joined' || eventType == 'Participant.Joined')) ? true : false;
  let photo = (hasParticpantInfo && (participant.externalPhotoUrl != null)) ? participant.externalPhotoUrl : "https://cdn-icons-png.flaticon.com/512/3088/3088784.png"

  let extName = (hasParticpantInfo && (participant.externalName != null)) ? participant.externalName : "Anonymous";

  // process if there's a particpant object

  if (hasParticpantInfo) {
    switch (eventType) {
      case 'Participant.Joined':
        text = `${announcement} has a new particpant.`
        message = `${participant.externalName} has joined the  conference.`;
        imageURL = photo;
        break;
      case 'Participant.Left':
        text = `A particpant has left ${announcement}`
        message = `${participant.externalName} has left the conference.`;
        imageURL = photo;
        break;
      default:
        break;
    }
  }

  /**
   * Format output for Slask Block Kit 
   * https://app.slack.com/block-kit-builder/ 
   *  We'll create a header and conditional participant info 
   *  blocks of info and store as arrays.
   *
   */
  let state = (eventType == 'Participant.Joined') ? 'active' : "inactive"

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
      "image_url": photo,
      "alt_text": `${extName}'s Avatar`
    }
  },
  {
    "type": "divider"
  }];

  
  // link to our conference app
  
  let linkBlock = [{
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": `Conference is currently ${state}!`
    },
    "accessory": {
      "type": "button",
      "text": {
        "type": "plain_text",
        "text": "Join Conference",
        "emoji": true
      },
      "value": "click_me_123",
      "url": `https://meet.dolby.io/map-navigator-app/#/?cell=${alias}`,
      "action_id": "button-action"
    }
  }]
  
  
  /**
   *  Conditionally include the participant info and link block
   */

  let slackBlocks = (includeParticipantInfo) ? headerBlock.concat(participantInfoBlock,linkBlock) : headerBlock;
   

  // Final composed slack formatted block message
  let slackBlockMessage = {
    "blocks": slackBlocks
  };

// Post formatted block message to slack
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    data: JSON.stringify(slackBlockMessage),
    url: process.env.SLACK_WEBHOOK_URL,
  };

  axios(options)
    .then(() => ({
      statusCode: 200,
      body: `${announcement} message has been sent to Slack 👋`,
    }))
    .catch((error) => ({
      statusCode: 422,
      body: `Oops! Something went wrong. ${error}`,
    }));

};


/**
* example
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
