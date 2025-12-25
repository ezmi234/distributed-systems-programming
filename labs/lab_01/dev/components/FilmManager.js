class FilmManager{    
    constructor() {
        this.api = "/api/";
        this.films = this.api + "films/";
        this.privateFilms = this.films + "private/";
        this.publicFilms = this.films + "public/";
        this.invitedPublicFilms = "/change/me";
        this.reviewAssignments = "/change/me";
        this.users = this.api + "users/";
        this.usersAuthenticator = this.users + "authenticator/";
    }
}

module.exports = FilmManager;


