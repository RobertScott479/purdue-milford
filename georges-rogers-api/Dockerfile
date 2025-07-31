FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["georges-rogers-api.csproj", "./"]
RUN dotnet restore "georges-rogers-api.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "georges-rogers-api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "georges-rogers-api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "georges-rogers-api.dll"]



# build and run container:
# docker build -t rcm3100d/georges-rogers-api .
# docker run -p 5000:80 rcm3100d/georges-rogers-api

#docker hub login:
# docker login -u rcm3100d -p dQuid5520S3rd

#publish container
# docker push rcm3100d/georges-rogers-api 

# sudo docker stop georges-rogers-api
# sudo docker rm georges-rogers-api
# sudo docker pull rcm3100d/georges-rogers-api 
# sudo docker run -d --restart always --name=georges-rogers-api -v /var/customers/georges-rogers-api:/app/Data -p 5014:80 rcm3100d/georges-rogers-api