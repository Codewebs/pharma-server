var passport = require('passport');
var User = require('../tables/sequsr');
var Wish = require('../tables/seqwish')
var Guard = require('../tables/seqguard')
var Quartier = require('../tables/seqquartier')
var City = require('../tables/seqcity')
var Pharmacy = require('../tables/seqpharmacy')
var Sequelize = require('sequelize');
const haversineDistance = require('./modules.js')

module.exports = (app) => {
const Op = Sequelize.Op
app.post('/geToPharmacies',(req,res,next) => {
	Pharmacy.findAll({

	}).then((result)=>{
		if(result != null){
			res.status(200).send({
			  pharmacies:info
			})
		}else{
			res.status(401).send('Error');
		}
	})
})

app.post('/findByCity',(req,res,next) => {
	//console.log(req.body.city_id)
	City.hasMany(Quartier,{foreignKey:"city_id"})
	Quartier.belongsTo(City,{foreignKey:"city_id"})

	Quartier.hasMany(Pharmacy, {foreignKey:"quartier_id"})
	Pharmacy.belongsTo(Quartier, {foreignKey:"quartier_id"})

	Pharmacy.findAll({
		  include:[{model:Quartier, where:{city_id:req.body.city_id}, include:[{model:City}] }]
	}).then((result)=>{
		if(result != null){
			console.log(result)
			res.status(200).send({
			  pharmacies:result
			})
		}else{
			res.status(401).send('Error');
		}
	})
})

app.post('/findByDistance',(req,res,next) => {
	console.log(req.body.position)
	const latitude = req.body.position.latitude
	const longitude = req.body.position.longitude
	City.hasMany(Quartier,{foreignKey:"city_id"})
	Quartier.belongsTo(City,{foreignKey:"city_id"})

	Quartier.hasMany(Pharmacy, {foreignKey:"quartier_id"})
	Pharmacy.belongsTo(Quartier, {foreignKey:"quartier_id"})

	Pharmacy.findAll({
		  include:[{model:Quartier, include:[{model:City}] }],		  
	}).then((result)=>{
		var items = []
		if(result != null){
			for (let i = 0; i < result.length; i++)  {
				let lat = result[i].dataValues.lat
				let long = result[i].dataValues.long

				var item = {
					pharmacy_id:result[i].dataValues.pharmacy_id,
					pharmacy_name:result[i].dataValues.pharmacy_name,
					observation:result[i].dataValues.observation,
					image:result[i].dataValues.image,
					latitude:result[i].dataValues.lat,
					longitude:result[i].dataValues.long,
					phone:result[i].dataValues.phone,
					email:result[i].dataValues.email,
					quartier_name:result[i].dataValues.quartier.libelle,
					quartier_id:result[i].dataValues.quartier.quartier_id,
					city_name:result[i].dataValues.quartier.city.libelle,
					distance:haversineDistance([lat,long],[latitude,longitude],false)
				}
				
				items.push(item)
			}
			console.log(items)
			res.status(200).send({				
			  pharmacies:items
			})
		}else{
			res.status(401).send('Error');
		}
	})
})
app.post('/findGuard',(req,res,next) => {

	console.log(new Date(new Date() + 24 * 60 * 60 * 1000))
	console.log()
	console.log(req.body.dateNow)
	City.hasMany(Quartier,{foreignKey:"city_id"})
	Quartier.belongsTo(City,{foreignKey:"city_id"})

	Quartier.hasMany(Pharmacy, {foreignKey:"quartier_id"})
	Pharmacy.belongsTo(Quartier, {foreignKey:"quartier_id"})

	Pharmacy.hasMany(Guard,{foreignKey:"pharmacy_id"})
	Guard.belongsTo(Pharmacy,{foreignKey:"pharmacy_id"})

	Guard.findAll({
		  include:[{model:Pharmacy,
		  	include:[{model:Quartier,where:{city_id:req.body.city_id},
		  		include:[{model:City}],  }], required:true
		  						  }],
		  where:{
		  	dateDebut: {
			    [Op.lt]: new Date(new Date() + 24 * 60 * 60 * 1000),
			    [Op.gt]: req.body.dateNow,
			  }
		  }
		  
	}).then((result)=>{
		if(result != null){
			//console.log(result)
		
			res.status(200).send({
			  guards:result
			})
		}else{
			res.status(401).send('Error');
		}
	})
})

app.post('/findByQuartier',(req,res,next) => {	
	City.hasMany(Quartier,{foreignKey:"city_id"})
	Quartier.belongsTo(City,{foreignKey:"city_id"})

	Quartier.hasMany(Pharmacy, {foreignKey:"quartier_id"})
	Pharmacy.belongsTo(Quartier, {foreignKey:"quartier_id"})

	Pharmacy.findAll({
		  include:[{model:Quartier, where:{quartier_id:req.body.quartier_id},include:{model:City}}]
	}).then((result)=>{
		if(result != null){
			res.status(200).send({
			  pharmacies:info
			})
		}else{
			res.status(401).send('Error');
		}
	})
})


}