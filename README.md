# node-red-contrib-protobuf

This project features protobuf encode/decode nodes. Load a proto file, supply a desired type for encoding or decoding and have fun.

## Development

To setup your local development environment first clone this repository and then use docker to get your node-red environment up and running like this:

```bash
sudo docker run -p 1880:1880 --privileged -v $PWD:/tmp/node-red-contrib-protobuf -d --name nodered nodered/node-red-docker
```

After you saved your changes to the code update the installation within the container with this command:

```bash
sudo docker exec -u root -it nodered npm install /tmp/node-red-contrib-protobuf/ && sudo docker restart nodered
```

*Note on `--privileged` and `-u root`*: This is mostly required on linux machines with SELinux to avoid permission errors. Keep in mind that this is insecure and considered real bad practice. Alternativly configure your SELinux to allow access from the container to the local mounted volume in order to install the npm dependencies.

## Testing and Coverage-Report

First `npm install` for the dev dependencies. Tests, linting and code coverage are then available through:

```bash
npm test
npm run coverage
npm run lint
```

## Roadmap

* validate type from loaded .proto files
