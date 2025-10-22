

Red='\033[0;31m'          # Red
Green='\033[0;32m'        # Green
White='\033[0;37m'        # White

# echo "color test"
# echo "${Red}Red ${Green}Green ${White}White"
# echo "end color test"
# exit 0

#this must be in the root of the app!!!
APPNAME="$(node -pe "require('./package.json')['name']")"
#APPVersion="$(node -pe "require('./package.json')['version']")"
echo "${White}Build and deploy $APPNAME to remote server 29"

# #write appname and version to a file
# echo "$APPNAME - $APPVersion" > dist/purdue-milford-app/assets/app-info.txt

#BUILD
echo "${White}(Step 1 of 3) Building $APPNAME app..."
if npm run build
then
    echo "${Green}Step 1 completed."
else
    echo "${Red}Script execution aborted! failed at Step 1."
    exit 1
fi

#Convert README.md to HTML and copy to the assets folder
printf "${White}(Step 1.5 of 3) Convert README.md to HTML..."
if markdown-it ../readme.md > dist/purdue-milford-app/assets/readme.html
then
    printf "${Green}step 1.5 converion completed\n"
else
    printf "${Red}Script execution aborted! failed at Step 1.\n"
    exit 1
fi


#DELETE OLD FROM REMOTE
echo "${White}(Step 2 of 3) rm $APPNAME files from remote..."
if ssh -t robert@192.168.0.29 "rm -r -f /var/www/$APPNAME"
then
    echo "${Green}Step 2 completed."
else 
 read -p "Problem detected. Continue (y/n)?" choice
    case "$choice" in 
    y|Y ) 
        echo "yes";;
    n|N ) 
        echo "${Red}Script execution aborted! failed at Step 2."
        exit 2;;
    * ) 
    echo "${Red}Script execution aborted! failed at Step 2."
    exit 2
    esac        
    
fi

#COPY NEW BUILD TO REMOTE
echo "${White}(Step 3 of 3) scp local $APPNAME files to remote..."
if scp -r dist/* robert@192.168.0.29:/var/www/
then
    echo "${Green}Step 3 completed."
else    
    echo "${Red}Script execution aborted! failed at Step 3."
    exit 3
fi

echo "${Green}All steps completed successfully."


#Change permissions
echo "${White}(Step 4 of 4) chmod 755 -R  /var/www/$APPNAME on remote..."

if ssh -t robert@192.168.0.29 "sudo chmod 755 -R /var/www/$APPNAME"
then
    echo "${Green}Step 4 completed."
else
    echo "${Red}Script execution aborted! failed at Step 4."
    exit 1
fi


# echo "${White}(Step 4 of 4) scp nginx config to remote..."
# if scp default root@192.168.0.29:/etc/nginx/sites-available/
# sync --rsync-path="sudo rsync" default root@192.168.0.29:/etc/nginx/sites-available/
# then
#     echo "${Green}Step 4 completed."
# else    
#     echo "${Red}Script execution aborted! failed at Step 4."
#     exit 3
# fi


# echo "${White}(Step 5 of 5) restart nginx"
# if robert@192.168.0.29 sudo systemctl restart nginx
# then
#     echo "${Green}Step 5 completed."
# else    
#     echo "${Red}Script execution aborted! failed at Step 5."
#     exit 3
# fi



echo "${Green}All steps completed successfully."