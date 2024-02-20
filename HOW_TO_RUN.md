# How to run the application

To run the application, follow these steps:

2. From the root directory of the project run the following command to build and start the application using Docker Compose:

    ```bash
    docker-compose up -d --build
    ```

   This command will build the necessary Docker images and start the application in detached mode (`-d`).

3. Once the application is successfully started, you can access the UI by opening your web browser and navigating to:

    ```
    http://localhost:4200
    ```

4. The API is accessible at the following endpoint:

    ```
    http://localhost:3000
    ```

That's it! Your application should now be up and running with the UI accessible at `localhost:4200` and the API at `localhost:3000`.
