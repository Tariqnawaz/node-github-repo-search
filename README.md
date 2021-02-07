# About The Project
![search](https://user-images.githubusercontent.com/31206475/107151133-6ff22980-697a-11eb-9821-03132d7316cf.png)

**Project Stack**
1. Node js
2. TypeScript
3. ExpressJs
4. REDIS

**Summary**
* Get github repository by users or repositories.
* ExpressJS handles incomming request and makes a github api call.
* Using github `https://api.github.com/search/` api for searching `Users & Repositories`
* Storing the reponse data in `redis cache for 2 hours`. If data exist in cache return the cache data as a response.
* A seperate call for clearing the cache data from redis (will remove all cache data).


# Getting Started

1. Prerequisites (local machine)  
* install `Node.js`
* install `Redis`

2. Installation
* `git clone https://github.com/Tariqnawaz/node-github-repo-search.git`
* inside root folder `npm install`
* Create `token` from github `Personal access tokens`[https://github.com/settings/tokens] 
  and enter in search.ts i.e (gitToken = 'your token').
* `npm run start:dev` runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000)

# Usage
<!-- 
![search1](https://user-images.githubusercontent.com/31206475/107150551-bf832600-6977-11eb-979b-15c019c7c856.png)
![search2](https://user-images.githubusercontent.com/31206475/107150554-c316ad00-6977-11eb-91f8-ce62d40c71dc.png) 
  -->


