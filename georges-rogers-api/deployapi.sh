#!/bin/bash

Red='\033[0;31m'          # Red
Green='\033[0;32m'        # Green
White='\033[0;37m'        # White
#stop execution immediately if commmand exits with a non-zero status
#set 
#trap 'echo SCRIPT FAILED' EXIT

APPNAME="georges-rogers-api"
DATABASE="georges.db"
PORT="5017"
CUSTOMER=$APPNAME

echo "Step 1 of 9, Building $APPNAME container..."
if docker build -t rcm3100d/$APPNAME .
then
    echo "${Green}Step 1 completed"
else
    echo "${Red}Step 1 failed."
     exit 1
fi


echo "Step 2 of 9, logging into docker hub..."
if docker login -u rcm3100d
then
    echo "${Green}Step 2 completed"
else
    echo "${Red}Step 2 failed."
     exit 2
fi

echo "Step 3 of 9, pushing $APPNAME to docker hub..."
if docker push rcm3100d/$APPNAME
then
     echo "${Green}Step 3 completed"
else
    echo "${Red}Step 3 failed."
     exit 3
fi


echo "Stop/remove/pull/run $APPNAME container on remote"
echo "Step 4 of 9, stop docker container..."
if ssh -t robert@192.168.0.29 sudo docker stop $APPNAME
then
     echo "${Green}Step 4 completed"

     echo "Step 5 of 9, remove docker container..."
    if ssh -t robert@192.168.0.29 sudo docker rm $APPNAME
    then
        echo "${Green}Step 5 completed"
    else
        echo "${Red}Step 5 failed."
        exit 5
    fi
else
    echo "${Red}Step 4 docker container Stop failed. perhaps it doesn't exist?"
    echo "${White}"
    read -p "Continue anyway?(y/n)"  REPLY
    if [[ $REPLY =~ ^[Nn]$ ]]
    then
     exit 4
     fi
fi



echo "Step 6 of 9, pull image from docker hub..."
if ssh -t robert@192.168.0.29 sudo docker pull rcm3100d/$APPNAME 
then
     echo "${Green}Step 6 completed"
else
    echo "${Red}Step 6 failed."
     exit 6
fi


# echo  "${White}(Step 7 of 9) grant +rw permissions to /var/customers/georges-rogers-app on remote..."
# if ssh -t robert@192.168.0.29 sudo chmod 777 -R /var/customers/georges-rogers-app
# then
#     echo "${Green}Step 7 completed."
# else
#     echo "${Red}Script execution aborted! failed at Step 7."
#     exit 4
# fi



#COPY sqlite db TO REMOTE
echo "${White}(Step 8 of 9) scp local $APPNAME files to remotes /var/customers/$CUSTOMER"
ssh -t robert@192.168.0.29 "sudo mkdir -p /var/customers/$CUSTOMER && sudo chown -R robert:robert /var/customers/$CUSTOMER"
if scp -i "C:\Users\rober\.ssh\id_rsa" Data/** robert@192.168.0.29:/var/customers/$CUSTOMER
then
    echo "${Green}Step 8 completed."
else    
    echo "${Red}Database copy failed at Step 8."
    echo "${White}"
    read -p "Continue anyway?(y/n)"  REPLY
    if [[ $REPLY =~ ^[Nn]$ ]]
    then
     exit 7
     fi
fi

echo "Step 9 of 9, run docker container..."
if ssh -t robert@192.168.0.29 "sudo docker run -d --restart always --name=$APPNAME -v /var/customers/$CUSTOMER:/app/Data -p $PORT:80 rcm3100d/$APPNAME"
then
     echo "${Green}Step 9 completed"
else
    echo "${Red}Step 9 failed."
     exit 8
fi

sleep 3

echo "${Green}All steps completed successfully."
 echo "${Green}Deploy successfully completed!"
