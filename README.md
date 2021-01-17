Radiopi is a personal project meant to transform a raspberry in a internet radio. It can also be used on mac. 

## System resources

* vlc (system)
* ycast

## Internet Radio List

* https://www.radio-browser.info/#!/

## Running Ycast server with systemd

Run Ycast server with systemd. The service file mjust be created at path `/etc/systemd/system`. The file must end with `.service` suffix.

```
# /etc/systemd/system/ycast.service

[Unit]
Description=YCast internet radio service
After=network.target

[Service]
Type=simple
User=pi
Group=pi
ExecStart=/usr/bin/python3 -m ycast -l 0.0.0.0 -p 9876 -c /home/pi/.config/radiopi/stations.yml

[Install]
WantedBy=multi-user.target
```

* [Manging systemd](https://www.digitalocean.com/community/tutorials/how-to-use-systemctl-to-manage-systemd-services-and-units)

## Settings
### PYTHONPATH

Append project's path to `$PYTHONPATH` varibale to make radiopi module available for python.

### My stations

Stations list are stored in a file named `stations.yml`. This file must reside in config folder placed in `$HOME/.config/radiopi`.

To prevent losing saved stations, the file is kept in `config/stations.yml` in project folder. This file can be symlinked in config folder.

```shell
$ cd path/to/project
$ ln -s config/stations.yml ~/.config/radiopi
```