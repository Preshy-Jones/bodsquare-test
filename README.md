# Overview
This is backend server employing the use of rabbitmq miocroservice tool to allow users to create tasks and save them to a database, this application consists of two services each consisting of a nodejs application. The first service is the "task requesting service" which is responsible for receing the tasks from the user and publishing themm to the rabbitmq queue, the second service is the worker service which is responsible for consuming the tasks from the queue and saving them to the database. 
These two services communicate with each other using socker.io, the task requesting service emits an event to the worker service and the worker service listens to the event and consumes the task from the queue.



Tech stack used:

Nodejs
Typescript
Express
Mysql
Rabbiqmq
Socket.io

