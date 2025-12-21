class FilmManager{    
    constructor() {
        this.api = "/api/"
        this.films = "/change/me";
        this.privateFilms = "/change/me";
        this.publicFilms = "/change/me";
        this.invitedPublicFilms = "/change/me";
        this.reviewAssignments = "/change/me";
        this.users = this.api + "users/";
        this.usersAuthenticator = "/change/me";
    }
}

module.exports = FilmManager;


