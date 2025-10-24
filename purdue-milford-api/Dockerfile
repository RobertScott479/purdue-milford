#Get base SDK Image From Microsoft

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env
WORKDIR /app

#Copy the CSPROJ file and restore any dependencies(via NUGET)
COPY *.csproj ./
RUN dotnet restore

#Copy the project files and build our release
COPY . ./
RUN dotnet publish -c Release -o out


#Generate runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0     
WORKDIR /app
EXPOSE 80
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet","purdue-milford-api.dll"]

# build and run container:
# docker build -t rcm3100d/purdue-milford-api .
# docker run -p 5001:80 rcm3100d/purdue-milford-api -v /var/www/data:/var/data

#docker hub login:
# docker login -u rcm3100d -p dQuid5520S3rd

#publish container
# docker push rcm3100d/purdue-milford-api 

# sudo docker stop purdue-milford-api
# sudo docker rm purdue-milford-api
# sudo docker pull rcm3100d/purdue-milford-api 

## run container with volume mapping hosts /var/www/purdue-milford/data to containers /var/www/purdue-milford/data
# sudo docker run -d --restart always --name=purdue-milford-api -v /var/www/purdue-milford/data:/var/www/purdue-milford/data -p 5006:80 rcm3100d/purdue-milford-api  