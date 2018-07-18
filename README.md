# dPanda WebIDE
dPanda WebIDE is a portion of the dPanda project that contains only the WebIDE.
The WebIDE is "JSFiddle" style editor that supports XSLT and GatewayScript and the execution of the code.

![alt text](https://raw.githubusercontent.com/Tangram-Soft/dpanda.ide/master/dpandaide.jpeg "dPanda IDE")

## Getting Started

### Prerequisites
- docker
- git

### Installing
The docker image is available on Dockerhub.
```docker pull dorser/dpanda.ide
```

### Contributing
Start by cloning the project, this will create a new directory "dpanda.ide":
```sh
cd ..
git clone https://github.com/Tangram-Soft/dpanda.ide.git
```

Build the docker image using docker build.
```docker build -t tangramsoft/dpanda.ide
```


Once the image is ready, create the container (You can mount the config and local directories if needed):
```sh
$ cd dpanda
$ docker create -it \
  -e DATAPOWER_ACCEPT_LICENSE=true \
  -e DATAPOWER_INTERACTIVE=true \
  --name tangramsoft/dpanda.ide \
  ibmcom/datapower
```

You'll later need to:
ssh to the DataPower  (Assuming you are using 7.5.2.x or later):
