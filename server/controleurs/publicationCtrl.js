// Imports
var models   = require('../models');
var asyncLib = require('async');
var jwtUtils = require('./../../jwtUtils');


// Constants
//const TITLE_LIMIT   = 2;
const CONTENT_LIMIT = 4;
const ITEMS_LIMIT   = 50;

// Routes
module.exports = {
  CreatePublication: (req, res) => {
  // Getting auth header

   //get token from cookies
  var headerAuth  = req.cookies.auth;
  console.log(req.cookies.auth)

  //decrypt token and get user id
  var userId  = jwtUtils.getUserId(headerAuth);
 
   
console.log('---------------', userId)
  // Params
  //var idComment   = req.body.idCommentaire;
  var texte = req.body.texte;
 

  asyncLib.waterfall([
    
    (done) => {
        models.Publication.create({
          texte: texte,
          //Attachement:Attachement,
          userId : userId,

        })
        .then((newPublication) => {
          done(newPublication);
        });
      } 
  ], (newPublication) => {
    if (newPublication) {
      return res.status(201).json(newPublication);
    } else {
      return res.status(500).json({ 'error': 'cannot post publication ' });
    }
  });
 },


  deletePublication: (req, res) => {
        
    var headerAuth  = req.cookies.auth;
    
    let userId      = jwtUtils.getUserId(headerAuth);

    asyncLib.waterfall([
        (done) => {
            models.Publication.destroy({
                where: { id: userId }
            })
            .then((userFound) => {
                done(userFound)
            })
            .catch((err) => {
                return res.status(400).json({ 'error': 'An error occurred' });
            });
        }],
        (userFound) => {
            if (userFound) {
                console.log(userFound)
                return res.status(200).json({'success':`Publication successfuly deleted`})
            }
            else {

                return res.status(404).json({ 'error': 'Publication was not found' });
            }
        });
},
    PutPublication: ( req, res) => {
      var headerAuth  = req.cookies.auth;
      let userId = jwtUtils.getUserId(headerAuth);
      
      let texte = req.body.texte;
      

    asyncLib.waterfall([
      (done) => {
          models.Publication.findOne({
              attributes: [ 'id','texte'],
              where :{ id: userId}
          })
          .then((userFound)=> {
              done(null,userFound);
          })
          .catch((err) => {
              return res.status(400).json({ 'error': 'Unable to verify publication' });
          });
      },
      (userFound, done) => {
          if(userFound) {
            userFound.update({
                texte: (texte ? texte : userFound.texte),
                
            })
            .then((userFound) => {
                done(userFound);
            })
            .catch((err) => {
                res.status(500).json({ 'error': 'cannot update publication' });
            });
          }
          else {
            res.status(404).json({ 'error': 'An error occurred' });
          }
        },
      ], 
      (userFound) => {
        if (userFound) {
            res.status(200).json({'success': 'Publication successfuly modified'})
        } 
        else {
          return res.status(500).json({ 'error': 'cannot update publication profile' });
        }
      });
    },

    getPublication: (req, res) => {
      var userId = req.params.id;
      
      models.Publication.findOne({
          attributes: ['id', 'texte'],
          where: {id: userId}
      })
      .then((user) => {
          if(user){
              res.status(201).json(user)   
          }
          else {
              res.status(404).json({'error': 'Publication not found'})
          }
      })
      .catch((err) =>  {
        console.log(err)
          res.status(500).json({'error': 'Cannot fetch Publication'});
      })
  },


    getAllPublication: (req, res) => {
      models.Publication.findAll({
          attributes: [ 'id', 'texte' ]
      })
      .then((users) => {
          res.status(200).json(users)
      })
      .catch((err) => {
          res.status(400).json({ 'error': 'An error occurred' });
      });
  },






}
