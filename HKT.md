## Inspiration
While participating in the crypto transaction process, we observed certain inconveniences such as the need for numerous operations, installing multiple applications, the inability to leverage our existing accounts in web 2, and particularly, dependence on and connectivity to the internet. These issues create barriers in the user experience. We built OneMes to address these problems.

## What it does
The main features of OneMes include:

- **Cross-chain AA wallet**: This is an MVP version that allows users to create an account with their web2 account information.
- **Enables sending and receiving tokens** within the same chain or across different chains.
- Allows managing **multiple AA contracts** on various chains.
- Integrated with ChainLink CCIP.
- **Token transfer with SMS**: Users can use SMS to transfer tokens without needing the internet.
- **Token transfer with Telegram bot**: Users can interact with the OneMes Bot to transfer tokens.
Reuse social accounts, personal information like phone numbers, and email in the token transfer process.

## How we built it
We built OneMes based on the following steps:

- Identify real-world problems and their solutions.
- Explore Chainlink technology and apply it to the identified problem.
- Construct the architecture and workflow of the system.
- Develop smart contracts, test them.
- Build the backend and frontend for the application.
- Develop additional components like cron-job, notification system.
- Perform integration testing.
- Identify lingering issues and enhance the application.


**Technologies:**
- **Chainlink automation:** we have built custom logic upkeeps (run on Fuji, Sepolia, and Mumbai) to handle all pending token transfer requests using cross contract calls to user’s AA contracts.
- **Chainlink CCIP:** it has been integrated into users’ AA contract for cross-chain transfer purposes.
- **Chainlink functions:** it is used to POST data to an API when transactions are complete. This API will update offchain database, send SMS messages, and reply to senders using Telegram chatbot.
- **Other technologies:** Twilio API, Telegram chatbot API, Alchemy API, Snowtrace API, Mumbai explorer API, Ethereum explorer API, wgami, OpenZeppelin, Hardhat, EthersJS, Ant Design, and so on.

## Challenges we ran into

- **Challenge 01:** Testing smart contracts when integrating Chainlink technology. Due to its nature, the traditional unit test approach is not feasible; instead, we have to use hardhat tasks for deployment and error checking. We invested a significant amount of time in this phase.

- **Challenge 02:** Identifying and managing errors. As OneMes incorporates many components from backend to frontend tightly integrated with various technologies, errors are inevitable. We have constructed a logging system to monitor and trace errors, ensuring that the system remains operational when errors occur.

- **Challenge 03:** Security and user account verification during OneMes account registration. This is a complex issue that we have not fully addressed during the hackathon due to its broad and intricate nature. Currently, user information in smart contracts is kept private, and messages used for token transfers undergo thorough validation regarding format and recipient details. However, there is still room for improvement.

- **Challenge 04:** Optimizing system maintenance costs, including expenses for Chainlink services and regular web2 services. Currently, users can test without any fees, but in the future, additional charges may be applied, especially for SMS services.


## Accomplishments that we're proud of

Despite facing challenges initially, over the course of the hackathon, we have achieved specific outcomes:

- Successfully built a practical system addressing real-world problems.
- **Default support for Avalanche Fuji**, and users can easily expand their accounts to Ethereum Sepolia and Polygon Mumbai.
- Implemented advanced Chainlink technologies into the product.
- Enhanced the user experience in the crypto space.


## What we learned

The **most valuable** lesson we learned in this hackathon is **the immense potential of new technologies** in the blockchain world. These technologies address challenging issues such as automation, integrating web 2 services into web 3, or facilitating cross-chain token transfers without the need for complex swapping tools.

Following that is **time management**, enabling our team to accomplish a substantial amount of work, including coding, within the limited timeframe. It has provided us with a deeper understanding of the **core value of the developing product**.


## What's next for ONE MES


We plan to focus on three main areas.

**Transfer tokens using the following tools:**

- Discord bot
- Twitter bot
- Facebook Messenger
- Snapchat

**Extend features to all chains supported by Chainlink:**

- Base
- Optimism
- BNB chain

**Build a fully functional cross-chain AA wallet.**

