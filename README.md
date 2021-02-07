# About The Project

**Project Stack**
1. Node js
2. TypeScript
3. ExpressJs
4. REDIS

* Get github repository by users or repositories.
* ExpressJS handles incomming request and makes a github api call.
* Using github `https://api.github.com/search/` api for searching `Users & Repositories`
* Storing the reponse data in `redis cache for 2 hours`. If data exist in cache return the cache data as a response.
* A seperate call for clearing the cache data from redis (will remove all cache data).


# Getting Started
1. Prerequisites  
2. Installation

