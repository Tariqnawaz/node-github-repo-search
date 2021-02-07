import express, {Request, Response} from 'express';
import client from '../redis/redis';
import axios from 'axios';
import User from '../model/user';
import Repository from '../model/repository';

const router = express.Router();
router.use(express.urlencoded({extended:true}))
router.use(express.json());
const users:String='users';
const repo:String='repositories';

const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.github.v3.raw',
    'Authorization': 'token 8b83507fd980f4086e2e0357b6c4473ed920a2f2'
}

/**
 * This method takes the request from the body & output the response
 * searchBy: dropdown value (users/repository)
 * searchInput: input (search value)
 * query: forms the query for input search based on searchBy
 * key: unique identifiers for storing the cache in redis (hashes).
 * client: redis client checks if data is present in cache & then returns the cache value (from else block).
 *         if data is not available then searching for the data & stores in redis cache (if block).
 */

const searchGithubRepos = async (req: Request, res: Response)=>{
    try {
        let typeList:any=[];
        const {searchBy, searchInput} = req.body;
        if(searchBy === null || searchBy === '' ||  (searchBy!==users&&searchBy!==repo) ||
           searchInput === null || searchInput === null ||searchInput === '' || searchBy.length<3 ){
            return res.status(400).json(clientResponseMsg(400));
        }
        const query: string = searchBy === users ? `${searchInput} in:user&per_page=30` : `${searchInput}`;
        const key: string = searchBy+':'+searchInput;
        await client.hgetall(key, async(err, data) => {
            if(err) {return res.status(500).json(clientResponseMsg(500))};
            if(data === null){
                const storeDataToCache = await search(searchBy, query); // search req for users / repositories
                if(storeDataToCache.length===0){
                    return res.status(404).json(clientResponseMsg(404));
                }
                for (const [k, v] of Object.entries(storeDataToCache)) {
                    if(parseInt(k)%2!=0){
                        typeList.push(JSON.parse(v));
                    }
                }
                await client.hmset(key, storeDataToCache, (er,dt)=>{ // storing data to cache
                    if(er){return res.status(500).json(clientResponseMsg(500))}
                    else{
                        client.expire(key,2*60*60,(e,d)=>{ // key expires
                            if(e){return res.status(500).json(clientResponseMsg(500))}
                            else{
                                return res.status(200).json({'data':typeList});
                            }
                        });
                    }
                });
            }else{
                for (const [k, v] of Object.entries(data)) {
                    typeList.push(JSON.parse(v));
                }
                return res.status(200).json({
                    'data':typeList
                });
            }
        });
    } catch (err) {
        return res.status(500).send('Internal Server Error '+err);
    }
}

/**
 * 
 * @param code rest req error code 
 * returns the client message based on code
 */
const clientResponseMsg = (code: Number) =>{
    let response:{} = {};
    if(code === 400){
        response = {'data': 'Bad request. Server could not understand the request due to invalid syntax'};
    }else if(code === 404){
        response = {'data': 'No data found. Server can not find the requested resource data'};
    }else if(code === 500){
        response = {'data': 'Internal Server Error'};
    }
    return response;
}

/**
 * This method takes the input from searchGithubRepos() for searching: users / repository
 * axios for fetching the data
 * Users: if searchBy is users then making a sperate axios.get() call for each user data (getUser())
 * Repositories: getRepo() taking the required field for display in UI.
 */

const search = async (searchBy: string, query: string) =>{
    let list: string[] = [];
    const response = await axios.get(`https://api.github.com/search/${searchBy}?q=${encodeURIComponent(`${query}`)}`,{headers});
    const data = await response.data;
    if(data.total_count===0) return [];
    for(let i=0; i<data.items.length;i++){
        const obj = data.items[i];
        list.push(i+'');
        if(searchBy===repo){
            list.push(JSON.stringify(getRepo(obj)));
        }else{
            list.push(JSON.stringify(await getUser(obj)));
        }
    }
    return list;
}

/**
 * @param element : user object
 * seperate api call for each user & takes the required field for UI
 */
const getUser = async (element: any) => {
    const usrObj = await axios.get(`https://api.github.com/users/${element.login}`,{headers});
    const username = usrObj.data.name === null ? usrObj.data.login : usrObj.data.name;
    const user:User = {
        'id': usrObj.data.id,
        'name': username,
        'profile_link': usrObj.data.html_url,
        'profile_pic': usrObj.data.avatar_url,
        'location': usrObj.data.location,
        'public_repos': usrObj.data.public_repos,
        'followers': usrObj.data.followers,
        'following': usrObj.data.following
    }
    return user;
}

/**
 * @param element : repo object
 * takes the required field for UI
 */

const getRepo = (element: any) => {
    const repoObj = element;
    const repo:Repository = {
        'id': repoObj.id,
        'name': repoObj.name,
        'full_name': repoObj.full_name,
        'profile_link': repoObj.html_url,
        'profile_pic': repoObj.owner.avatar_url,
        'description': repoObj.description===null?'':repoObj.description,
        'star': repoObj.star === undefined ? 0 : repoObj.star,
        'forks': repoObj.forks,
        'open_issues': repoObj.open_issues
    }
    return repo;
}

const searchApi = router.post('/', searchGithubRepos)

export = searchApi;
