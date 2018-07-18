# dPanda WebIDE
dPanda WebIDE is a portion of the dPanda project that contains only the WebIDE.
The WebIDE is "JSFiddle" style editor that supports XSLT and GatewayScript and the execution of the code.

![alt text](https://raw.githubusercontent.com/Tangram-Soft/dpanda.ide/master/dpandaide.jpeg "dPanda IDE")

## Getting Started

### Prerequisites
- docker
- git

### Installing
Start by cloning the project, this will create a new directory "dpanda.ide":
```sh
cd ..
git clone https://github.com/Tangram-Soft/dpanda.ide.git
```

You can either pull the docker container from ibm's repository or download another version from the access catalog and create an image out of it.
```sh
$ docker pull ibmcom/datapower:latest
```

Once the image is ready, create the container:
```sh
$ cd dpanda
$ docker create -it \
  -v $PWD/config:/drouter/config \
  -v $PWD/local:/drouter/local \
  -e DATAPOWER_ACCEPT_LICENSE=true \
  -e DATAPOWER_INTERACTIVE=true \
  --name idg.dpanda \
  ibmcom/datapower
```

You'll later need to:
ssh to the DataPower  (Assuming you are using 7.5.2.x or later):

```sh
co;crypto;keygen CN dpanda-gui rsa 2048 gen-sscert;exit;exit;switch default
co;host-alias dpanda.xml.mgmt;ip-address 127.0.0.1;exit;host-alias dpanda.localhost;ip-address 127.0.0.1;exit
user dor;access-level privileged;password dpanda;suppress-password-change;exit
dpanda
```
