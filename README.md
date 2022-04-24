# Simple Stocks

![License badge](https://img.shields.io/badge/license-MIT-green)

![Screenshot](/readme/screen1.png)

## Description

Update 4-24-22: New version released! The UI reflects minor styling changes. There are significant code changes behind the scenes.

Simple Stocks is an easy way to manage your stock portfolio! Unlike other apps, this app only provides you with basic information. You input only the stock symbol and the number of shares you own. The app takes care of the rest.

After setting up your portfolio, you get a quick snapshot of the value of each holding and a total portfolio value. This app was created for the trader who has a conservative, long-term outlook - it is not for day traders!

A beta version of the app is now live.

## Technology

Simple Stocks uses Web Components to create a full-stack single page application (SPA). I modeled the structure of the app after the architecture of a typical React.js app.

The app uses the Finnhub.io API to pull current stock data. MongoDB Atlas is used to store data. The backend is a REST API that runs on a Node.js Express server. The app uses JSON Web Tokens for security. I wrote API routes and custom middleware to issue tokens upon authorization and to authenticate API requests. I built this app primarily to practice with web components and to learn about how they can be used instead of a framework such as React. I later incorporated JWT's to practice securing API routes. It was a lot of fun! The API is hosted on Heroku, and the frontend is on my [personal domain](https://samgates.io/projects/simple-stocks/).

Simple Stocks is based on my previous project that I, very creatively, named [Web Components - Stock Market App](https://github.com/sg0703/Web_Components).

## License

Copyright (c) Sam Gates. All rights reserved.
Licensed under the [MIT](https://opensource.org/licenses/MIT) license.

## Questions

Check out my [GitHub Profile](https://github.com/sg0703).

Email with questions! You can reach me at sam.j.gates@gmail.com.
