class FilmManager{    
    constructor() {
        this.api = "/api/";
        this.films = this.api + "films/";
        this.privateFilms = this.films + "private/";
        this.publicFilms = this.films + "public/";
        this.invitedPublicFilms = this.publicFilms + "invited/"; 
        this.reviewAssignments = this.publicFilms + "assignments/"
        this.users = this.api + "users/";
        this.usersAuthenticator = this.users + "authenticator/";
    }
}

module.exports = FilmManager;


