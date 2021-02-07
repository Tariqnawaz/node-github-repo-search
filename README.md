## Frontend project
For frontend side code visit to [https://github.com/Tariqnawaz/react-github-repo-search.git](https://github.com/Tariqnawaz/react-github-repo-search.git)

# About The Project
![search](https://user-images.githubusercontent.com/31206475/107151133-6ff22980-697a-11eb-9821-03132d7316cf.png)

**Project Stack**
1. Node js
2. TypeScript
3. ExpressJs
4. REDIS

**Description**
* Get github repository by users or repositories.
* ExpressJS handles incomming request and makes a github api call.
* Using github `https://api.github.com/search/` api for searching `Users & Repositories`
* Storing the reponse data in `redis cache for 2 hours`. If data exist in cache return the cache data as a response.
* A seperate call for clearing the cache data from redis (will remove all cache data).


# Getting Started

1. Prerequisites (local machine)  
* install `Node.js`
* install `Redis`

2. Installation*
* `git clone https://github.com/Tariqnawaz/node-github-repo-search.git`
* inside root folder `npm install`
* Create `token` from github [Personal access tokens](https://github.com/settings/tokens) .
  and enter in search.ts i.e (gitToken = 'your token').
* `npm run start:dev` runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000)

# Usage
**Swagger**

* open [http://localhost:3000/swagger/](http://localhost:3000/swagger/)

![swagger](https://user-images.githubusercontent.com/31206475/107152000-0fb1b680-697f-11eb-89f7-07caaba4319b.png)
![get-req](https://user-images.githubusercontent.com/31206475/107151999-0f192000-697f-11eb-8a42-d2b1a7e54034.png)
![post-req](https://user-images.githubusercontent.com/31206475/107151996-0e808980-697f-11eb-877b-4a6b9561405e.png)



