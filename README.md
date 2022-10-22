# nodejs
![image](https://user-images.githubusercontent.com/64120304/197337113-39d09d9e-7d42-4756-9484-9d01bb547bfa.png)

Step 1 — Creating a Basic HTTP Server
Let’s start by creating a server that returns plain text to the user. This will cover the key concepts required to set up a server, which will provide the foundation necessary to return more complex data formats like JSON.

First, we need to set up an accessible coding environment to do our exercises, as well as the others in the article. In the terminal, create a folder called first-servers:

mkdir first-servers
Then enter that folder:

cd first-servers
Now, create the file that will house the code:

touch hello.js
Open the file in a text editor. We will use nano as it’s available in the terminal:

nano hello.js
We start by loading the http module that’s standard with all Node.js installations. Add the following line to hello.js:

first-servers/hello.js
const http = require("http");
The http module contains the function to create the server, which we will see later on. If you would like to learn more about modules in Node.js, check out our How To Create a Node.js Module article.

Our next step will be to define two constants, the host and port that our server will be bound to:

first-servers/hello.js
...
const host = 'localhost';
const port = 8000;
As mentioned before, web servers accept requests from browsers and other clients. We may interact with a web server by entering a domain name, which is translated to an IP address by a DNS server. An IP address is a unique sequence of numbers that identify a machine on a network, like the internet. For more information on domain name concepts, take a look at our An Introduction to DNS Terminology, Components, and Concepts article.

The value localhost is a special private address that computers use to refer to themselves. It’s typically the equivalent of the internal IP address 127.0.0.1 and it’s only available to the local computer, not to any local networks we’ve joined or to the internet.

The port is a number that servers use as an endpoint or “door” to our IP address. In our example, we will use port 8000 for our web server. Ports 8080 and 8000 are typically used as default ports in development, and in most cases developers will use them rather than other ports for HTTP servers.

When we bind our server to this host and port, we will be able to reach our server by visiting http://localhost:8000 in a local browser.

Let’s add a special function, which in Node.js we call a request listener. This function is meant to handle an incoming HTTP request and return an HTTP response. This function must have two arguments, a request object and a response object. The request object captures all the data of the HTTP request that’s coming in. The response object is used to return HTTP responses for the server.

We want our first server to return this message whenever someone accesses it: "My first server!".

Let’s add that function next:

first-servers/hello.js
...

const requestListener = function (req, res) {
    res.writeHead(200);
    res.end("My first server!");
};
The function would usually be named based on what it does. For example, if we created a request listener function to return a list of books, we would likely name it listBooks(). Since this one is a sample case, we will use the generic name requestListener.

All request listener functions in Node.js accept two arguments: req and res (we can name them differently if we want). The HTTP request the user sends is captured in a Request object, which corresponds to the first argument, req. The HTTP response that we return to the user is formed by interacting with the Response object in second argument, res.

The first line res.writeHead(200); sets the HTTP status code of the response. HTTP status codes indicate how well an HTTP request was handled by the server. In this case, the status code 200 corresponds to "OK". If you are interested in learning about the various HTTP codes that your web servers can return with the meaning they signify, our guide on How To Troubleshoot Common HTTP Error Codes is a good place to start.

The next line of the function, res.end("My first server!");, writes the HTTP response back to the client who requested it. This function returns any data the server has to return. In this case, it’s returning text data.

Finally, we can now create our server and make use of our request listener:

first-servers/hello.js
...

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
Save and exit nano by pressing CTRL+X.

In the first line, we create a new server object via the http module’s createServer() function. This server accepts HTTP requests and passes them on to our requestListener() function.

After we create our server, we must bind it to a network address. We do that with the server.listen() method. It accepts three arguments: port, host, and a callback function that fires when the server begins to listen.

All of these arguments are optional, but it is a good idea to explicitly state which port and host we want a web server to use. When deploying web servers to different environments, knowing the port and host it is running on is required to set up load balancing or a DNS alias.

The callback function logs a message to our console so we can know when the server began listening to connections.

Note: Even though requestListener() does not use the req object, it must still be the first argument of the function.

With less than fifteen lines of code, we now have a web server. Let’s see it in action and test it end-to-end by running the program:

node hello.js
In the console, we will see this output:

Output
Server is running on http://localhost:8000
Notice that the prompt disappears. This is because a Node.js server is a long running process. It only exits if it encounters an error that causes it to crash and quit, or if we stop the Node.js process running the server.

In a separate terminal window, we’ll communicate with the server using cURL, a CLI tool to transfer data to and from a network. Enter the command to make an HTTP GET request to our running server:

curl http://localhost:8000
When we press ENTER, our terminal will show the following output:

Output
My first server!
We’ve now set up a server and got our first server response.

Let’s break down what happened when we tested our server. Using cURL, we sent a GET request to the server at http://localhost:8000. Our Node.js server listened to connections from that address. The server passed that request to the requestListener() function. The function returned text data with the status code 200. The server then sent that response back to cURL, which displayed the message in our terminal.

Before we continue, let’s exit our running server by pressing CTRL+C. This interrupts our server’s execution, bringing us back to the command line prompt.

In most web sites we visit or APIs we use, the server responses are seldom in plain text. We get HTML pages and JSON data as common response formats. In the next step, we will learn how to return HTTP responses in common data formats we encounter in the web.

Step 2 — Returning Different Types of Content
The response we return from a web server can take a variety of formats. JSON and HTML were mentioned before, and we can also return other text formats like XML and CSV. Finally, web servers can return non-text data like PDFs, zipped files, audio, and video.

In this article, in addition to the plain text we just returned, you’ll learn how to return the following types of data:

JSON
CSV
HTML
The three data types are all text-based, and are popular formats for delivering content on the web. Many server-side development languages and tools have support for returning these different data types. In the context of Node.js, we need to do two things:

Set the Content-Type header in our HTTP responses with the appropriate value.
Ensure that res.end() gets the data in the right format.
Let’s see this in action with some examples. The code we will be writing in this section and later ones have many similarities to the code we wrote previously. Most changes exist within the requestListener() function. Let’s create files with this “template code” to make future sections easier to follow.

Create a new file called html.js. This file will be used later to return HTML text in an HTTP response. We’ll put the template code here and copy it to the other servers that return various types.

In the terminal, enter the following:

touch html.js
Now open this file in a text editor:

nano html.js
Let’s copy the “template code.” Enter this in nano:

first-servers/html.js
const http = require("http");

const host = 'localhost';
const port = 8000;

const requestListener = function (req, res) {};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
Save and exit html.js with CTRL+X, then return to the terminal.

Now let’s copy this file into two new files. The first file will be to return CSV data in the HTTP response:

cp html.js csv.js
The second file will return a JSON response in the server:

cp html.js json.js
The remaining files will be for later exercises:

cp html.js htmlFile.js
cp html.js routes.js
We’re now set up to continue our exercises. Let’s begin with returning JSON.

Serving JSON
JavaScript Object Notation, commonly referred to as JSON, is a text-based data exchange format. As its name suggests, it is derived from JavaScript objects, but it is language independent, meaning it can be used by any programming language that can parse its syntax.

JSON is commonly used by APIs to accept and return data. Its popularity is due to lower data transfer size than previous data exchange standards like XML, as well as the tooling that exists that allow programs to parse them without excessive effort. If you’d like to learn more about JSON, you can read our guide on How To Work with JSON in JavaScript.

Open the json.js file with nano:

nano json.js
We want to return a JSON response. Let’s modify the requestListener() function to return the appropriate header all JSON responses have by changing the highlighted lines like so:

first-servers/json.js
...
const requestListener = function (req, res) {
    res.setHeader("Content-Type", "application/json");
};
...
The res.setHeader() method adds an HTTP header to the response. HTTP headers are additional information that can be attached to a request or a response. The res.setHeader() method takes two arguments: the header’s name and its value.

The Content-Type header is used to indicate the format of the data, also known as media type, that’s being sent with the request or response. In this case our Content-Type is application/json.

Now, let’s return JSON content to the user. Modify json.js so it looks like this:

first-servers/json.js
...
const requestListener = function (req, res) {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(`{"message": "This is a JSON response"}`);
};
...
Like before, we tell the user that their request was successful by returning a status code of 200. This time in the response.end() call, our string argument contains valid JSON.

Save and exit json.js by pressing CTRL+X. Now, let’s run the server with the node command:

node json.js
In another terminal, let’s reach the server by using cURL:

curl http://localhost:8000
As we press ENTER, we will see the following result:

Output
{"message": "This is a JSON response"}
We now have successfully returned a JSON response, just like many of the popular APIs we create apps with. Be sure to exit the running server with CTRL+C so we can return to the standard terminal prompt. Next, let’s look at another popular format of returning data: CSV.

Serving CSV
The Comma Separated Values (CSV) file format is a text standard that’s commonly used for providing tabular data. In most cases, each row is separated by a newline, and each item in the row is separated by a comma.

In our workspace, open the csv.js file with a text editor:

nano csv.js
Let’s add the following lines to our requestListener() function:

first-servers/csv.js
...
const requestListener = function (req, res) {
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment;filename=oceanpals.csv");
};
...
This time, our Content-Type indicates that a CSV file is being returned as the value is text/csv. The second header we add is Content-Disposition. This header tells the browser how to display the data, particularly in the browser or as a separate file.

When we return CSV responses, most modern browsers automatically download the file even if the Content-Disposition header is not set. However, when returning a CSV file we should still add this header as it allows us to set the name of the CSV file. In this case, we signal to the browser that this CSV file is an attachment and should be downloaded. We then tell the browser that the file’s name is oceanpals.csv.

Let’s write the CSV data in the HTTP response:

first-servers/csv.js
...
const requestListener = function (req, res) {
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment;filename=oceanpals.csv");
    res.writeHead(200);
    res.end(`id,name,email\n1,Sammy Shark,shark@ocean.com`);
};
...
Like before we return a 200/OK status with our response. This time, our call to res.end() has a string that’s a valid CSV. The comma separates the value in each column and the new line character (\n) separates the rows. We have two rows, one for the table header and one for the data.

We’ll test this server in the browser. Save csv.js and exit the editor with CTRL+X.

Run the server with the Node.js command:

node csv.js
In another Terminal, let’s reach the server by using cURL:

curl http://localhost:8000
