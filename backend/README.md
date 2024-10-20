# Local server for the AI service for the app
---
## Global Configs

1. Find the global (as for the scope of this part) configs in the `global.js` file located in this directory.
   By default the server runs on `localhost:3000`

2. You will also need to create a `.env` file in this directory with 
    ```
    OPENAI_API_KEY = <project key here, ask @Flexksx to share it>
    ```
3. While in the root directory for the server, run `npm install` to install all dependencies
4. To launch the server, run `node index.js`
5. You can make requests via the API using Postman or similar tools. This part was done mainly to serve for the UI of the project
## Methods
--- 
### Campaigns
#### Initialize new Campaign conversation
* URL: `/campaign`
* Method: `POST`
* Request Body: either of 
  * take the whole JSON of a campaign, get it by calling `https://my.extole.com/api/v2/campaigns/{campaign_id}/built`
  * if not provided that above, it will initialize a conversation reading the JSON file in `/res/testData.json`. So you can copy and paste a response from the call above for debugging. 
* Response
  * Success
    * Code `200` 
    * Content 
        ```json
        {
            "answer": <text, unformatted markdown>,
            "thread":{
                "id":<str>,
                "object":"thread",
                "created_ad":<epoch_time>,
                "metadata":<list>,
                "tool_resources:{...}
            }
        }
        ```
  * Error
    * Code `500`
    * Content
        Either `Error reading test data file` or `Error initializing campaign`. The last one means problems while requesting OpenAI APIs.


* URL: `/campaign/{campaign_id}`
---
#### Get conversations by thread ID
* URL: `/conversation/:threadId`
* Method: `GET`
* Response
  * Success 
    * Code `200`
    * Content
      ```json
      {
        "id":<thread_id>,
        "object":"thread",
        "created_at":<epoch_time>,
        "metadata": {},
        "tool_resources": {
            "code_interpreter": {
                "file_ids": []
            }
        }
      }
      ``` 
  * Error 
    * Code `400`
    * Content `threadId is required`
    OR 
    * Code `404`
    * Content `Thread not found`
    OR 
    * Code `500`
    * Content `Error getting thread` 
---
#### Get messages in a conversation
* URL: `/conversation/:threadId/messages`
* Method: `GET`
* Response
  * Success 
    * Code `200`
    * Content
      ```json
      [
        {
            "role":<"user" or "assistant">,
            "content": <unformatted markdown text>
        },
      ]
      ``` 
  * Error 
    * Code `400`
    * Content `threadId is required`
    OR 
    * Code `404`
    * Content `Thread not found`
    OR 
    * Code `500`
    * Content `Error getting thread messages` 
---
#### Add new message 
Will add a new message to the assistant and execute a run with it. 
Returns all messages in the thread as the `GET` method of this endpoint.
* URL: `/conversation/:threadId/messages`
* Method: `POST`
* Request Body
  * `{"message": <your message here>}`
* Response
  * Success 
    * Code `200`
    * Content
      ```json
      [
        {
            "role":<"user" or "assistant">,
            "content": <unformatted markdown text>
        },
      ]
      ``` 
  * Error 
    * Code `400`
    * Content `threadId is required`
    * Content `message is required in the request body`
    OR 
    * Code `404`
    * Content `Thread not found`
    OR 
    * Code `500`
    * Content `Error adding message to thread` 

# TODO
* `GET` method for uploaded campaigns. Current implementations requires you to keep track of the thread you created with a campaign, since we have no database yet. We could shorten evaluation times if we would have the controller descriptions and campaign summary already available.
