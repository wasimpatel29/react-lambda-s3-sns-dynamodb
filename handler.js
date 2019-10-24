'use strict';

const AWS = require('aws-sdk');

module.exports.submitContactForm = async event => {
  console.log("Event:", event);

  const sns = new AWS.SNS();

  const messageData = JSON.parse(event.body);
  console.log("MessageData : ", messageData);

  let message = "Hello World!";
  let statusCode = 200;

  let response = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify({ message: "Hello, World"})
  };

  if(typeof messageData.name != 'string' || messageData.name.length === 0) {
    statusCode = 400;
    message = "Name is required";
  }
  if(typeof messageData.email != 'string' || messageData.email.length === 0) {
    statusCode = 400;
    message = "Email address is required";
  }
  if(typeof messageData.message != 'string' || messageData.name.message === 0) {
    statusCode = 400;
    message = "A message is required";
  }

  const snsMessage = {
    TopicArn: process.env.MYAPP_TOPIC_ARN,
    Subject: "Message from Myapp",
    Message: `
      Contact form message

      From: ${messageData.name} <${messageData.email}>
      Message:
        ${messageData.message}
    `
  };

  const result = await sns.publish(snsMessage).promise();
  console.log("Publish Result: ", result);

  response.statusCode = statusCode;
  response.body = JSON.stringify({message: message});

  console.log("RESPONSE", JSON.stringify(response));

  return response;
};

module.exports.saveContactMessage = async (event, context) => {
  console.log("****** SNS_Event ***** --", event);
  const dynamoDB = new AWS.DynamoDB();
  console.log("****** SNS_RECORDS ******* --", event.Records); 
  console.log("****** SNS_RECORDS[0] ***** --", event.Records[0]);
  const snsObject = event.Records[0].sns;
  console.log(" ******** SNS_Object_SNS ******* : ", snsObject);
  const dbItem = {
    TableName: process.env.MAYAPP_TABLE_NAME,
    Item: {
      'id': {S: "1as2erasf213"},
      'Message': {S: snsObject.Message},
      'Subject': {S: snsObject.Subject}
    }
  }

  console.log("SAVING:: ", dbItem);
  await dynamoDB.putItem(dbItem).promise();
  console.log("SAVED");
  return;
}