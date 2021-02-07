"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const redis_1 = __importDefault(require("../redis/redis"));
const axios_1 = __importDefault(require("axios"));
const router = express_1.default.Router();
router.use(express_1.default.urlencoded({ extended: true }));
router.use(express_1.default.json());
const users = 'users';
const repo = 'repositories';
const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.github.v3.raw',
    'Authorization': 'token 8b83507fd980f4086e2e0357b6c4473ed920a2f2'
};
/**
 * This method takes the request from the body & output the response
 * searchBy: dropdown value (users/repository)
 * searchInput: input (search value)
 * query: forms the query for input search based on searchBy
 * key: unique identifiers for storing the cache in redis (hashes).
 * client: redis client checks if data is present in cache & then returns the cache value (from else block).
 *         if data is not available then searching for the data & stores in redis cache (if block).
 */
const searchGithubRepos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let typeList = [];
        const { searchBy, searchInput } = req.body;
        if (searchBy === null || searchBy === '' || (searchBy !== users && searchBy !== repo) ||
            searchInput === null || searchInput === null || searchInput === '' || searchBy.length < 3) {
            return res.status(400).json(clientResponseMsg(400));
        }
        const query = searchBy === users ? `${searchInput} in:user&per_page=30` : `${searchInput}`;
        const key = searchBy + ':' + searchInput;
        yield redis_1.default.hgetall(key, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(500).json(clientResponseMsg(500));
            }
            ;
            if (data === null) {
                const storeDataToCache = yield search(searchBy, query); // search req for users / repositories
                if (storeDataToCache.length === 0) {
                    return res.status(404).json(clientResponseMsg(404));
                }
                for (const [k, v] of Object.entries(storeDataToCache)) {
                    if (parseInt(k) % 2 != 0) {
                        typeList.push(JSON.parse(v));
                    }
                }
                yield redis_1.default.hmset(key, storeDataToCache, (er, dt) => {
                    if (er) {
                        return res.status(500).json(clientResponseMsg(500));
                    }
                    else {
                        redis_1.default.expire(key, 2 * 60 * 60, (e, d) => {
                            if (e) {
                                return res.status(500).json(clientResponseMsg(500));
                            }
                            else {
                                return res.status(200).json({ 'data': typeList });
                            }
                        });
                    }
                });
            }
            else {
                for (const [k, v] of Object.entries(data)) {
                    typeList.push(JSON.parse(v));
                }
                return res.status(200).json({
                    'data': typeList
                });
            }
        }));
    }
    catch (err) {
        return res.status(500).send('Internal Server Error ' + err);
    }
});
/**
 *
 * @param code rest req error code
 * returns the client message based on code
 */
const clientResponseMsg = (code) => {
    let response = {};
    if (code === 400) {
        response = { 'data': 'Bad request. Server could not understand the request due to invalid syntax' };
    }
    else if (code === 404) {
        response = { 'data': 'No data found. Server can not find the requested resource data' };
    }
    else if (code === 500) {
        response = { 'data': 'Internal Server Error' };
    }
    return response;
};
/**
 * This method takes the input from searchGithubRepos() for searching: users / repository
 * axios for fetching the data
 * Users: if searchBy is users then making a sperate axios.get() call for each user data (getUser())
 * Repositories: getRepo() taking the required field for display in UI.
 */
const search = (searchBy, query) => __awaiter(void 0, void 0, void 0, function* () {
    let list = [];
    const response = yield axios_1.default.get(`https://api.github.com/search/${searchBy}?q=${encodeURIComponent(`${query}`)}`, { headers });
    const data = yield response.data;
    if (data.total_count === 0)
        return [];
    for (let i = 0; i < data.items.length; i++) {
        const obj = data.items[i];
        list.push(i + '');
        if (searchBy === repo) {
            list.push(JSON.stringify(getRepo(obj)));
        }
        else {
            list.push(JSON.stringify(yield getUser(obj)));
        }
    }
    return list;
});
/**
 * @param element : user object
 * seperate api call for each user & takes the required field for UI
 */
const getUser = (element) => __awaiter(void 0, void 0, void 0, function* () {
    const usrObj = yield axios_1.default.get(`https://api.github.com/users/${element.login}`, { headers });
    const username = usrObj.data.name === null ? usrObj.data.login : usrObj.data.name;
    const user = {
        'id': usrObj.data.id,
        'name': username,
        'profile_link': usrObj.data.html_url,
        'profile_pic': usrObj.data.avatar_url,
        'location': usrObj.data.location,
        'public_repos': usrObj.data.public_repos,
        'followers': usrObj.data.followers,
        'following': usrObj.data.following
    };
    return user;
});
/**
 * @param element : repo object
 * takes the required field for UI
 */
const getRepo = (element) => {
    const repoObj = element;
    const repo = {
        'id': repoObj.id,
        'name': repoObj.name,
        'full_name': repoObj.full_name,
        'profile_link': repoObj.html_url,
        'profile_pic': repoObj.owner.avatar_url,
        'description': repoObj.description === null ? '' : repoObj.description,
        'star': repoObj.star === undefined ? 0 : repoObj.star,
        'forks': repoObj.forks,
        'open_issues': repoObj.open_issues
    };
    return repo;
};
const searchApi = router.post('/', searchGithubRepos);
module.exports = searchApi;
