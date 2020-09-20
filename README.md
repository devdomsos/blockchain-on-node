# Project Title

AutoBahnBlockchain on node. 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

In order to run this project, clone the repository. 

Make sure you have npm or yarn available on your machine. 

Make sure you have MongoDB running on your machine and mongoDB Compass Client. 


### Installing

Install the required dependencies.

First step:

```
run npm i
```

Once dependencies are installed. Connect to MongoDB (https://www.mongodb.com/try/download/community). 

Create a .env file in the root folder with the following information: 

BLOCK_TIME=30000
MONGO_PATH='mongodb://localhost:27017/blockChain-node'
MONGODB_NAME='autoBahnBlockchainDB'

## Deployment

Run the build scripts: 

```
npm run build
```
After compliation to TypeScript run the start scripts which should be reading from dist/ folder 

```
npm run start
```
## Authors

* **Dominik Sosnowski** - *Initial work* - [devdomsos](https://github.com/devdomsos)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


