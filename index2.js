const http=require('http');
const port =100;
function requestHandler(req,res){
    console.log(req.url);
    res.writeHead(200,{'content-type':'text/html'});
    res.end("<h1>hello sagar</h1>")
};
const server=http.createServer(requestHandler);
server.listen(port,function(err){
    if(err){
        console.log(err);
        return;
    }
    console.log("Server is running on port no:",port);
});