# HealthSystem
Project for SER360

This basic health system that allows medical professionals to record codes, enter patient information, and print and vist past codes. 

# Getting Started
Make sure you have NodeJS installed on your computer. You can find a proper download link [here](https://nodejs.org/en/). Download the full current version. 

## Working with NPM
In order to download the needed packages to run this, navigate to the root folder of this project and run `npm install`. This will automatically install all the packages located in package.json

## Running the Server
Navigate to the root directory of the project and run the command 'node server.js' which will start the web server on port 8080. [here](http://localhost:8080).

## Database
MongoDB is currently used for the database. Database config can be found under the config folder called "database.js". It is recommended to use [MongoDBAtlas](https://cloud.mongodb.com). Right now the database url provided is insecure and can be publically accessed, as it is publically linked here on GitHub. 

# Working with the Software

## Starting a code
Once navigating to the [homepage](http://localhost:8080), one can quickly start a code by hitting the heart icon, aka the "Start Code" button located in the middle of the page. This will immediately bring one to the active code screen where you can enter information regarding the state of the patient, the action being performed, the person completing the action, and any additional notes. 

## Working in an active code
One a code is active, one can either click the quick action buttons located on the bottom navigation bar - or manually enter information. When manually entering information, one can enter the action being performed, the current state of the patient, the person completing the action, and finally any notes that should be added. The new event is added once the "Submit" button is pressed. 

Everything entered is auto-saved as the action is completed. 

Any data entered can be edited by pressing the text and typing. Again, this is auto-saved. 

## Ending a code
Once a code is deemed "completed" one can simply click the top right hand button in the navigation bar labeled "Finish". Once pressed, the user is brought to a final information screen where patient ID, name, and other details are entered. This is also the final time in which code events previously entered can be edited. 

Data is auto-saved as it is entered and edited. 

Once the "Exit code" button is pressed, the code is saved and the user is brought back to the home screen. 

### Editing the code
Editing the code is as simple as clicking on the cell and typing new information. It is autosaved as you enter information. 

## Visiting a past code, and printing
On the homepage of the website the first list of codes under "Completed Codes" are all the completed codes, recent first, that can be viewed. 

Upon viewing a code all the information that was saved is presented. Upon clicking "print" the page can be printed. 

## Visiting a code that was not completed
Codes can be resumed, as soon as "edit" is selected. This will bring one to the active code screen as mentioned above. 

# Settings
The quick action buttons can be added and removed!  Buttons are displayed in the order they are entered in. 

## Adding a new quick action button
In the settings screen, go to "Add Custom Button". A popup will appear where you can entire "Action", "State", and Notes". Action is what is displayed on the button. Click save, to add the button. 

## Removing
Go to the action you wish to remove and click the red "remove" button to remove the button. 
