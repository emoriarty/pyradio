import os
import requests
from dotenv import load_dotenv
from lxml import etree as ET
from xml_parser import parse_dir, parse_station, parse_root

load_dotenv()


class Browser:
    HOST = os.getenv('YCAST_HOST')
    PORT = 9876
    URL = HOST + ':' + str(PORT)

    def __init__(self):
        self.parser = ET.XMLParser(ns_clean=True,
                                   recover=True,
                                   encoding='utf-8')

        req = requests.get(Browser.URL)
        index = parse_root(req.text)

        if len(index) == 0:
            raise Exception('Radio Browser did not return index endpoint')

        self.index_url = index[0]
        req = requests.get(self.index_url)
        self.directories = {}
        self.stations = {}
        self.__parse_dir(req.text)

    def fetch(self, directory, cache = True):
        if cache is True and directory in self.stations:
            return (self.directories[directory], self.stations[directory])

        req = requests.get(self.directories[directory]["url"])
        dirs = self.__parse_dir(req.text, directory)
        stations = self.__parse_station(req.text, directory)
        return (dirs, stations)

    def __parse_dir(self, doc, directory=None):
        titles, urls, counts = parse_dir(doc)
        dirs = {}

        for i in range(len(urls)):
            print(titles[i] + ' (' + counts[i] + '): ' + urls[i])
            dirs[titles[i]] = {
                "dir": directory,
                "title": titles[i],
                "url": urls[i],
                "count": counts[i]
            }

        self.directories = {**self.directories, **dirs}
        return dirs

    def __parse_station(self, doc, directory):
        names, urls, logos, mimes, bandrates = parse_station(doc)
        stations = []

        for i in range(len(urls)):
            print(names[i] + ' (' + urls[i] + '): ' + mimes[i])
            stations.append({
                "dir": directory,
                "name": names[i],
                "url": urls[i],
                "logo": logos[i],
                "mime": mimes[i],
                "bandrate": bandrates[i],
            })

        self.stations[directory] = stations
        return stations
