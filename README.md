# Mars Rovers Dashboard Project

This project is realized from scratch in order to develope it on Webpack.

## Table of Contents

* [Server](#server)
* [Client](#client)
* [Getting Started](#getting-started)


## Server <a name="server"></a>

The server is a simple express server that host the web app statically and also acts as middleware to the NASA API to not expose API_KEY.


## Client <a name="client"></a>

The client is composed of a Web App, created using Functional Programming paradigm.

The goal is to have only one entry point fr each UI page, the functions working as entry points are the follow:

`startApp` :  For the Rovers Page
`roverClick` : For the Rove Detail page

Also following the immutable rules, there are also only 2 functions that changes the data:

`updateRovers` : For the Rovers Page
`updateRoverPhotos`: For the Rove Detail page

All other app logic follow a functional chain, each function call and uses the result of another function.


## Getting Started <a name="getting-started"></a>

First clone this github project: `git clone https://github.com/edrondsal/marsroverdashboard-project-nanodegree.git`

Install dependencies: `npm install`

Then run webpack to create the distribution files: `npm run build-dev`

Finally start the express server: `npm run start`

Now the web app is available in the localhost:  `localhost:3000`



