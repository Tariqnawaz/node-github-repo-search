interface  User {
    'id': number,
    'name': string;
    'profile_link': string,
    'profile_pic': string,
    'location': string,
    'public_repos': string,
    'followers': number,
    'following': number
}
export = User;