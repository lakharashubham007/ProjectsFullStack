const { Videos } = require("../models");

const getAllVideos = async () => {
   const data  = await Videos.find({})
   return data
};

const getQueriedVideos = async (query) => {
   let data;
   if(query.title && !query.sortBy && !query.genres && !query.contentRating){
      // data  = await Videos.find( { $text: { $search: query.title.toLowerCase() } },(err,docs)=>{ return docs} )
      // data  = await Videos.find( { title:`/${query.title.toLowerCase()}/i` } )
      data  = await Videos.find( { title: { "$regex": query.title, "$options": "i" } } )

      return data

   }else if(!query.title && query.sortBy && !query.genres && !query.contentRating){
      if(query.sortBy === "viewCount"){
         let allVideos  = await Videos.find({})
         data = allVideos.sort((a,b)=>{
            return parseInt(b.viewCount) - parseInt(a.viewCount)
         })
         return data

      }else{
         let allVideos  = await Videos.find({})
         data = allVideos.sort((a,b)=>{
            return new Date(b.releaseDate) - new Date(a.releaseDate)
         })
         return data

      }
   }else if(!query.title && !query.sortBy && query.genres && !query.contentRating){
      let genres = query.genres.split(",");
      data  = await Videos.find( {genre:{$in:genres}})
      return data


   }else if(!query.title && !query.sortBy && !query.genres && query.contentRating){
      let rating = query.contentRating.split(",");
      data  = await Videos.find( {contentRating:{$in:rating}})
      return data


   }else{
         if(query.sortBy === "viewCount"){
            if(!query.genres){
               let rating = query.contentRating.split(",");
   
            let allVideos  = await Videos.find({$and:[
               { title: { "$regex": query.title, "$options": "i" } },
               {contentRating:{$in:rating}}
           ]})
            data = allVideos.sort((a,b)=>{
               return parseInt(b.viewCount) - parseInt(a.viewCount)
            })
            return data
            }
            if(!query.contentRating){
               let genres = query.genres.split(",");
            let allVideos  = await Videos.find({$and:[
               { title: { "$regex": query.title, "$options": "i" } },
               {genre:{$in:genres}}
           ]})
            data = allVideos.sort((a,b)=>{
               return parseInt(b.viewCount) - parseInt(a.viewCount)
            })
            return data
            }
            if(!query.title){
               let genres = query.genres.split(",");
            let rating = query.contentRating.split(",");
   
            let allVideos  = await Videos.find({$and:[
               {genre:{$in:genres}},
               {contentRating:{$in:rating}}
           ]})
            data = allVideos.sort((a,b)=>{
               return parseInt(b.viewCount) - parseInt(a.viewCount)
            })
            return data
            }
   
            let genres = query.genres.split(",");
            let rating = query.contentRating.split(",");
   
            let allVideos  = await Videos.find({$and:[
               { title: { "$regex": query.title, "$options": "i" } },
               {genre:{$in:genres}},
               {contentRating:{$in:rating}}
           ]})
            data = allVideos.sort((a,b)=>{
               return parseInt(b.viewCount) - parseInt(a.viewCount)
            })
            return data
   
         }else{
            if(!query.genres){
               let rating = query.contentRating.split(",");
   
               data  = await Videos.find({$and:[
                  { title: { "$regex": query.title, "$options": "i" } },
                  {contentRating:{$in:rating}}
              ]})
               return data
            }
            if(!query.contentRating){
               let genres = query.genres.split(",");
               data  = await Videos.find({$and:[
                  { title: { "$regex": query.title, "$options": "i" } },
                  {genre:{$in:genres}}
               ]})
               return data
            }
            if(!query.title){
               let genres = query.genres.split(",");
            let rating = query.contentRating.split(",");
   
            data  = await Videos.find({$and:[
               {genre:{$in:genres}},
               {contentRating:{$in:rating}}
           ]})
            return data
            }
            let genres = query.genres.split(",");
            let rating = query.contentRating.split(",");
            data  = await Videos.find({$and:[
               { title: { "$regex": query.title, "$options": "i" } },
               {genre:{$in:genres}},
               {contentRating:{$in:rating}}
           ]})
            return data
      }  
   }
};

const getVideoById = async (id) => {
   const data  = await Videos.findById(id.videoId);
   return data
};
 
const addVideo = async (video) => {
   const data  = await Videos.create(video);

   return data
};

const updateViews = async (id) => {
   const video  = await Videos.findById(id.videoId);
   if(video === null){
      return null
   }
   let count = video.viewCount+1;
   const data = await Videos.findByIdAndUpdate({_id:id.videoId},{$set: { viewCount:count}},{new:true}).then((docs)=>{
      return docs
   })
   return data
};

const updateVotes = async (req) => {
   const video  = await Videos.findById(req.params.videoId);
   if(video === null){
      return null
   }
   if(req.body.vote === "upVote"){
      let count;
      if(req.body.change === "increase"){
         count = video.votes.upVotes+1;
      }else{
         if(video.votes.upVotes !== 0){
            count = video.votes.upVotes-1;
         }else{
            count = 0;
         }
      }
   const data = await Videos.findByIdAndUpdate({_id:req.params.videoId},{$set: { "votes.upVotes":count}},{new:true}).then((docs)=>{
      return docs
   })
   return data
   }else{
      let count;
      if(req.body.change === "increase"){
         count = video.votes.downVotes+1;
      }else{
         if(video.votes.downVotes !== "0"){
            count = video.votes.downVotes-1;
         }else{
            count = 0;
         }
      }
   const data = await Videos.findByIdAndUpdate({_id:req.params.videoId},{$set: { "votes.downVotes":count}},{new:true}).then((docs)=>{
      return docs
   })
   return data
   }
   
};

module.exports = {
   getAllVideos,
   getVideoById,
   addVideo,
   updateViews,
   updateVotes,
   getQueriedVideos
 };

