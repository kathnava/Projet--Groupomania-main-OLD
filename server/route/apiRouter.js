const express = require('express');
const userCtrl = require('../controleurs/userCtrl');
const publicationCtrl = require('../controleurs/publicationCtrl');
const likesCtrl = require('../controleurs/likesCtrl');

// Router
exports.router = (function() {
    var apiRouter = express.Router();
    
//Routes
apiRouter.route('/register').post(userCtrl.addUser);
apiRouter.route('/me').get(userCtrl.getUserMe);
apiRouter.route('/login').post(userCtrl.login);
apiRouter.route('/put').put(userCtrl.PutUser);
apiRouter.route('/delete').delete(userCtrl.deleteUser);
apiRouter.route('/getUser/:id').get(userCtrl.getUser)
apiRouter.route('/getAll').get(userCtrl.getAllUsers)


//PROFIL
//apiRouter.route('/profil').get(userCtrl.myProfil);

//Commentaire Routes
apiRouter.route('/new/').post(publicationCtrl.CreatePublication);
apiRouter.route('/del').delete(publicationCtrl.deletePublication);
apiRouter.route('/update').put(publicationCtrl.PutPublication);
apiRouter.route('/getPublication/:id').get(publicationCtrl.getPublication)
apiRouter.route('/getAllPublication').get(publicationCtrl.getAllPublication)

//Likes Routes
//apiRouter.route('/Likes/new/').post(likesCtrl.likePost);
//apiRouter.route('/Likes/').get(likesCtrl.dislikePost);
return apiRouter;

})();
