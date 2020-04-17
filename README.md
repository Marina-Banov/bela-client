# Bela client

In order to work on this project, make sure you have the following installed on your machine:

* npm
* nodejs
* Angular CLI

Clone or fork the repository, run `npm install` and you are ready to go.
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
Run `ng build` to build the project. The build artifacts will be stored in the `docs/` directory. Use the `--prod` flag for a production build.

## socket.io events emitted by the client

- newUser  
data: string  
description: data is the username that tries to join the game room.

- calledTrump  
data: string  
description: data is the trump to be set.

- calledScale  
data: string[]  
description: data is the set of card signs the player would like to call as scale.

- cardPlayed  
data: string  
description: data is the card sign the player would like to play.

- calledBela  
data: { card: string, called: boolean }  
description: data.called indicates whether the player would like to call the bela scale. data.card indicates the card in question. 

- userLeaves  
data: string  
description: data is the username of player that has left the room because the match ended.

- killedMatch  
data: string  
description: data is the username of player that refused to rejoin the game room and therefore all players should be soon kicked out as well.