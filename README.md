# CS160-Project
https://github.com/DarrelTran/CS160-Project.git


## Prerequisites: 
  Node.js
  Intellij IDEA (or alternative way to run Apache Tomcat)
  MySQL


# --- Windows Setup ---

## Frontend Setup:

  Go to "source code" -> frontend
  
  Open the command line and run "npm install"


## Backend Setup:
  Open "source code" -> Backend in Intellij
  
  Go to File -> Plugins and install Smart Tomcat
  
  After it's installed, go to File -> Tomcat Server and click the + sign
  
    Make it point to the apache tomcat folder inside "source code" -> Backend (if it isn't already)
    
  Go to the dropdown to the left of the run button and open "Edit Configurations"
  
  If there isn't a configuration already there, click the + sign and choose "Smart Tomcat"
  
    "Tomcat server" is that same one you made in File -> Tomcat Server
    
    "Deployment directory" should be "source code" -> Backend -> src -> main -> webapp
    
    "Classpath dropdown" should point to Backend
    
    "Context path" should be /Backend
    
    "Server port" is 8080


## Database Setup:

  Make sure the MySQL80 service in Task Manager -> Services is running
  
  Open MySQL Workbench
  
  Go to "source code" and download createprojectdb.sql
  
  Load createprojectdb.sql into MySQL Workbench
  
  Run the .sql script by clicking the first yellow lightning/shock button

## Running The App:

  Go to "source code" -> frontend
  
  Open the command line and run "npm start"
  
  Run the backend server configuration
  
  To signup go to "Get Started"
  
    Note that the phone format is xxx-xxx-xxxx
