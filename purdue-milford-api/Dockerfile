FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["purdue-milford-api.csproj", "./"]
RUN dotnet restore "purdue-milford-api.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "purdue-milford-api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "purdue-milford-api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "purdue-milford-api.dll"]



# build and run container:
# docker build -t rcm3100d/purdue-milford-api .
# docker run -p 5000:80 rcm3100d/purdue-milford-api

#docker hub login:
# docker login -u rcm3100d -p dQuid5520S3rd

#publish container
# docker push rcm3100d/purdue-milford-api 

# sudo docker stop purdue-milford-api
# sudo docker rm purdue-milford-api
# sudo docker pull rcm3100d/purdue-milford-api 
# sudo docker run -d --restart always --name=purdue-milford-api -v /var/customers/purdue-milford-api:/app/Data -p 5014:80 rcm3100d/purdue-milford-api